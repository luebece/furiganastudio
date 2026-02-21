const http = require("http");
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const HOST = "127.0.0.1";
const PORT = 8000;
const ROOT = __dirname;

const VOICEVOX_BASE_URL = process.env.VOICEVOX_BASE_URL || "http://127.0.0.1:50021";
const JISHO_SEARCH_URL = "https://jisho.org/api/v1/search/words";
const GOOGLE_TRANSLATE_URL = "https://translate.googleapis.com/translate_a/single";
const DICT_CACHE_TTL_MS = 1000 * 60 * 60 * 6;
const DICT_BATCH_LIMIT = 160;
const DICT_BATCH_CONCURRENCY = 6;
const LIVE2D_ZIP_MAX_BYTES = 260 * 1024 * 1024;
const TTS_PROVIDER = String(process.env.TTS_PROVIDER || "voicevox").trim().toLowerCase();
const RVC_CONVERT_URL = String(process.env.RVC_CONVERT_URL || "http://127.0.0.1:7897/convert").trim();
const RVC_DEFAULT_MODEL = String(process.env.RVC_DEFAULT_MODEL || "").trim();
const RVC_MODEL_VERSION = String(process.env.RVC_MODEL_VERSION || "v1").trim();
const RVC_TIMEOUT_MS = Math.max(3000, Number(process.env.RVC_TIMEOUT_MS || 12000));
const RVC_RETRY_COOLDOWN_MS = Math.max(1000, Number(process.env.RVC_RETRY_COOLDOWN_MS || 15000));
const RVC_FAIL_OPEN = String(process.env.RVC_FAIL_OPEN || "1").trim() !== "0";
const dictCache = new Map();
const translationCache = new Map();
let resolvedVoicevoxBaseUrl = "";
const speakerInfoCache = new Map();
let rvcUnavailableUntil = 0;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

function toPosixPath(inputPath) {
  return String(inputPath || "").replaceAll(path.sep, "/");
}

function formatExpressionLabel(fileName) {
  const base = String(fileName || "").replace(/\.exp3\.json$/i, "");
  const cleaned = base.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
  return cleaned || base || "Expression";
}

function formatMotionLabel(fileName, group = "", index = 0) {
  const base = String(fileName || "").replace(/\.motion3\.json$/i, "");
  const cleaned = base.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
  const g = String(group || "").trim();
  const i = Number(index);
  const title = cleaned || base || "Motion";
  if (!g) {
    return title;
  }
  return Number.isFinite(i) && i >= 0 ? `${g} ${i + 1} · ${title}` : `${g} · ${title}`;
}

function collectFilesByExtensions(rootDir, extensions) {
  const allow = new Set((Array.isArray(extensions) ? extensions : []).map((ext) => String(ext).toLowerCase()));
  const results = [];
  const stack = [rootDir];
  while (stack.length > 0) {
    const current = stack.pop();
    let entries = [];
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of entries) {
      if (entry.name.startsWith("._") || entry.name === "__MACOSX") {
        continue;
      }
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(full);
        continue;
      }
      const lowerName = entry.name.toLowerCase();
      const matched = [...allow].some((ext) => lowerName.endsWith(ext));
      if (entry.isFile() && matched) {
        results.push(full);
      }
    }
  }
  return results.sort((a, b) => a.localeCompare(b));
}

function hasValidModel3References(modelFullPath) {
  let parsed = null;
  try {
    parsed = JSON.parse(fs.readFileSync(modelFullPath, "utf8"));
  } catch {
    return false;
  }
  const modelDir = path.dirname(modelFullPath);
  const refs = parsed && parsed.FileReferences && typeof parsed.FileReferences === "object"
    ? parsed.FileReferences
    : null;
  if (!refs) {
    return false;
  }
  const moc = String(refs.Moc || "").trim();
  const textures = Array.isArray(refs.Textures) ? refs.Textures.map((t) => String(t || "").trim()).filter(Boolean) : [];
  if (!moc || textures.length === 0) {
    return false;
  }
  const mocFull = path.join(modelDir, moc);
  if (!fs.existsSync(mocFull)) {
    return false;
  }
  for (const tex of textures) {
    if (!fs.existsSync(path.join(modelDir, tex))) {
      return false;
    }
  }
  return true;
}

function readMocVersionFromModel(modelFullPath) {
  let parsed = null;
  try {
    parsed = JSON.parse(fs.readFileSync(modelFullPath, "utf8"));
  } catch {
    return 0;
  }
  const refs = parsed && parsed.FileReferences && typeof parsed.FileReferences === "object"
    ? parsed.FileReferences
    : null;
  const mocRel = String(refs && refs.Moc || "").trim();
  if (!mocRel) {
    return 0;
  }
  const mocPath = path.join(path.dirname(modelFullPath), mocRel);
  if (!fs.existsSync(mocPath)) {
    return 0;
  }
  try {
    const fd = fs.openSync(mocPath, "r");
    const header = Buffer.alloc(8);
    fs.readSync(fd, header, 0, 8, 0);
    fs.closeSync(fd);
    if (header.slice(0, 4).toString("ascii") !== "MOC3") {
      return 0;
    }
    return header.readUInt32LE(4);
  } catch {
    return 0;
  }
}

