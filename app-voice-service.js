(function (globalScope) {
  "use strict";

  async function requestVoiceBlob({
    endpoint = "/api/voicevox/tts",
    text = "",
    speakerRef = "",
    tone = {},
    provider = "voicevox",
    voiceModel = "",
    requestTimeoutMs = 20000,
    runtime = null,
    voiceCore = null,
  }) {
    if (!runtime || typeof runtime.fetchWithTimeout !== "function") {
      throw new Error("runtime_unavailable");
    }
    const parser = voiceCore && typeof voiceCore.parseSpeakerRef === "function"
      ? voiceCore.parseSpeakerRef
      : (ref) => ({ engineBase: "", speakerId: Number(ref) });
    const parsed = parser(speakerRef);
    if (Number.isNaN(parsed.speakerId)) {
      throw new Error("invalid_speaker_ref");
    }

    const res = await runtime.fetchWithTimeout(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        speaker: parsed.speakerId,
        engineBase: String(parsed.engineBase || ""),
        tone,
        provider,
        voiceModel,
      }),
    }, requestTimeoutMs);

    if (!res.ok) {
      const errPayload = runtime.parseJsonSafe ? await runtime.parseJsonSafe(res) : null;
      let detail = "";
      let retryAfter = 0;
      if (errPayload && typeof errPayload === "object") {
        retryAfter = Number(errPayload.retryAfter || 0);
        detail = errPayload.detail ? ` ${errPayload.detail}` : "";
      } else {
        const message = runtime.parseErrorDetail ? runtime.parseErrorDetail("tts_error_response_unreadable") : "tts_error_response_unreadable";
        detail = ` ${message}`;
      }
      const error = new Error(`tts 실패: HTTP ${res.status}${detail}`);
      error.status = res.status;
      error.retryAfter = Number.isFinite(retryAfter) ? retryAfter : 0;
      throw error;
    }

    return res.blob();
  }

  async function requestVoiceBlobWithRetry({
    maxTries = 3,
    sleep = null,
    voiceCore = null,
    ...requestArgs
  }) {
    if (typeof sleep !== "function") {
      throw new Error("sleep_unavailable");
    }
    for (let attempt = 1; attempt <= maxTries; attempt += 1) {
      try {
        return await requestVoiceBlob({
          ...requestArgs,
          voiceCore,
        });
      } catch (error) {
        const canRetry = voiceCore && typeof voiceCore.shouldRetryTts === "function"
          ? voiceCore.shouldRetryTts(error, attempt, maxTries)
          : (attempt < maxTries && (error.status === 429 || error.status === 502));
        if (!canRetry) {
          throw error;
        }
        const waitMs = voiceCore && typeof voiceCore.getRetryDelayMs === "function"
          ? voiceCore.getRetryDelayMs(error, attempt)
          : (error.retryAfter > 0 ? error.retryAfter * 1000 : 1000 * attempt);
        await sleep(waitMs);
      }
    }
    throw new Error("tts 재시도 실패");
  }

  function buildSpeakerOptions(speakers, voiceCore = null) {
    const makeRef = voiceCore && typeof voiceCore.makeSpeakerRef === "function"
      ? voiceCore.makeSpeakerRef
      : ((engineBase, styleId) => `${engineBase}@@${styleId}`);
    const options = [];
    const meta = new Map();
    (Array.isArray(speakers) ? speakers : []).forEach((speaker) => {
      const engineBase = String(speaker && speaker._engineBase || "");
      const engineName = String(speaker && speaker._engine || "");
      const styles = Array.isArray(speaker && speaker.styles) ? speaker.styles : [];
      styles.forEach((style) => {
        const ref = makeRef(engineBase, style && style.id);
        meta.set(ref, {
          speakerUuid: String(speaker && speaker.speaker_uuid || ""),
          speakerName: String(speaker && speaker.name || ""),
          styleName: String(style && style.name || ""),
          styleId: Number(style && style.id),
          engineBase,
          engineName,
        });
        options.push({ id: ref, label: `${speaker.name} - ${style.name}` });
      });
    });
    return { options, meta };
  }

  const api = {
    buildSpeakerOptions,
    requestVoiceBlob,
    requestVoiceBlobWithRetry,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  globalScope.AppVoiceService = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