function readAutoHidePartIds(modelFullPath) {
  let parsed = null;
  try {
    parsed = JSON.parse(fs.readFileSync(modelFullPath, "utf8"));
  } catch {
    return [];
  }
  const refs = parsed && parsed.FileReferences && typeof parsed.FileReferences === "object"
    ? parsed.FileReferences
    : null;
  const displayInfoRel = String(refs && refs.DisplayInfo || "").trim();
  if (!displayInfoRel) {
    return [];
  }
  const displayInfoPath = path.join(path.dirname(modelFullPath), displayInfoRel);
  if (!fs.existsSync(displayInfoPath)) {
    return [];
  }
  try {
    const displayInfo = JSON.parse(fs.readFileSync(displayInfoPath, "utf8"));
    const parts = Array.isArray(displayInfo && displayInfo.Parts) ? displayInfo.Parts : [];
    const suspicious = /mark|watermark|logo|sample|demo|参考|샘플|미리보기/i;
    const ids = parts
      .filter((part) => {
        const id = String(part && part.Id || "");
        const name = String(part && part.Name || "");
        return suspicious.test(id) || suspicious.test(name);
      })
      .map((part) => String(part && part.Id || "").trim())
      .filter(Boolean);
    return [...new Set(ids)];
  } catch {
    return [];
  }
}

function listLive2dModels() {
  const live2dRoot = path.join(ROOT, "assets", "live2d");
  const allModels = collectFilesByExtensions(live2dRoot, [".model3.json"]);
  return allModels
    .filter((modelFullPath) => hasValidModel3References(modelFullPath))
    .map((modelFullPath) => {
    const modelDir = path.dirname(modelFullPath);
    const relativeModelPath = toPosixPath(path.relative(ROOT, modelFullPath));
    const key = relativeModelPath;
    const type = "live2d";
    const name = path.basename(modelFullPath).replace(/\.model3\.json$/i, "");

    let expressions = [];
    let motions = [];
    let parsedModel = null;
    try {
      parsedModel = JSON.parse(fs.readFileSync(modelFullPath, "utf8"));
    } catch {
      parsedModel = null;
    }
    if (type === "live2d") {
      try {
        expressions = fs.readdirSync(modelDir, { withFileTypes: true })
          .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".exp3.json"))
          .map((entry) => {
            const full = path.join(modelDir, entry.name);
            const rel = toPosixPath(path.relative(ROOT, full));
            return {
              value: rel,
              label: formatExpressionLabel(entry.name),
              file: rel,
            };
          })
          .sort((a, b) => a.label.localeCompare(b.label));
      } catch {
        expressions = [];
      }

      const refs = parsedModel && parsedModel.FileReferences && typeof parsedModel.FileReferences === "object"
        ? parsedModel.FileReferences
        : null;
      const rawMotions = refs && refs.Motions && typeof refs.Motions === "object" ? refs.Motions : null;
      if (rawMotions) {
        Object.entries(rawMotions).forEach(([groupName, items]) => {
          if (!Array.isArray(items)) {
            return;
          }
          items.forEach((item, idx) => {
            const fileRel = String(item && item.File || "").trim();
            if (!fileRel) {
              return;
            }
            const full = path.join(modelDir, fileRel);
            const rel = toPosixPath(path.relative(ROOT, full));
            motions.push({
              value: `${groupName}:${idx}`,
              label: formatMotionLabel(fileRel, groupName, idx),
              file: rel,
              group: String(groupName || ""),
              index: idx,
            });
          });
        });
      }

      if (motions.length === 0) {
        try {
          const guessed = fs.readdirSync(modelDir, { withFileTypes: true })
            .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".motion3.json"))
            .map((entry, idx) => {
              const full = path.join(modelDir, entry.name);
              const rel = toPosixPath(path.relative(ROOT, full));
              return {
                value: `Auto:${idx}`,
                label: formatMotionLabel(entry.name, "Auto", idx),
                file: rel,
                group: "Auto",
                index: idx,
              };
            });
          motions = guessed;
        } catch {
          motions = [];
        }
      }
      motions = motions.sort((a, b) => a.label.localeCompare(b.label));
    }

    const mocVersion = readMocVersionFromModel(modelFullPath);
    const autoHidePartIds = readAutoHidePartIds(modelFullPath);
    return {
      key,
      type,
      name,
      modelPath: relativeModelPath,
      mocVersion,
      compatible: mocVersion > 0 ? mocVersion <= 5 : true,
      autoHidePartIds,
      expressions,
      motions,
    };
    });
}

function sanitizeUploadSegment(value) {
  return String(value || "")
    .trim()
    .replace(/[<>:"|?*\0]/g, "_")
    .replace(/\s+/g, "_")
    .replace(/^\.+$/, "")
    .slice(0, 100);
}

function sanitizeUploadPathSegment(value) {
  return String(value || "")
    .replace(/[<>:"|?*\0]/g, "_")
    .replace(/^\.+$/, "")
    .slice(0, 140);
}

function normalizeUploadRelativePath(inputPath) {
  const parts = String(inputPath || "")
    .replaceAll("\\", "/")
    .split("/")
    .map((part) => sanitizeUploadPathSegment(part))
    .filter((part) => part && part !== "." && part !== "..");
  return parts.join("/");
}

function listRelativeFiles(rootDir) {
  const results = [];
  const stack = [rootDir];
  while (stack.length > 0) {
    const current = stack.pop();
    let entries = [];
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(full);
      } else if (entry.isFile()) {
        results.push(toPosixPath(path.relative(rootDir, full)));
      }
    }
  }
  return results;
}

function normalizePathKey(relPath) {
  return String(relPath || "")
    .toLowerCase()
    .replace(/\\/g, "/")
    .replace(/[ _\-]+/g, "")
    .replace(/[^a-z0-9./]/g, "");
}

function findBestPathCandidate(refPath, allFiles) {
  const target = String(refPath || "");
  if (!target) {
    return "";
  }
  if (allFiles.includes(target)) {
    return target;
  }
  const swappedSpace = target.replaceAll(" ", "_");
  if (allFiles.includes(swappedSpace)) {
    return swappedSpace;
  }
  const swappedUnderscore = target.replaceAll("_", " ");
  if (allFiles.includes(swappedUnderscore)) {
    return swappedUnderscore;
  }
  const key = normalizePathKey(target);
  if (!key) {
    return "";
  }
  const matches = allFiles.filter((file) => normalizePathKey(file) === key);
  if (matches.length === 1) {
    return matches[0];
  }
  return "";
}

function repairModel3ReferencesInRoot(rootDir) {
  const allFiles = listRelativeFiles(rootDir);
  const modelFiles = allFiles.filter((f) => f.toLowerCase().endsWith(".model3.json"));
  for (const relModel of modelFiles) {
    const fullModel = path.join(rootDir, relModel);
    let parsed = null;
    try {
      parsed = JSON.parse(fs.readFileSync(fullModel, "utf8"));
    } catch {
      continue;
    }
    const refs = parsed && parsed.FileReferences && typeof parsed.FileReferences === "object"
      ? parsed.FileReferences
      : null;
    if (!refs) {
      continue;
    }
    let touched = false;
    const patchOne = (keyName) => {
      const value = String(refs[keyName] || "");
      if (!value) {
        return;
      }
      const candidate = findBestPathCandidate(value, allFiles);
      if (candidate && candidate !== value) {
        refs[keyName] = candidate;
        touched = true;
        return;
      }
      if (!candidate) {
        // Optional references may be omitted by some exported models.
        if (keyName === "DisplayInfo" || keyName === "Physics") {
          delete refs[keyName];
          touched = true;
        }
      }
    };
    patchOne("Moc");
    patchOne("Physics");
    patchOne("DisplayInfo");
    if (Array.isArray(refs.Textures)) {
      refs.Textures = refs.Textures.map((item) => {
        const value = String(item || "");
        const candidate = findBestPathCandidate(value, allFiles);
        if (candidate && candidate !== value) {
          touched = true;
          return candidate;
        }
        return value;
      });
    }
    if (touched) {
      fs.writeFileSync(fullModel, JSON.stringify(parsed, null, "\t"));
    }
  }
}

function writeLive2dUploadFile({ modelFolder, relativePath, dataBase64 }) {
  const folder = sanitizeUploadSegment(modelFolder) || `model_${Date.now()}`;
  const safeRel = normalizeUploadRelativePath(relativePath);
  if (!safeRel) {
    throw new Error("upload_relative_path_invalid");
  }
  const uploadRoot = path.join(ROOT, "assets", "live2d", "user_uploads", folder);
  const target = path.join(uploadRoot, safeRel);
  if (!target.startsWith(uploadRoot)) {
    throw new Error("upload_path_traversal_blocked");
  }
  fs.mkdirSync(path.dirname(target), { recursive: true });
  const raw = String(dataBase64 || "").replace(/^data:[^,]+,/, "").trim();
  const bin = Buffer.from(raw, "base64");
  fs.writeFileSync(target, bin);
  repairModel3ReferencesInRoot(uploadRoot);
  return {
    folder,
    relativePath: toPosixPath(path.relative(ROOT, target)),
  };
}

function writeLive2dUploadZip({ modelFolder, dataBase64 }) {
  const folder = sanitizeUploadSegment(modelFolder) || `model_${Date.now()}`;
  const uploadRoot = path.join(ROOT, "assets", "live2d", "user_uploads", folder);
  fs.mkdirSync(uploadRoot, { recursive: true });

  const raw = String(dataBase64 || "").replace(/^data:[^,]+,/, "").trim();
  const zipBin = Buffer.from(raw, "base64");
  if (!zipBin.length) {
    throw new Error("zip_data_empty");
  }
  if (zipBin.length > LIVE2D_ZIP_MAX_BYTES) {
    throw new Error("zip_too_large");
  }

  const zipPath = path.join(uploadRoot, "__upload__.zip");
  fs.writeFileSync(zipPath, zipBin);
  try {
    const escapedZip = zipPath.replace(/'/g, "''");
    const escapedOut = uploadRoot.replace(/'/g, "''");
    const psCommand = `Expand-Archive -LiteralPath '${escapedZip}' -DestinationPath '${escapedOut}' -Force`;
    const attempts = [
      () => execFileSync("unzip", ["-o", "-qq", zipPath, "-d", uploadRoot], { stdio: "pipe", timeout: 120000 }),
      () => execFileSync("powershell.exe", ["-NoProfile", "-Command", psCommand], { stdio: "pipe", timeout: 120000 }),
      () => execFileSync("pwsh", ["-NoProfile", "-Command", psCommand], { stdio: "pipe", timeout: 120000 }),
      () => execFileSync("tar", ["-xf", zipPath, "-C", uploadRoot], { stdio: "pipe", timeout: 120000 }),
    ];
    let extracted = false;
    const errs = [];
    for (const run of attempts) {
      try {
        run();
        extracted = true;
        break;
      } catch (error) {
        errs.push(String(error && error.message || error));
      }
    }
    if (!extracted) {
      throw new Error(errs.join(" | "));
    }
  } catch (error) {
    throw new Error(`zip_extract_failed:${String(error.message || error)}`);
  } finally {
    try {
      fs.unlinkSync(zipPath);
    } catch {
      // no-op
    }
  }
  repairModel3ReferencesInRoot(uploadRoot);

  return {
    folder,
    uploadRoot: toPosixPath(path.relative(ROOT, uploadRoot)),
  };
}

function sendJson(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data));
}

async function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8");
      if (!raw) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error("invalid_json"));
      }
    });
    req.on("error", reject);
  });
}

function normalizeSpeakers(data) {
  if (!Array.isArray(data)) {
    return null;
  }

  if (data.length === 0) {
    return [];
  }

  if (data[0] && Array.isArray(data[0].styles)) {
    return data;
  }

  return null;
}

function inferEngineName(baseUrl) {
  return String(baseUrl).includes(":10101") ? "aivis" : "voicevox";
}

async function fetchSpeakersFromEngine(baseUrl) {
  const res = await fetch(`${baseUrl}/speakers`);
  if (!res.ok) {
    throw new Error(`speaker_http_${res.status}`);
  }
  const data = await res.json();
  const normalized = normalizeSpeakers(data);
  if (!normalized) {
    throw new Error("speaker_invalid_response");
  }

  const engineName = inferEngineName(baseUrl);
  const labelPrefix = engineName === "aivis" ? "Aivis" : "VOICEVOX";
  const speakers = normalized.map((speaker) => ({
    ...speaker,
    name: `[${labelPrefix}] ${speaker.name}`,
    _engineBase: baseUrl,
    _engine: engineName,
  }));

  return { baseUrl, engine: engineName, speakers };
}

async function getAvailableVoiceEngines() {
  const candidates = getVoicevoxBaseCandidates();
  const result = [];
  for (const baseUrl of candidates) {
    // eslint-disable-next-line no-await-in-loop
    const ok = await canReachVoicevox(baseUrl);
    if (!ok) {
      continue;
    }
    result.push({
      baseUrl,
      engine: inferEngineName(baseUrl),
    });
  }
  return result;
}

async function getSpeakers() {
  const engines = await getAvailableVoiceEngines();
  if (engines.length === 0) {
    throw new Error("speaker_engine_unreachable");
  }

  const settled = await Promise.allSettled(
    engines.map((engine) => fetchSpeakersFromEngine(engine.baseUrl))
  );

  const speakers = [];
  const activeEngines = [];
  settled.forEach((item) => {
    if (item.status === "fulfilled") {
      speakers.push(...item.value.speakers);
      activeEngines.push({ baseUrl: item.value.baseUrl, engine: item.value.engine });
    }
  });

  if (speakers.length === 0) {
    throw new Error("speaker_all_failed");
  }

  return { speakers, activeEngines };
}

function toAbsoluteVoicevoxUrl(baseUrl, value) {
  const raw = String(value || "").trim();
  if (!raw) {
    return "";
  }
  if (raw.startsWith("image/")) {
    return `data:${raw}`;
  }
  if (raw.startsWith("base64,")) {
    return `data:image/png;${raw}`;
  }
  // Some VOICEVOX builds may return raw base64 without a data URL prefix.
  if (/^[A-Za-z0-9+/=\r\n]+$/.test(raw) && raw.length > 200) {
    return `data:image/png;base64,${raw.replace(/\s+/g, "")}`;
  }
  if (raw.startsWith("data:") || raw.startsWith("http://") || raw.startsWith("https://")) {
    return raw;
  }
  if (raw.startsWith("/")) {
    return `${baseUrl}${raw}`;
  }
  return `${baseUrl}/${raw}`;
}

function normalizeSpeakerInfo(baseUrl, data) {
  if (!data || typeof data !== "object") {
    return null;
  }

  const styleInfos = Array.isArray(data.style_infos) ? data.style_infos : [];
  const styleIcons = {};
  for (const info of styleInfos) {
    const styleId = Number(info && info.id);
    if (Number.isNaN(styleId)) {
      continue;
    }
    const icon = toAbsoluteVoicevoxUrl(
      baseUrl,
      info.icon || info.portrait || info.icon_path || info.portrait_path || ""
    );
    if (icon) {
      styleIcons[String(styleId)] = icon;
    }
  }

  return {
    speakerUuid: String(data.speaker_uuid || ""),
    policy: String(data.policy || ""),
    portrait: toAbsoluteVoicevoxUrl(baseUrl, data.portrait || data.icon || data.portrait_path || ""),
    styleIcons,
  };
}

async function getSpeakerInfo(speakerUuid, engineBase = "") {
  const uuid = String(speakerUuid || "").trim();
  if (!uuid) {
    throw new Error("speaker_uuid_required");
  }

  const baseUrl = engineBase ? String(engineBase).trim() : await resolveVoicevoxBaseUrl();
  const cacheKey = `${baseUrl}::${uuid}`;
  const cached = speakerInfoCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const infoRes = await fetch(`${baseUrl}/speaker_info?speaker_uuid=${encodeURIComponent(uuid)}`);
  if (!infoRes.ok) {
    throw new Error(`speaker_info_http_${infoRes.status}`);
  }
  const infoData = await infoRes.json();
  const normalized = normalizeSpeakerInfo(baseUrl, infoData);
  if (!normalized) {
    throw new Error("speaker_info_invalid_response");
  }
  speakerInfoCache.set(cacheKey, normalized);
  return normalized;
}

async function getVoicevoxVersion() {
  const baseUrl = await resolveVoicevoxBaseUrl();
  const res = await fetch(`${baseUrl}/version`);
  if (!res.ok) {
    throw new Error(`voicevox_version_http_${res.status}`);
  }
  return {
    version: await res.text(),
    baseUrl,
  };
}

function clampNumber(value, min, max, fallback) {
  const n = Number(value);
  if (!Number.isFinite(n)) {
    return fallback;
  }
  return Math.min(max, Math.max(min, n));
}

function resolveTtsProvider(provider) {
  const requested = String(provider || "").trim().toLowerCase();
  if (requested === "voicevox" || requested === "voicevox_rvc") {
    return requested;
  }
  return TTS_PROVIDER === "voicevox" || TTS_PROVIDER === "voicevox_rvc"
    ? TTS_PROVIDER
    : "voicevox";
}

function normalizeToneSettings(raw) {
  const tone = raw && typeof raw === "object" ? raw : {};
  return {
    speedScale: clampNumber(tone.speedScale, 0.5, 2.0, 1.0),
    pitchScale: clampNumber(tone.pitchScale, -0.15, 0.15, 0.0),
    intonationScale: clampNumber(tone.intonationScale, 0.5, 2.0, 1.0),
    volumeScale: clampNumber(tone.volumeScale, 0.3, 2.0, 1.0),
  };
}

async function synthesizeLocalVoice(text, speaker, engineBase = "", toneSettings = null) {
  const baseUrl = engineBase ? String(engineBase).trim() : await resolveVoicevoxBaseUrl();
  const queryUrl =
    `${baseUrl}/audio_query?text=${encodeURIComponent(text)}&speaker=${encodeURIComponent(String(speaker))}`;
  const queryRes = await fetch(queryUrl, { method: "POST" });
  if (!queryRes.ok) {
    throw new Error(`audio_query_http_${queryRes.status}`);
  }
  const audioQuery = await queryRes.json();
  const tone = normalizeToneSettings(toneSettings);
  audioQuery.speedScale = tone.speedScale;
  audioQuery.pitchScale = tone.pitchScale;
  audioQuery.intonationScale = tone.intonationScale;
  audioQuery.volumeScale = tone.volumeScale;

  const synthesisUrl = `${baseUrl}/synthesis?speaker=${encodeURIComponent(String(speaker))}`;
  const synthesisRes = await fetch(synthesisUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(audioQuery),
  });
  if (!synthesisRes.ok) {
    throw new Error(`synthesis_http_${synthesisRes.status}`);
  }

  return Buffer.from(await synthesisRes.arrayBuffer());
}

async function convertVoiceWithRvc(wavBuffer, modelName = "") {
  if (Date.now() < rvcUnavailableUntil) {
    throw new Error("rvc_temporarily_unavailable");
  }
  const model = String(modelName || RVC_DEFAULT_MODEL || "").trim();
  if (!RVC_CONVERT_URL) {
    throw new Error("rvc_convert_url_missing");
  }
  if (!model) {
    throw new Error("rvc_model_missing");
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), RVC_TIMEOUT_MS);
  try {
    const res = await fetch(RVC_CONVERT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        version: RVC_MODEL_VERSION,
        audioBase64: Buffer.from(wavBuffer).toString("base64"),
        format: "wav",
      }),
      signal: controller.signal,
    });
    if (!res.ok) {
      throw new Error(`rvc_http_${res.status}`);
    }

    const contentType = String(res.headers.get("content-type") || "").toLowerCase();
    if (contentType.includes("audio/")) {
      return Buffer.from(await res.arrayBuffer());
    }

    const data = await res.json();
    const raw =
      String(data.audioBase64 || data.data || data.wavBase64 || "")
        .replace(/^data:[^,]+,/, "")
        .trim();
    if (!raw) {
      throw new Error("rvc_empty_audio");
    }
    return Buffer.from(raw, "base64");
  } catch (error) {
    rvcUnavailableUntil = Date.now() + RVC_RETRY_COOLDOWN_MS;
    if (error && error.name === "AbortError") {
      throw new Error("rvc_timeout");
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

async function synthesizeVoicePipeline({
  text,
  speaker,
  engineBase = "",
  toneSettings = null,
  provider = "",
  voiceModel = "",
}) {
  const baseWav = await synthesizeLocalVoice(text, speaker, engineBase, toneSettings);
  const resolvedProvider = resolveTtsProvider(provider);
  const model = String(voiceModel || RVC_DEFAULT_MODEL || "").trim();
  const baseProvider = engineBase ? `voice-local:${engineBase}` : "voice-local:auto";

  if (resolvedProvider !== "voicevox_rvc") {
    return { wav: baseWav, provider: baseProvider };
  }

  try {
    const convertedWav = await convertVoiceWithRvc(baseWav, model);
    return { wav: convertedWav, provider: `voice-local+rvc:${model || "default"}` };
  } catch (error) {
    if (!RVC_FAIL_OPEN) {
      throw new Error(`rvc_failed:${String(error.message || error)}`);
    }
    return { wav: baseWav, provider: `${baseProvider}|rvc_fallback` };
  }
}

function getVoicevoxBaseCandidates() {
  const candidates = [
    VOICEVOX_BASE_URL,
    "http://127.0.0.1:50021",
    "http://localhost:50021",
    "http://127.0.0.1:10101",
    "http://localhost:10101",
  ];

  try {
    const resolv = fs.readFileSync("/etc/resolv.conf", "utf8");
    const match = resolv.match(/^\s*nameserver\s+([0-9.]+)\s*$/m);
    if (match && match[1]) {
      candidates.push(`http://${match[1]}:50021`);
      candidates.push(`http://${match[1]}:10101`);
    }
  } catch {
    // non-WSL environments may not have this file
  }

  return [...new Set(candidates.map((url) => String(url || "").trim()).filter(Boolean))];
}

async function canReachVoicevox(baseUrl) {
  try {
    const res = await fetch(`${baseUrl}/version`);
    return res.ok;
  } catch {
    return false;
  }
}

async function resolveVoicevoxBaseUrl() {
  if (resolvedVoicevoxBaseUrl) {
    const ok = await canReachVoicevox(resolvedVoicevoxBaseUrl);
    if (ok) {
      return resolvedVoicevoxBaseUrl;
    }
    resolvedVoicevoxBaseUrl = "";
  }

  const candidates = getVoicevoxBaseCandidates();
  for (const baseUrl of candidates) {
    const ok = await canReachVoicevox(baseUrl);
    if (ok) {
      resolvedVoicevoxBaseUrl = baseUrl;
      return baseUrl;
    }
  }

  throw new Error("voicevox_engine_unreachable");
}

function pickBestJishoEntry(entries, query) {
  if (!Array.isArray(entries) || entries.length === 0) {
    return null;
  }

  const q = String(query || "").trim();
  if (!q) {
    return entries[0];
  }

  const exact = entries.find((entry) => {
    const japanese = Array.isArray(entry.japanese) ? entry.japanese : [];
    return japanese.some((jp) => String(jp && jp.word || "") === q || String(jp && jp.reading || "") === q);
  });
  if (exact) {
    return exact;
  }

  const includes = entries.find((entry) => {
    const japanese = Array.isArray(entry.japanese) ? entry.japanese : [];
    return japanese.some((jp) => {
      const w = String(jp && jp.word || "");
      const r = String(jp && jp.reading || "");
      return w.includes(q) || r.includes(q);
    });
  });
  if (includes) {
    return includes;
  }

  return entries[0];
}

function extractJlptLevels(entry) {
  const levels = new Set();

  const jlptRaw = Array.isArray(entry && entry.jlpt) ? entry.jlpt : [];
  jlptRaw.forEach((level) => {
    const match = String(level || "").toLowerCase().match(/jlpt-n([1-5])/);
    if (match) {
      levels.add(`N${match[1]}`);
    }
  });

  const tagsRaw = Array.isArray(entry && entry.tags) ? entry.tags : [];
  tagsRaw.forEach((tag) => {
    const match = String(tag || "").toLowerCase().match(/jlpt\s*n([1-5])/);
    if (match) {
      levels.add(`N${match[1]}`);
    }
  });

  return [...levels];
}

function normalizeMeaning(data, queryWord = "") {
  if (!data || !Array.isArray(data.data) || data.data.length === 0) {
    return null;
  }

  const top = pickBestJishoEntry(data.data, queryWord);
  if (!top) {
    return null;
  }
  const japanese = Array.isArray(top.japanese) && top.japanese[0] ? top.japanese[0] : {};
  const word = japanese.word || "";
  const reading = japanese.reading || "";

  const senses = Array.isArray(top.senses) ? top.senses : [];
  const defs = [];
  const parts = new Set();
  for (const sense of senses.slice(0, 3)) {
    const englishDefs = Array.isArray(sense.english_definitions) ? sense.english_definitions : [];
    const pos = Array.isArray(sense.parts_of_speech) ? sense.parts_of_speech : [];
    pos.forEach((p) => {
      const part = String(p || "").trim();
      if (part && !part.includes("Wikipedia")) {
        parts.add(part);
      }
    });
    if (englishDefs.length > 0) {
      defs.push(englishDefs.slice(0, 4).join(", "));
    }
  }

  const jlpt = extractJlptLevels(top);

  return {
    word,
    reading,
    meanings: defs,
    partsOfSpeech: [...parts].slice(0, 3),
    jlpt: [...new Set(jlpt)],
  };
}

async function getDictionaryMeaning(word) {
  const key = String(word || "").trim();
  if (!key) {
    return null;
  }

  const now = Date.now();
  const cached = dictCache.get(key);
  if (cached && now - cached.ts < DICT_CACHE_TTL_MS) {
    return cached.value;
  }

  const url = `${JISHO_SEARCH_URL}?keyword=${encodeURIComponent(key)}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`dict_http_${res.status}`);
  }
  const data = await res.json();
  const value = normalizeMeaning(data, key);
  if (value && Array.isArray(value.meanings) && value.meanings.length > 0) {
    try {
      const translated = await translateEnToKoLinesCached(value.meanings);
      if (translated.length === value.meanings.length) {
        value.meanings = translated;
      }
    } catch {
      // fallback: keep original english meanings
    }
  }
  dictCache.set(key, { ts: now, value });
  return value;
}

function parseGoogleTranslate(data) {
  if (!Array.isArray(data) || !Array.isArray(data[0])) {
    return "";
  }
  return data[0].map((seg) => (Array.isArray(seg) ? String(seg[0] || "") : "")).join("");
}

async function translateEnToKo(text) {
  const key = String(text || "").trim();
  if (!key) {
    return "";
  }

  const now = Date.now();
  const cached = translationCache.get(key);
  if (cached && now - cached.ts < DICT_CACHE_TTL_MS) {
    return cached.value;
  }

  const url =
    `${GOOGLE_TRANSLATE_URL}?client=gtx&sl=en&tl=ko&dt=t&q=${encodeURIComponent(key)}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`translate_http_${res.status}`);
  }
  const data = await res.json();
  const translated = parseGoogleTranslate(data).trim();
  if (!translated) {
    throw new Error("translate_empty");
  }
  translationCache.set(key, { ts: now, value: translated });
  return translated;
}

async function translateEnToKoLinesCached(lines) {
  const source = lines.join("\n");
  const translated = await translateEnToKo(source);
  const split = translated
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  if (split.length === lines.length) {
    return split;
  }
  return lines.map((line, idx) => split[idx] || line);
}

async function getDictionaryMeaningsBatch(words) {
  const input = Array.isArray(words) ? words : [];
  const uniqueWords = [...new Set(
    input.map((word) => String(word || "").trim().slice(0, 64)).filter(Boolean)
  )].slice(0, DICT_BATCH_LIMIT);

  const results = {};
  if (uniqueWords.length === 0) {
    return results;
  }

  let cursor = 0;
  async function worker() {
    while (cursor < uniqueWords.length) {
      const idx = cursor;
      cursor += 1;
      const word = uniqueWords[idx];
      try {
        results[word] = await getDictionaryMeaning(word);
      } catch {
        results[word] = null;
      }
    }
  }

  const workers = Array.from(
    { length: Math.min(DICT_BATCH_CONCURRENCY, uniqueWords.length) },
    () => worker()
  );
  await Promise.all(workers);
  return results;
}

function sendApiError(res, status, errorCode, detail = "", extra = {}) {
  return sendJson(res, status, {
    ok: false,
    error: String(errorCode || "server_error"),
    ...(detail ? { detail: String(detail) } : {}),
    ...extra,
  });
}

async function handleVoicevoxHealth(req, res) {
  try {
    const engines = await getAvailableVoiceEngines();
    if (engines.length === 0) {
      throw new Error("local_engine_unreachable");
    }
    const versions = await Promise.all(
      engines.map(async (engine) => {
        const versionRes = await fetch(`${engine.baseUrl}/version`);
        const version = versionRes.ok ? (await versionRes.text()).trim() : "";
        return {
          engine: engine.engine,
          baseUrl: engine.baseUrl,
          version,
        };
      })
    );
    return sendJson(res, 200, { ok: true, mode: "voice-local-multi", engines: versions });
  } catch (error) {
    return sendApiError(
      res,
      502,
      "local_engine_unreachable",
      String(error.message || error),
      { mode: "voice-local-multi" }
    );
  }
}

async function handleVoicevoxSpeakers(req, res) {
  const result = await getSpeakers();
  res.writeHead(200, {
    "Content-Type": "application/json; charset=utf-8",
    "X-Speaker-Source": "local-multi",
    "X-Voice-Engines": result.activeEngines.map((e) => `${e.engine}:${e.baseUrl}`).join(", "),
  });
  res.end(JSON.stringify(result.speakers));
}

async function handleLive2dModels(req, res) {
  const models = listLive2dModels();
  return sendJson(res, 200, { ok: true, models });
}

async function handleLive2dUploadFile(req, res) {
  const body = await readBody(req);
  const modelFolder = String(body.modelFolder || "").trim();
  const relativePath = String(body.relativePath || "").trim();
  const dataBase64 = String(body.data || "").trim();
  if (!relativePath || !dataBase64) {
    return sendApiError(res, 400, "relativePath,data_required");
  }
  try {
    const result = writeLive2dUploadFile({ modelFolder, relativePath, dataBase64 });
    return sendJson(res, 200, { ok: true, ...result });
  } catch (error) {
    return sendApiError(res, 400, "upload_failed", String(error.message || error));
  }
}

async function handleLive2dUploadZip(req, res) {
  const body = await readBody(req);
  const modelFolder = String(body.modelFolder || "").trim();
  const dataBase64 = String(body.data || "").trim();
  if (!dataBase64) {
    return sendApiError(res, 400, "data_required");
  }
  try {
    const result = writeLive2dUploadZip({ modelFolder, dataBase64 });
    return sendJson(res, 200, { ok: true, ...result });
  } catch (error) {
    return sendApiError(res, 400, "upload_zip_failed", String(error.message || error));
  }
}

async function handleVoicevoxSpeakerInfo(req, res, url) {
  const speakerUuid = String(url.searchParams.get("speaker_uuid") || "").trim();
  const engineBase = String(url.searchParams.get("engine") || "").trim();
  if (!speakerUuid) {
    return sendApiError(res, 400, "speaker_uuid_required");
  }
  try {
    const info = await getSpeakerInfo(speakerUuid, engineBase);
    return sendJson(res, 200, { ok: true, info });
  } catch (error) {
    return sendApiError(res, 502, "speaker_info_failed", String(error.message || error));
  }
}

async function handleVoicevoxTts(req, res) {
  const body = await readBody(req);
  const text = String(body.text || "").trim();
  const speaker = Number(body.speaker);
  const engineBase = String(body.engineBase || "").trim();
  const tone = body.tone;
  const provider = String(body.provider || "").trim();
  const voiceModel = String(body.voiceModel || "").trim();

  if (!text || Number.isNaN(speaker)) {
    return sendApiError(res, 400, "text,speaker_required");
  }

  try {
    const { wav, provider: providerTag } = await synthesizeVoicePipeline({
      text,
      speaker,
      engineBase,
      toneSettings: tone,
      provider,
      voiceModel,
    });

    res.writeHead(200, {
      "Content-Type": "audio/wav",
      "Content-Length": wav.length,
      "X-TTS-Provider": providerTag,
    });
    res.end(wav);
    return;
  } catch (error) {
    return sendApiError(res, 502, "local_voicevox_failed", String(error.message || error));
  }
}

async function handleDictGet(req, res, url) {
  const wordRaw = String(url.searchParams.get("word") || "").trim();
  const word = wordRaw.slice(0, 64);
  if (!word) {
    return sendApiError(res, 400, "word_required");
  }

  try {
    const result = await getDictionaryMeaning(word);
    return sendJson(res, 200, { ok: true, result });
  } catch (error) {
    return sendApiError(res, 502, "dict_failed", String(error.message || error));
  }
}

async function handleDictBatch(req, res) {
  const body = await readBody(req);
  const words = Array.isArray(body.words) ? body.words : [];
  if (words.length === 0) {
    return sendApiError(res, 400, "words_required");
  }

  try {
    const results = await getDictionaryMeaningsBatch(words);
    return sendJson(res, 200, { ok: true, results });
  } catch (error) {
    return sendApiError(res, 502, "dict_batch_failed", String(error.message || error));
  }
}

const API_ROUTES = {
  "GET /api/voicevox/health": handleVoicevoxHealth,
  "GET /api/voicevox/speakers": handleVoicevoxSpeakers,
  "GET /api/live2d/models": handleLive2dModels,
  "POST /api/live2d/upload-file": handleLive2dUploadFile,
  "POST /api/live2d/upload-zip": handleLive2dUploadZip,
  "GET /api/voicevox/speaker-info": handleVoicevoxSpeakerInfo,
  "POST /api/voicevox/tts": handleVoicevoxTts,
  "GET /api/dict": handleDictGet,
  "POST /api/dict/batch": handleDictBatch,
};

async function handleApi(req, res, url) {
  const routeKey = `${String(req.method || "").toUpperCase()} ${url.pathname}`;
  const handler = API_ROUTES[routeKey];
  if (!handler) {
    return sendApiError(res, 404, "not_found");
  }
  try {
    return await handler(req, res, url);
  } catch (error) {
    return sendApiError(res, 500, "server_error", String(error.message || error));
  }
}

function serveStatic(req, res, url) {
  let pathname = url.pathname;
  if (pathname === "/") {
    pathname = "/index.html";
  }

  try {
    pathname = decodeURIComponent(pathname);
  } catch {
    res.writeHead(400);
    res.end("bad request");
    return;
  }

  const fullPath = path.join(ROOT, pathname);
  if (!fullPath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end("forbidden");
    return;
  }

  fs.readFile(fullPath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("not found");
      return;
    }

    const ext = path.extname(fullPath).toLowerCase();
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    res.end(data);
  });
}

function createAppServer() {
  return http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (url.pathname.startsWith("/api/")) {
      handleApi(req, res, url);
      return;
    }

    serveStatic(req, res, url);
  });
}

let serverInstance = null;

function startServer(options = {}) {
  const host = String(options.host || HOST);
  const port = Number(options.port || PORT);
  const quiet = Boolean(options.quiet);
  if (serverInstance && serverInstance.listening) {
    return Promise.resolve(serverInstance);
  }
  serverInstance = createAppServer();
  return new Promise((resolve, reject) => {
    const onError = (error) => {
      serverInstance = null;
      reject(error);
    };
    serverInstance.once("error", onError);
    serverInstance.listen(port, host, () => {
      serverInstance.off("error", onError);
      if (!quiet) {
        console.log(`Server running: http://${host}:${port}`);
      }
      resolve(serverInstance);
    });
  });
}

function stopServer() {
  if (!serverInstance) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    serverInstance.close(() => {
      serverInstance = null;
      resolve();
    });
  });
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

module.exports = {
  startServer,
  stopServer,
};
