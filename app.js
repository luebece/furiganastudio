const inputText = document.getElementById("inputText");
const appGrid = document.getElementById("appGrid");
const gridResizer = document.getElementById("gridResizer");
const convertBtn = document.getElementById("convertBtn");
const clearBtn = document.getElementById("clearBtn");
const toggleMeaningBtn = document.getElementById("toggleMeaningBtn");
const output = document.getElementById("output");
const statusEl = document.getElementById("status");
const voiceStatusEl = document.getElementById("voiceStatus");
const speakerSelect = document.getElementById("speakerSelect");
const speakerFace = document.getElementById("speakerFace");
const speakerName = document.getElementById("speakerName");
const speakerDesc = document.getElementById("speakerDesc");
const playModeSelect = document.getElementById("playModeSelect");
const reloadVoicesBtn = document.getElementById("reloadVoicesBtn");
const playAllBtn = document.getElementById("playAllBtn");
const downloadAllBtn = document.getElementById("downloadAllBtn");
const startQuizBtn = document.getElementById("startQuizBtn");
const quizDifficultyMenu = document.getElementById("quizDifficultyMenu");
const scrollResultTopBtn = document.getElementById("scrollResultTopBtn");
const scrollResultBottomBtn = document.getElementById("scrollResultBottomBtn");
const speedRange = document.getElementById("speedRange");
const speedValue = document.getElementById("speedValue");
const characterProfileUploadBtn = document.getElementById("characterProfileUploadBtn");
const characterProfileClearBtn = document.getElementById("characterProfileClearBtn");
const characterProfileGuideBtn = document.getElementById("characterProfileGuideBtn");
const characterProfileInput = document.getElementById("characterProfileInput");
const characterProfileSelect = document.getElementById("characterProfileSelect");
const characterProfileStatusEl = document.getElementById("characterProfileStatus");
const characterProfileGuideModal = document.getElementById("characterProfileGuideModal");
const characterProfileGuideCloseBtn = document.getElementById("characterProfileGuideCloseBtn");
const novelQuickLinksBtn = document.getElementById("novelQuickLinksBtn");
const novelQuickLinksModal = document.getElementById("novelQuickLinksModal");
const novelQuickLinksCloseBtn = document.getElementById("novelQuickLinksCloseBtn");
const tonePresetSelect = document.getElementById("tonePresetSelect");
const tonePitchRange = document.getElementById("tonePitchRange");
const tonePitchValue = document.getElementById("tonePitchValue");
const toneIntonationRange = document.getElementById("toneIntonationRange");
const toneIntonationValue = document.getElementById("toneIntonationValue");
const fontDecreaseBtn = document.getElementById("fontDecreaseBtn");
const fontResetBtn = document.getElementById("fontResetBtn");
const fontIncreaseBtn = document.getElementById("fontIncreaseBtn");
const fontSizeValue = document.getElementById("fontSizeValue");
const wordbookAnchor = document.getElementById("wordbookAnchor");
const toggleWordbookBtn = document.getElementById("toggleWordbookBtn");
const wordbookPanel = document.getElementById("wordbookPanel");
const wordbookGrid = document.getElementById("wordbookGrid");
const wordbookCount = document.getElementById("wordbookCount");
const prepProgress = document.getElementById("prepProgress");
const prepBar = document.getElementById("prepBar");
const prepLabel = document.getElementById("prepLabel");
const live2dStage = document.getElementById("live2dStage");
const live2dStageShell = live2dStage ? live2dStage.parentElement : null;
const live2dStatusEl = document.getElementById("live2dStatus");
const affectionStatusEl = document.getElementById("affectionStatus");
const live2dModelSelect = document.getElementById("live2dModelSelect");
const live2dExpressionSelect = document.getElementById("live2dExpressionSelect");
const live2dMotionSelect = document.getElementById("live2dMotionSelect");
const playLive2dMotionBtn = document.getElementById("playLive2dMotionBtn");
const autoActingBtn = document.getElementById("autoActingBtn");
const uploadLive2dBtn = document.getElementById("uploadLive2dBtn");
const live2dUploadInput = document.getElementById("live2dUploadInput");
const uploadLive2dZipBtn = document.getElementById("uploadLive2dZipBtn");
const live2dZipUploadInput = document.getElementById("live2dZipUploadInput");
const live2dSpeechBubble = document.getElementById("live2dSpeechBubble");

let tokenizer = null;
let sentences = [];
let activeAudio = null;
let activeAudioUrl = "";
let playToken = 0;
let playbackRate = 1.0;
let isPlaying = false;
let playingMode = "";
let activeSentenceIndex = -1;
let prefetchToken = 0;
let preparedCount = 0;
let preparedTotal = 0;
let isAudioPreparing = false;
let isAudioPrepared = false;
let meaningMode = false;
let meaningHoverSeq = 0;
let currentMeaningTarget = null;
let isMeaningPreparing = false;
let meaningPrepareSeq = 0;
let outputFontScale = 1;
let gridSplitPercent = 44;
let live2dApp = null;
let live2dModel = null;
let live2dCore = null;
let activeAvatarType = "live2d";
let live2dAudioCtx = null;
let live2dAnalyser = null;
let live2dLipData = null;
let live2dLipSource = null;
let live2dLipTimer = 0;
let live2dMouseX = 0;
let live2dMouseY = 0;
let live2dCurrentMouth = 0;
let live2dCurrentEyeX = 0;
let live2dCurrentEyeY = 0;
let live2dReactionKind = "";
let live2dReactionStartAt = 0;
let live2dReactionDurationMs = 0;
let live2dSpeechTimer = 0;
let live2dExpressionParams = [];
let autoActingEnabled = true;
let avatarAimX = 0;
let avatarAimY = 0;
let manualLookExpireAt = 0;
let autoLookTargetX = 0;
let autoLookTargetY = 0;
let autoLookNextAt = 0;
let autoExpressionTimer = 0;
let autoExpressionRevertTimer = 0;
let autoExpressionSeq = 0;
let affectionScore = 0;
let mumbleTimer = 0;
let mumbleSeq = 0;
let cheekDragActive = false;
let cheekDragPointerId = -1;
let cheekDragStartX = 0;
let cheekDragStartY = 0;
let pointerDownAvatarPart = "default";
let cheekPullX = 0;
let cheekPullY = 0;
let live2dViewDragActive = false;
let live2dViewDragPointerId = -1;
let live2dViewDragStartX = 0;
let live2dViewDragStartY = 0;
let live2dViewDragBaseX = 0;
let live2dViewDragBaseY = 0;
let live2dViewTransformsLoaded = false;
const live2dViewTransforms = new Map();
let pendingAmbientRetry = null;
let live2dCatalog = [];
let live2dCurrentModelKey = "";
let live2dExpressionOptions = [{ value: "", label: "기본 표정", file: "" }];
let live2dMotionOptions = [{ value: "", label: "기본 대기", group: "", index: -1, file: "" }];
let live2dStageEventsBound = false;
let live2dProceduralMotionKind = "";
let live2dProceduralMotionStartAt = 0;
let live2dProceduralMotionDurationMs = 0;
let live2dProceduralMotionIntensity = 1;
let live2dPatchedModelConfigUrl = "";
const badLive2dModelKeys = new Set();
let live2dDisplayRuntimeMode = "";
const live2dExpressionCache = new Map();
const live2dExpressionDefaults = new Map();
let live2dExpressionActiveIds = new Set();
let threeModule = null;
let gltfLoaderModule = null;
let fbxLoaderModule = null;
let vrmModule = null;
let threeRenderer = null;
let threeScene = null;
let threeCamera = null;
let threeClock = null;
let threeAvatarRoot = null;
let threeAnimMixers = [];
let threeRenderTimer = 0;
let threeVrmInstance = null;
let threeIdleTime = 0;
let vrmBlinkElapsed = 0;
let vrmBlinkInterval = 2.6;

const audioCache = new Map();
let audioCacheTotalBytes = 0;
const meaningCache = new Map();
const meaningInFlight = new Map();
const wordbookMap = new Map();
const speakerStyleMeta = new Map();
const speakerInfoCache = new Map();
const meaningTooltip = document.createElement("div");
meaningTooltip.id = "meaningTooltip";
document.body.appendChild(meaningTooltip);

convertBtn.disabled = true;
playAllBtn.disabled = true;
downloadAllBtn.disabled = true;
if (live2dMotionSelect) {
  live2dMotionSelect.disabled = true;
}
if (playLive2dMotionBtn) {
  playLive2dMotionBtn.disabled = true;
}

const RE_KATAKANA = /[\u30A0-\u30FF]/;
const RE_KANA = /[\u3040-\u30FF]/;
const RE_KANJI = /[\u4E00-\u9FFF\u3400-\u4DBF\uF900-\uFAFF]/;
const RE_JAPANESE_CHAR = /[\u3040-\u30FF\u4E00-\u9FFF]/;
const RE_SENTENCE_END = /[。．.!?！？]/;
const KUROMOJI_SCRIPTS = [
  "https://cdn.jsdelivr.net/npm/kuromoji@0.1.2/build/kuromoji.js",
  "https://unpkg.com/kuromoji@0.1.2/build/kuromoji.js",
  "https://cdn.jsdelivr.net/gh/takuyaa/kuromoji.js@master/build/kuromoji.js",
];
const LIVE2D_SCRIPT_CANDIDATES = {
  pixi: [
    "https://cdn.jsdelivr.net/npm/pixi.js@6.5.10/dist/browser/pixi.min.js",
    "https://unpkg.com/pixi.js@6.5.10/dist/browser/pixi.min.js",
  ],
  core4: [
    "https://cdn.jsdelivr.net/npm/live2dcubismcore@1.0.2/live2dcubismcore.min.js",
    "https://unpkg.com/live2dcubismcore@1.0.2/live2dcubismcore.min.js",
    "https://cdn.jsdelivr.net/npm/live2dcubismcore@1.1.0/live2dcubismcore.min.js",
    "https://unpkg.com/live2dcubismcore@1.1.0/live2dcubismcore.min.js",
  ],
  core5: [
    // Official Cubism Core distribution (latest; includes Cubism 5+ support).
    "https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js",
    // Fallbacks in case the official host is blocked.
    "https://cdn.jsdelivr.net/npm/live2dcubismcore@1.1.0/live2dcubismcore.min.js",
    "https://unpkg.com/live2dcubismcore@1.1.0/live2dcubismcore.min.js",
  ],
  display4: [
    "https://cdn.jsdelivr.net/npm/pixi-live2d-display@0.4.0/dist/cubism4.min.js",
    "https://unpkg.com/pixi-live2d-display@0.4.0/dist/cubism4.min.js",
  ],
};
const LIVE2D_VIEW_ZOOM = 2.0;
const LIVE2D_TOP_MARGIN_PX = 6;
const LIVE2D_MODEL_ZOOM_OVERRIDES = [
  { match: "huohuo.model3.json", zoom: 1.28 },
  { match: "kitu_re23.model3.json", zoom: 1.22 },
  // Large-canvas models that otherwise show only face/fringe.
  { match: "lumine/lumine/lumine.model3.json", zoom: 1.12 },
  { match: "osagegirl/osagegirl.model3.json", zoom: 1.08 },
];
const LIVE2D_MODEL_Y_OFFSET_OVERRIDES = [
  { match: "lumine/lumine/lumine.model3.json", yOffset: -184 },
  { match: "osagegirl/osagegirl.model3.json", yOffset: -176 },
];
const DICT_PATHS = [
  "https://cdn.jsdelivr.net/npm/kuromoji@0.1.2/dict/",
  "https://unpkg.com/kuromoji@0.1.2/dict/",
];
const LS_KEYS = {
  speakerId: "furigana_voice_speaker_id",
  playMode: "furigana_voice_play_mode",
  playbackRate: "furigana_voice_playback_rate",
  characterProfileJson: "furigana_character_profile_json",
  characterProfileName: "furigana_character_profile_name",
  characterProfileLibrary: "furigana_character_profile_library",
  characterProfileActiveKey: "furigana_character_profile_active_key",
  tonePreset: "furigana_voice_tone_preset",
  tonePitch: "furigana_voice_tone_pitch",
  toneIntonation: "furigana_voice_tone_intonation",
  autoActing: "furigana_avatar_auto_acting",
  live2dModelKey: "furigana_live2d_model_key",
  live2dViewTransforms: "furigana_live2d_view_transforms",
  outputFontScale: "furigana_output_font_scale",
  gridSplitPercent: "furigana_grid_split_percent",
};
const PREFETCH_CONCURRENCY = 2;
const AUDIO_CACHE_MAX_ITEMS = 100;
const AUDIO_CACHE_MAX_BYTES = 120 * 1024 * 1024;
const RUNTIME = (typeof window !== "undefined" && window.AppRuntime) ? window.AppRuntime : null;
const VOICE_CORE = (typeof window !== "undefined" && window.AppVoiceCore) ? window.AppVoiceCore : null;
const VOICE_UI = (typeof window !== "undefined" && window.AppVoiceUi) ? window.AppVoiceUi : null;
const VOICE_SERVICE = (typeof window !== "undefined" && window.AppVoiceService) ? window.AppVoiceService : null;
const LIVE2D_CORE = (typeof window !== "undefined" && window.AppLive2dCore) ? window.AppLive2dCore : null;
const LIVE2D_UI = (typeof window !== "undefined" && window.AppLive2dUi) ? window.AppLive2dUi : null;
const LIVE2D_STAGE_UI = (typeof window !== "undefined" && window.AppLive2dStageUi) ? window.AppLive2dStageUi : null;
const LIVE2D_SERVICE = (typeof window !== "undefined" && window.AppLive2dService) ? window.AppLive2dService : null;
const TTS_PROVIDER = String((RUNTIME && RUNTIME.config && RUNTIME.config.ttsProvider) || "voicevox").trim().toLowerCase();
const TTS_VOICE_MODEL = String((RUNTIME && RUNTIME.config && RUNTIME.config.ttsVoiceModel) || "").trim();
const REQUEST_TIMEOUT_MS = Math.max(3000, Number((RUNTIME && RUNTIME.config && RUNTIME.config.requestTimeoutMs) || 20000));
const OUTPUT_FONT_MIN = 0.85;
const OUTPUT_FONT_MAX = 1.45;
const OUTPUT_FONT_STEP = 0.1;
const GRID_SPLIT_MIN = 32;
const GRID_SPLIT_MAX = 68;
const DICT_BATCH_SIZE = 40;
const LIVE2D_UPLOAD_FILE_LIMIT = 35 * 1024 * 1024;
const LIVE2D_VIEW_EXTRA_ZOOM_MIN = 0.55;
const LIVE2D_VIEW_EXTRA_ZOOM_MAX = 1.85;
const QUIZ_STRICT_WRONG_THRESHOLD = 4;
const QUIZ_MAX_COUNT = 30;
const BUILTIN_CHARACTER_PROFILES = [
  {
    key: "builtin:takanashi_hoshino",
    name: "타카나시 호시노",
    path: "assets/character_profiles/takanashi_hoshino.json",
  },
];
const QUIZ_DIFFICULTY = {
  easy: {
    label: "쉬움",
    maxCount: 10,
    optionCount: 2,
    showReading: true,
    showSentenceHint: true,
    distractorMode: "far",
    wordSelectMode: "easy",
  },
  normal: {
    label: "보통",
    maxCount: 20,
    optionCount: 4,
    showReading: true,
    showSentenceHint: false,
    distractorMode: "mixed",
    wordSelectMode: "mixed",
  },
  hard: {
    label: "어려움",
    maxCount: 30,
    optionCount: 5,
    showReading: false,
    showSentenceHint: false,
    distractorMode: "near",
    wordSelectMode: "hard",
  },
};
let activeCharacterProfile = null;
let activeCharacterProfileKey = "";
const builtInCharacterProfileMap = new Map();
let userCharacterProfiles = [];


const QUIZ_LINES = {
  perCorrect: "よくできた！そのとおり！",
  perWrong: "ちがうよ、ハズレ。もう一回。",
  finalPerfect: "おめでとう！顔が赤くなっちゃう... ねえ、私と結婚してくれる？",
  finalGood: "おつかれさま！よくがんばったね！満点めざして、次も本気でいこう！",
  finalStrict: "はぁ...正直、かなり物足りない結果。今は反省して、次はちゃんと実力を見せて。",
};

const quizState = {
  active: false,
  completed: false,
  index: 0,
  correct: 0,
  wrong: 0,
  items: [],
  difficulty: "normal",
};

const AFFECTION_LINES = {
  low: [
    "ふーん、来たんだ。別に待ってたわけじゃないし。",
    "まだまだだね。もっと見せてみて。",
  ],
  mid: [
    "いい感じ。今日はちゃんと頑張ってるね。",
    "うん、その調子。少しずつ上手くなってる。",
  ],
  high: [
    "来てくれて嬉しい。もっと一緒にやろう？",
    "ふふ、今日の君、すごくいい感じ。",
  ],
  mumbleLow: [
    "んー…まだ距離あるね。もう少し見せて。",
    "今日はどこまで本気でやれるか、見てるから。",
    "今のままだと、私の気持ちは動かないかな。",
    "もう少しだけ、私に届くくらい頑張ってみて。",
    "視線は悪くないけど、まだ決め手が足りないね。",
    "その調子だと、今日は厳しめに見るかも。",
  ],
  mumbleMid: [
    "最近、君のこと考える時間が増えてるかも。",
    "次は君がどんな反応するか、ちょっと楽しみ。",
    "君のペース、少しずつわかってきた気がする。",
    "今のやり取り、けっこう好きかもしれない。",
    "今日はどんな顔を見せてくれるのかな。",
    "君の一言で、気分が変わる時があるんだよね。",
  ],
  mumbleHigh: [
    "君が来ると、空気が変わるの。すぐわかるよ。",
    "今日も君の声、もっと聞きたいな。",
    "君がそばにいると、自然に笑ってしまうの。",
    "次は何をしてくれるのか、ずっと気になってる。",
    "君のこと、前よりもっと知りたくなってる。",
    "ここで君を待つ時間すら、ちょっと好き。",
  ],
  mumbleHigh75: [
    "気づいたら、考えてることが君のことばっかり。",
    "次に君が何を言うか、ずっと待ってる私がいる。",
    "君の名前を見るだけで、少し胸が熱くなる。",
    "君の反応ひとつで、私の一日が決まっちゃう。",
    "こんなに誰かを気にするの、久しぶりかも。",
    "君に褒められたくて、ちょっと背伸びしちゃう。",
  ],
  mumbleHigh90: [
    "ねえ、今この瞬間も、君のことしか見えてない。",
    "君のために可愛くしてたいって、ずっと思ってる。",
    "君がいないと、少しだけ静かすぎて寂しい。",
    "本音を言うと、君に独り占めされたい。",
    "君のことを考えると、心拍が少し速くなるの。",
    "次も来て。約束して。ずっと待ってるから。",
  ],
  mumbleNeg10: [
    "さっきのはちょっと雑だったね。もう少し丁寧に。",
    "うーん、今は少しだけ距離を置きたい気分。",
    "私の気持ち、ちゃんと見てくれてる？",
    "そのままだと、反応は冷たくなるよ。",
    "まずは落ち着いて。ゆっくり合わせていこう。",
    "焦らなくていいから、丁寧に向き合って。",
  ],
  mumbleNeg30: [
    "正直、今はあまり余裕がないかも。",
    "その触れ方、ちょっと傷つくんだよね。",
    "私だって感情あるから、もう少し考えてほしい。",
    "今のままだと、心の距離は広がるだけだよ。",
    "今日は厳しめに言うね。ちゃんと見直して。",
    "このまま続けるなら、少し休憩したほうがいい。",
  ],
  mumbleNeg60: [
    "今は少し離れて、気持ちを整えたい。",
    "言い方きつくなる前に、いったん落ち着こう。",
    "私を大切にする気持ち、見せてくれる？",
    "この空気、好きじゃない。変えてほしい。",
    "ここから戻すのは大変だよ。でも無理じゃない。",
    "今の私には、優しさがいちばん必要かも。",
  ],
};

const TAP_PART_LINES = {
  head: {
    low: [
      "ちょ、頭は急に触らないで。",
      "いきなり頭？もう少し丁寧にして。",
    ],
    mid: [
      "頭ぽんぽんは悪くないね。",
      "うん、頭を撫でるのはけっこう好きかも。",
    ],
    high: [
      "えへへ...頭なでなで、もっとして？",
      "君に頭を撫でられると、すごく落ち着く。",
    ],
  },
  face: {
    low: [
      "顔はちょっと...距離感わかってる？",
      "ほっぺ触るなら、先にひと言ほしい。",
    ],
    mid: [
      "あ、ほっぺ？ちょっと照れるね。",
      "顔をつつくの、意外と楽しいかも。",
    ],
    high: [
      "ふふ、ほっぺ触られるの好き。",
      "そんなに見つめて触られると、ドキドキする。",
    ],
  },
  body: {
    low: [
      "そこは急すぎ。もう少し優しくして。",
      "びっくりした...その触り方はなし。",
    ],
    mid: [
      "くすぐったいよ。もう少しやさしくね。",
      "そこはちょっと敏感かも。加減して？",
    ],
    high: [
      "んっ...くすぐったい。でも嫌じゃない。",
      "君のタッチ、だんだん上手になってきたね。",
    ],
  },
  hand: {
    low: [
      "手を取るなら、ちゃんとエスコートして。",
      "その手つき...まだ練習が必要だね。",
    ],
    mid: [
      "手、あったかいね。悪くない。",
      "手に触れると、ちょっと安心する。",
    ],
    high: [
      "手、つないでくれる？このまま。",
      "君と手が触れるだけで嬉しい。",
    ],
  },
  default: {
    low: [
      "んー、もう少し気をつかって触って。",
      "急に来るとびっくりするから、ゆっくりね。",
    ],
    mid: [
      "お、今のリアクションは悪くない。",
      "うん、そのテンポならいい感じ。",
    ],
    high: [
      "ふふ、触れ方だけで君ってわかるよ。",
      "もっと構って。君といるの好き。",
    ],
  },
};

const TONE_PRESETS = {
  normal: { pitchScale: 0.0, intonationScale: 1.0, label: "기본" },
  custom: { pitchScale: 0.0, intonationScale: 1.0, label: "커스텀" },
  soft: { pitchScale: -0.03, intonationScale: 0.9, label: "부드럽게" },
  bright: { pitchScale: 0.06, intonationScale: 1.2, label: "밝게" },
  energetic: { pitchScale: 0.1, intonationScale: 1.35, label: "활기차게" },
  low: { pitchScale: -0.1, intonationScale: 0.82, label: "낮고 차분하게" },
};

const toneState = {
  preset: "normal",
  pitchScale: 0.0,
  intonationScale: 1.0,
};
const lastLineByKey = new Map();
const BASE_AFFECTION_LINES = JSON.parse(JSON.stringify(AFFECTION_LINES));
const BASE_QUIZ_LINES = JSON.parse(JSON.stringify(QUIZ_LINES));
const BASE_TAP_PART_LINES = JSON.parse(JSON.stringify(TAP_PART_LINES));

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

async function loadCharacterProfile(profilePath) {
  try {
    const target = String(profilePath || "").trim();
    if (!target) {
      return null;
    }
    const res = await fetch(target, { cache: "no-cache" });
    if (!res.ok) {
      throw new Error(`character_profile_http_${res.status}`);
    }
    const data = await res.json();
    return data && typeof data === "object" ? data : null;
  } catch (error) {
    console.warn("character profile load failed", error);
    return null;
  }
}

function parseCharacterProfileJson(rawText) {
  try {
    const parsed = JSON.parse(String(rawText || ""));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function normalizeLineArray(value) {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.map((item) => String(item || "").trim()).filter(Boolean);
}

function normalizeCharacterProfileData(profile) {
  if (!profile || typeof profile !== "object") {
    return null;
  }
  const normalized = {
    id: String(profile.id || "").trim(),
    displayName: String(profile.displayName || "").trim(),
    identityLine: String(profile.identityLine || "").trim(),
    defaultTone: {
      pitchScale: Number(profile.defaultTone && profile.defaultTone.pitchScale),
      intonationScale: Number(profile.defaultTone && profile.defaultTone.intonationScale),
    },
    quizLines: {},
    lines: {},
    tapLines: {},
  };

  Object.keys(QUIZ_LINES).forEach((key) => {
    normalized.quizLines[key] = String(profile.quizLines && profile.quizLines[key] || "").trim();
  });
  Object.keys(AFFECTION_LINES).forEach((key) => {
    normalized.lines[key] = normalizeLineArray(profile.lines && profile.lines[key]);
  });
  Object.keys(TAP_PART_LINES).forEach((part) => {
    normalized.tapLines[part] = {};
    ["low", "mid", "high"].forEach((tier) => {
      normalized.tapLines[part][tier] = normalizeLineArray(
        profile.tapLines && profile.tapLines[part] && profile.tapLines[part][tier]
      );
    });
  });
  return normalized;
}

function validateCompleteCharacterProfile(profile) {
  const normalized = normalizeCharacterProfileData(profile);
  if (!normalized) {
    return { ok: false, message: "설정집 JSON 형식이 올바르지 않습니다." };
  }
  if (!normalized.id) {
    return { ok: false, message: "설정집의 id가 비어 있습니다." };
  }
  if (!normalized.displayName) {
    return { ok: false, message: "설정집의 displayName이 비어 있습니다." };
  }
  if (!normalized.identityLine) {
    return { ok: false, message: "설정집의 identityLine이 비어 있습니다." };
  }
  if (!Number.isFinite(normalized.defaultTone.pitchScale) || !Number.isFinite(normalized.defaultTone.intonationScale)) {
    return { ok: false, message: "설정집의 defaultTone 값이 올바르지 않습니다." };
  }
  for (const key of Object.keys(QUIZ_LINES)) {
    if (!normalized.quizLines[key]) {
      return { ok: false, message: `설정집 quizLines.${key} 값이 비어 있습니다.` };
    }
  }
  for (const key of Object.keys(AFFECTION_LINES)) {
    if (!Array.isArray(normalized.lines[key]) || normalized.lines[key].length === 0) {
      return { ok: false, message: `설정집 lines.${key} 목록이 비어 있습니다.` };
    }
  }
  for (const part of Object.keys(TAP_PART_LINES)) {
    for (const tier of ["low", "mid", "high"]) {
      const arr = normalized.tapLines[part] && normalized.tapLines[part][tier];
      if (!Array.isArray(arr) || arr.length === 0) {
        return { ok: false, message: `설정집 tapLines.${part}.${tier} 목록이 비어 있습니다.` };
      }
    }
  }
  return { ok: true, normalized };
}

function updateCharacterProfileStatus(profile, sourceLabel = "") {
  if (!characterProfileStatusEl) {
    return;
  }
  const name = String((profile && profile.displayName) || "").trim();
  const suffix = sourceLabel ? ` · ${sourceLabel}` : "";
  characterProfileStatusEl.textContent = `설정집: ${name || "기본(설정 없음)"}${suffix}`;
}

function resetCharacterScriptData() {
  Object.keys(BASE_AFFECTION_LINES).forEach((key) => {
    AFFECTION_LINES[key] = [...BASE_AFFECTION_LINES[key]];
  });
  Object.keys(BASE_QUIZ_LINES).forEach((key) => {
    QUIZ_LINES[key] = String(BASE_QUIZ_LINES[key] || "");
  });
  Object.keys(BASE_TAP_PART_LINES).forEach((part) => {
    ["low", "mid", "high"].forEach((tier) => {
      TAP_PART_LINES[part][tier] = [...BASE_TAP_PART_LINES[part][tier]];
    });
  });
}

function mergeCharacterProfile(profile) {
  if (!profile || typeof profile !== "object") {
    return;
  }

  const lines = profile.lines && typeof profile.lines === "object" ? profile.lines : {};
  Object.keys(AFFECTION_LINES).forEach((key) => {
    const next = lines[key];
    if (Array.isArray(next) && next.length > 0) {
      AFFECTION_LINES[key] = next.map((item) => String(item || "").trim()).filter(Boolean);
    }
  });

  const quizLines = profile.quizLines && typeof profile.quizLines === "object" ? profile.quizLines : {};
  Object.keys(QUIZ_LINES).forEach((key) => {
    const next = String(quizLines[key] || "").trim();
    if (next) {
      QUIZ_LINES[key] = next;
    }
  });

  const tapLines = profile.tapLines && typeof profile.tapLines === "object" ? profile.tapLines : {};
  Object.keys(TAP_PART_LINES).forEach((part) => {
    const byPart = tapLines[part];
    if (!byPart || typeof byPart !== "object") {
      return;
    }
    ["low", "mid", "high"].forEach((tier) => {
      const next = byPart[tier];
      if (Array.isArray(next) && next.length > 0) {
        TAP_PART_LINES[part][tier] = next.map((item) => String(item || "").trim()).filter(Boolean);
      }
    });
  });
}

function readStoredCharacterProfileLibrary() {
  const raw = loadSetting(LS_KEYS.characterProfileLibrary);
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed
      .map((item) => {
        const key = String(item && item.key || "").trim();
        const name = String(item && item.name || "").trim();
        const validated = validateCompleteCharacterProfile(item && item.profile);
        if (!key || !name || !validated.ok || !validated.normalized) {
          return null;
        }
        return { key, name, profile: validated.normalized };
      })
      .filter(Boolean);
  } catch {
    return [];
  }
}

function storeCharacterProfileLibrary(items) {
  try {
    if (RUNTIME && typeof RUNTIME.safeSetLocalStorage === "function") {
      RUNTIME.safeSetLocalStorage(LS_KEYS.characterProfileLibrary, JSON.stringify(items || []));
      return;
    }
    localStorage.setItem(LS_KEYS.characterProfileLibrary, JSON.stringify(items || []));
  } catch (error) {
    console.warn("character profile library save failed", error);
  }
}

function migrateLegacyCharacterProfile() {
  const already = readStoredCharacterProfileLibrary();
  if (already.length > 0) {
    return already;
  }
  const raw = loadSetting(LS_KEYS.characterProfileJson);
  const parsed = parseCharacterProfileJson(raw);
  const validated = validateCompleteCharacterProfile(parsed);
  if (!validated.ok || !validated.normalized) {
    return [];
  }
  const storedName = String(loadSetting(LS_KEYS.characterProfileName) || "").trim();
  const key = `user:${validated.normalized.id}`;
  const migrated = [{
    key,
    name: storedName || validated.normalized.displayName || validated.normalized.id,
    profile: validated.normalized,
  }];
  storeCharacterProfileLibrary(migrated);
  try {
    if (RUNTIME && typeof RUNTIME.safeRemoveLocalStorage === "function") {
      RUNTIME.safeRemoveLocalStorage(LS_KEYS.characterProfileJson);
      RUNTIME.safeRemoveLocalStorage(LS_KEYS.characterProfileName);
      return migrated;
    }
    localStorage.removeItem(LS_KEYS.characterProfileJson);
    localStorage.removeItem(LS_KEYS.characterProfileName);
  } catch {
    // no-op
  }
  return migrated;
}

function makeUniqueUserProfileKey(baseId) {
  const seed = String(baseId || "profile")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "_")
    .replace(/^_+|_+$/g, "") || "profile";
  let key = `user:${seed}`;
  let idx = 2;
  const used = new Set(userCharacterProfiles.map((item) => item.key));
  while (used.has(key)) {
    key = `user:${seed}_${idx}`;
    idx += 1;
  }
  return key;
}

function findCharacterProfileByKey(key) {
  const normalizedKey = String(key || "").trim();
  if (!normalizedKey) {
    return null;
  }
  if (builtInCharacterProfileMap.has(normalizedKey)) {
    const item = builtInCharacterProfileMap.get(normalizedKey);
    return item ? { key: normalizedKey, name: item.name, profile: item.profile } : null;
  }
  const userItem = userCharacterProfiles.find((item) => item.key === normalizedKey);
  return userItem || null;
}

function updateCharacterProfileSelect() {
  if (!characterProfileSelect) {
    return;
  }
  const previous = String(activeCharacterProfileKey || "").trim();
  characterProfileSelect.innerHTML = "";

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "기본(설정 없음)";
  characterProfileSelect.appendChild(defaultOption);

  const builtInGroup = document.createElement("optgroup");
  builtInGroup.label = "기본 제공";
  BUILTIN_CHARACTER_PROFILES.forEach((item) => {
    const profile = builtInCharacterProfileMap.get(item.key);
    if (!profile) {
      return;
    }
    const option = document.createElement("option");
    option.value = item.key;
    option.textContent = profile.name || item.name;
    builtInGroup.appendChild(option);
  });
  characterProfileSelect.appendChild(builtInGroup);

  if (userCharacterProfiles.length > 0) {
    const userGroup = document.createElement("optgroup");
    userGroup.label = "사용자 추가";
    userCharacterProfiles.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.key;
      option.textContent = item.name;
      userGroup.appendChild(option);
    });
    characterProfileSelect.appendChild(userGroup);
  }

  characterProfileSelect.value = previous;
  if (characterProfileSelect.value !== previous) {
    characterProfileSelect.value = "";
  }
}

function applyCharacterProfiles({ profile = null, sourceLabel = "" } = {}) {
  resetCharacterScriptData();
  if (profile) {
    mergeCharacterProfile(profile);
  }
  activeCharacterProfile = profile || null;
  updateCharacterProfileStatus(activeCharacterProfile, sourceLabel);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isAutoplayBlockedError(error) {
  if (!error) {
    return false;
  }
  const name = String(error.name || "").toLowerCase();
  const message = String(error.message || "").toLowerCase();
  return name.includes("notallowed") || message.includes("notallowed") || message.includes("user gesture");
}

async function flushPendingAmbientRetry() {
  if (!pendingAmbientRetry) {
    return;
  }
  if (!isVoiceReady() || isPlaying || isQuizAnswerPending) {
    return;
  }
  const retry = pendingAmbientRetry;
  pendingAmbientRetry = null;
  try {
    await speakAmbientLine(retry.line, retry.opts || {});
  } catch (error) {
    if (isAutoplayBlockedError(error)) {
      pendingAmbientRetry = retry;
    }
  }
}

function katakanaToHiragana(text) {
  if (typeof window !== "undefined" && window.FuriganaCore && typeof window.FuriganaCore.katakanaToHiragana === "function") {
    return window.FuriganaCore.katakanaToHiragana(text);
  }
  return String(text || "").replace(/[\u30A1-\u30F6]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0x60)
  );
}

function hiraganaToKatakana(text) {
  if (typeof window !== "undefined" && window.FuriganaCore && typeof window.FuriganaCore.hiraganaToKatakana === "function") {
    return window.FuriganaCore.hiraganaToKatakana(text);
  }
  return String(text || "").replace(/[\u3041-\u3096]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) + 0x60)
  );
}

function isAllKatakana(text) {
  if (typeof window !== "undefined" && window.FuriganaCore && typeof window.FuriganaCore.isAllKatakana === "function") {
    return window.FuriganaCore.isAllKatakana(text);
  }
  return text.length > 0 && [...text].every((ch) => RE_KATAKANA.test(ch) || ch === "ー");
}

function hasKanji(text) {
  if (typeof window !== "undefined" && window.FuriganaCore && typeof window.FuriganaCore.hasKanji === "function") {
    return window.FuriganaCore.hasKanji(text);
  }
  return RE_KANJI.test(text);
}

function alignRuby(surface, readingKatakana) {
  if (typeof window !== "undefined" && window.FuriganaCore && typeof window.FuriganaCore.alignRuby === "function") {
    return window.FuriganaCore.alignRuby(surface, readingKatakana, escapeHtml);
  }
  const sChars = [...surface];
  const rChars = [...readingKatakana];

  let sStart = 0;
  let rStart = 0;

  while (
    sStart < sChars.length &&
    rStart < rChars.length &&
    RE_KANA.test(sChars[sStart]) &&
    hiraganaToKatakana(sChars[sStart]) === rChars[rStart]
  ) {
    sStart += 1;
    rStart += 1;
  }

  let sEnd = sChars.length - 1;
  let rEnd = rChars.length - 1;

  while (
    sEnd >= sStart &&
    rEnd >= rStart &&
    RE_KANA.test(sChars[sEnd]) &&
    hiraganaToKatakana(sChars[sEnd]) === rChars[rEnd]
  ) {
    sEnd -= 1;
    rEnd -= 1;
  }

  const prefix = sChars.slice(0, sStart).join("");
  const core = sChars.slice(sStart, sEnd + 1).join("");
  const suffix = sChars.slice(sEnd + 1).join("");
  const coreReading = rChars.slice(rStart, rEnd + 1).join("");

  if (!core || !coreReading || !hasKanji(core)) {
    return escapeHtml(surface);
  }

  return `${escapeHtml(prefix)}<ruby>${escapeHtml(core)}<rt>${escapeHtml(katakanaToHiragana(coreReading))}</rt></ruby>${escapeHtml(suffix)}`;
}

function tokenToHtml(token) {
  const surface = token.surface_form || "";
  if (!surface.trim()) {
    return escapeHtml(surface);
  }

  let innerHtml = "";
  if (!hasKanji(surface) || isAllKatakana(surface)) {
    innerHtml = escapeHtml(surface);
  } else {
    const reading = token.reading;
    if (!reading || reading === "*") {
      innerHtml = escapeHtml(surface);
    } else {
      innerHtml = alignRuby(surface, reading);
    }
  }

  const lookupWord = token.basic_form && token.basic_form !== "*" ? token.basic_form : surface;
  if (!lookupWord || !RE_JAPANESE_CHAR.test(lookupWord)) {
    return innerHtml;
  }

  const readingText = token.reading && token.reading !== "*" ? katakanaToHiragana(token.reading) : "";
  return `<span class="dict-token" data-word="${escapeHtml(lookupWord)}" data-reading="${escapeHtml(readingText)}">${innerHtml}</span>`;
}

function getLookupWordFromToken(token) {
  const surface = String(token && token.surface_form || "").trim();
  const basic = String(token && token.basic_form || "").trim();
  const value = basic && basic !== "*" ? basic : surface;
  if (!value || !RE_JAPANESE_CHAR.test(value)) {
    return "";
  }
  if (/^[。．.!?！？、「」『』（）()…\s]+$/.test(value)) {
    return "";
  }
  return value;
}

function splitSentences(tokens) {
  const result = [];
  let plain = "";
  let html = "";
  let sentenceTokens = [];

  for (const token of tokens) {
    const surface = token.surface_form || "";
    const pieceHtml = tokenToHtml(token);

    plain += surface;
    html += pieceHtml;
    sentenceTokens.push(token);

    const isBoundary = RE_SENTENCE_END.test(surface) || surface.includes("\n");
    if (isBoundary) {
      const trimmed = plain.trim();
      if (trimmed) {
        result.push({ plain: trimmed, html: html.trim(), tokens: sentenceTokens });
      }
      plain = "";
      html = "";
      sentenceTokens = [];
    }
  }

  const tail = plain.trim();
  if (tail) {
    result.push({ plain: tail, html: html.trim(), tokens: sentenceTokens });
  }

  return result;
}

function setStatus(text, isError = false) {
  statusEl.textContent = text;
  statusEl.style.color = isError ? "#ff8b7a" : "#9fb4c8";
}

function setVoiceStatus(text, isError = false) {
  voiceStatusEl.textContent = text;
  voiceStatusEl.style.color = isError ? "#ff8b7a" : "#9fb4c8";
}

function setLive2dStatus(text, isError = false) {
  if (!live2dStatusEl) {
    return;
  }
  live2dStatusEl.textContent = text;
  live2dStatusEl.style.color = isError ? "#ff8b7a" : "#9cb7cc";
}

function updateAutoActingUi() {
  if (!autoActingBtn) {
    return;
  }
  autoActingBtn.textContent = autoActingEnabled ? "자동 연기 ON" : "자동 연기 OFF";
}

function clearAutoExpressionTimers() {
  if (autoExpressionTimer) {
    clearTimeout(autoExpressionTimer);
    autoExpressionTimer = 0;
  }
  if (autoExpressionRevertTimer) {
    clearTimeout(autoExpressionRevertTimer);
    autoExpressionRevertTimer = 0;
  }
}

function randomIn(min, max) {
  return min + Math.random() * (max - min);
}

function sanitizeUploadFolderName(name) {
  const cleaned = String(name || "")
    .trim()
    .replace(/[\\/:*?"<>|]/g, "_")
    .replace(/\s+/g, "_")
    .slice(0, 80);
  return cleaned || `model_${Date.now()}`;
}

function pickUploadFolderName(files) {
  if (!Array.isArray(files) || files.length === 0) {
    return sanitizeUploadFolderName("");
  }
  for (const file of files) {
    const rel = String(file && file.webkitRelativePath || "").trim();
    if (!rel.includes("/")) {
      continue;
    }
    const root = rel.split("/")[0];
    if (root) {
      return sanitizeUploadFolderName(root);
    }
  }
  return sanitizeUploadFolderName(files[0] && files[0].name || "");
}

function getUploadRelativePath(file) {
  const rel = String(file && file.webkitRelativePath || "").trim();
  if (rel.includes("/")) {
    return rel.split("/").slice(1).join("/");
  }
  return String(file && file.name || "").trim();
}

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("file_read_failed"));
    reader.onload = () => {
      const raw = String(reader.result || "");
      const idx = raw.indexOf(",");
      resolve(idx >= 0 ? raw.slice(idx + 1) : raw);
    };
    reader.readAsDataURL(file);
  });
}

function setLive2dUploadUiBusy(busy) {
  const disabled = Boolean(busy);
  if (uploadLive2dBtn) {
    uploadLive2dBtn.disabled = disabled;
  }
  if (live2dUploadInput) {
    live2dUploadInput.disabled = disabled;
  }
  if (uploadLive2dZipBtn) {
    uploadLive2dZipBtn.disabled = disabled;
  }
  if (live2dZipUploadInput) {
    live2dZipUploadInput.disabled = disabled;
  }
}

async function uploadLive2dSingleFile({ modelFolder, relativePath, base64 }) {
  const res = await fetch("/api/live2d/upload-file", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      modelFolder,
      relativePath,
      data: base64,
    }),
  });
  if (!res.ok) {
    let detail = "";
    try {
      const err = await res.json();
      detail = String(err && (err.detail || err.error) || "");
    } catch {
      // no-op
    }
    throw new Error(detail || `upload_http_${res.status}`);
  }
}

async function handleLive2dFolderUpload(files) {
  const list = Array.isArray(files) ? files.filter(Boolean) : [];
  if (list.length === 0) {
    setLive2dStatus("업로드할 파일이 없습니다.", true);
    return;
  }
  const tooLarge = list.find((file) => Number(file.size || 0) > LIVE2D_UPLOAD_FILE_LIMIT);
  if (tooLarge) {
    setLive2dStatus(`파일이 너무 큽니다: ${tooLarge.name} (최대 ${Math.floor(LIVE2D_UPLOAD_FILE_LIMIT / (1024 * 1024))}MB)`, true);
    return;
  }

  const modelFolder = pickUploadFolderName(list);
  setLive2dUploadUiBusy(true);

  try {
    let done = 0;
    for (const file of list) {
      const relativePath = getUploadRelativePath(file);
      if (!relativePath) {
        continue;
      }
      setLive2dStatus(`모델 업로드 중... (${done}/${list.length})`);
      const base64 = await readFileAsBase64(file);
      await uploadLive2dSingleFile({ modelFolder, relativePath, base64 });
      done += 1;
    }

    await loadLive2dCatalog();
    const prefix = `assets/live2d/user_uploads/${modelFolder}/`;
    const addedModel = live2dCatalog.find((item) => String(item.key || "").startsWith(prefix));
    if (addedModel) {
      if (addedModel.compatible === false) {
        setLive2dStatus(`업로드 완료: ${addedModel.name} (moc v${addedModel.mocVersion || "?"} 현재 미지원)`, true);
        return;
      }
      try {
        await loadSelectedLive2dModel(addedModel.key);
        setLive2dStatus(`모델 업로드 완료: ${addedModel.name}`);
      } catch (error) {
        console.error(error);
        setLive2dStatus("업로드는 완료됐지만 모델 자동 적용에 실패했습니다. 모델 목록에서 선택해 주세요.", true);
      }
    } else {
      setLive2dStatus("업로드 완료. 모델 목록에서 직접 선택해 주세요.");
    }
  } catch (error) {
    console.error(error);
    const detail = error && error.message ? ` (${error.message})` : "";
    setLive2dStatus(`모델 업로드 실패${detail}`, true);
  } finally {
    setLive2dUploadUiBusy(false);
    if (live2dUploadInput) {
      live2dUploadInput.value = "";
    }
    if (live2dZipUploadInput) {
      live2dZipUploadInput.value = "";
    }
  }
}

async function handleLive2dZipUpload(zipFile) {
  const file = zipFile || null;
  if (!file) {
    setLive2dStatus("ZIP 파일을 선택해 주세요.", true);
    return;
  }
  if (Number(file.size || 0) > LIVE2D_UPLOAD_FILE_LIMIT * 8) {
    setLive2dStatus("ZIP 파일이 너무 큽니다. (최대 약 260MB)", true);
    return;
  }

  setLive2dUploadUiBusy(true);
  try {
    setLive2dStatus("ZIP 업로드 중...");
    const folderBase = String(file.name || "").replace(/\.zip$/i, "");
    const modelFolder = sanitizeUploadFolderName(folderBase);
    const base64 = await readFileAsBase64(file);
    const uploadRes = await fetch("/api/live2d/upload-zip", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        modelFolder,
        data: base64,
      }),
    });
    if (!uploadRes.ok) {
      let detail = "";
      try {
        const err = await uploadRes.json();
        detail = String(err && (err.detail || err.error) || "");
      } catch {
        // no-op
      }
      throw new Error(detail || `upload_zip_http_${uploadRes.status}`);
    }

    await loadLive2dCatalog();
    const prefix = `assets/live2d/user_uploads/${modelFolder}/`;
    const addedModel = live2dCatalog.find((item) => String(item.key || "").startsWith(prefix));
    if (addedModel) {
      if (addedModel.compatible === false) {
        setLive2dStatus(`ZIP 업로드 완료: ${addedModel.name} (moc v${addedModel.mocVersion || "?"} 현재 미지원)`, true);
        return;
      }
      try {
        await loadSelectedLive2dModel(addedModel.key);
        setLive2dStatus(`ZIP 업로드 완료: ${addedModel.name}`);
      } catch (error) {
        console.error(error);
        setLive2dStatus("ZIP 업로드는 완료됐지만 모델 자동 적용에 실패했습니다. 모델 목록에서 선택해 주세요.", true);
      }
    } else {
      setLive2dStatus("ZIP 업로드 완료. 모델 목록에서 선택해 주세요.");
    }
  } catch (error) {
    console.error(error);
    const detail = error && error.message ? ` (${error.message})` : "";
    setLive2dStatus(`ZIP 업로드 실패${detail}`, true);
  } finally {
    setLive2dUploadUiBusy(false);
    if (live2dZipUploadInput) {
      live2dZipUploadInput.value = "";
    }
  }
}

function updateAvatarAim(nowMs) {
  if (!autoActingEnabled) {
    avatarAimX = live2dMouseX;
    avatarAimY = live2dMouseY;
    return;
  }

  if (nowMs < manualLookExpireAt) {
    avatarAimX += (live2dMouseX - avatarAimX) * 0.24;
    avatarAimY += (live2dMouseY - avatarAimY) * 0.24;
    return;
  }

  if (nowMs >= autoLookNextAt) {
    autoLookTargetX = randomIn(-0.45, 0.45);
    autoLookTargetY = randomIn(-0.2, 0.25);
    autoLookNextAt = nowMs + randomIn(1200, 2800);
  }

  avatarAimX += (autoLookTargetX - avatarAimX) * 0.04;
  avatarAimY += (autoLookTargetY - avatarAimY) * 0.04;
}

async function runAutoExpressionOnce(seq) {
  if (!autoActingEnabled || activeAvatarType !== "live2d" || !live2dExpressionSelect) {
    return;
  }
  const options = live2dExpressionOptions.filter((opt) => opt && opt.value && opt.file);
  if (options.length === 0) {
    return;
  }
  const picked = options[Math.floor(Math.random() * options.length)];
  const previous = String(live2dExpressionSelect.value || "");
  try {
    await applyLive2dExpressionByValue(String(picked.value));
  } catch {
    return;
  }

  autoExpressionRevertTimer = setTimeout(async () => {
    if (!autoActingEnabled || seq !== autoExpressionSeq) {
      return;
    }
    try {
      await applyLive2dExpressionByValue(previous);
    } catch {
      // no-op
    }
  }, Math.floor(randomIn(900, 1800)));
}

function scheduleAutoExpressionLoop() {
  clearAutoExpressionTimers();
  if (!autoActingEnabled || activeAvatarType !== "live2d") {
    return;
  }
  autoExpressionTimer = setTimeout(async () => {
    autoExpressionSeq += 1;
    const seq = autoExpressionSeq;
    await runAutoExpressionOnce(seq);
    if (autoActingEnabled && seq === autoExpressionSeq) {
      scheduleAutoExpressionLoop();
    }
  }, Math.floor(randomIn(3400, 7600)));
}

function setAutoActingEnabled(enabled, shouldPersist = true) {
  autoActingEnabled = Boolean(enabled);
  updateAutoActingUi();
  if (shouldPersist) {
    saveSetting(LS_KEYS.autoActing, autoActingEnabled ? "1" : "0");
  }
  if (autoActingEnabled) {
    scheduleMumbleLoop();
  } else {
    clearAutoExpressionTimers();
    clearMumbleTimer();
  }
}

function showLive2dSpeech(text, isError = false) {
  if (!live2dSpeechBubble) {
    return;
  }
  if (live2dSpeechTimer) {
    clearTimeout(live2dSpeechTimer);
    live2dSpeechTimer = 0;
  }
  const message = String(text || "").trim();
  if (!message) {
    live2dSpeechBubble.hidden = true;
    live2dSpeechBubble.textContent = "";
    live2dSpeechBubble.classList.remove("is-error");
    return;
  }
  live2dSpeechBubble.textContent = message;
  live2dSpeechBubble.hidden = false;
  live2dSpeechBubble.classList.toggle("is-error", isError);
}

function hideLive2dSpeech(delayMs = 0) {
  if (!live2dSpeechBubble) {
    return;
  }
  if (live2dSpeechTimer) {
    clearTimeout(live2dSpeechTimer);
    live2dSpeechTimer = 0;
  }
  const delay = Math.max(0, Number(delayMs) || 0);
  if (delay === 0) {
    showLive2dSpeech("");
    return;
  }
  live2dSpeechTimer = setTimeout(() => {
    live2dSpeechTimer = 0;
    showLive2dSpeech("");
  }, delay);
}

function clampAffection(value) {
  return Math.max(-100, Math.min(100, Number(value) || 0));
}

function affectionTier() {
  if (affectionScore >= 55) {
    return "high";
  }
  if (affectionScore <= -10) {
    return "low";
  }
  return "mid";
}

function updateAffectionUi() {
  if (!affectionStatusEl) {
    return;
  }
  const tier = affectionTier();
  const label = tier === "high" ? "반응 친밀" : tier === "low" ? "반응 차가움" : "반응 보통";
  affectionStatusEl.textContent = `호감도 ${affectionScore} · ${label}`;
}

function sampleLine(key) {
  const list = AFFECTION_LINES[key] || [];
  if (list.length === 0) {
    return "";
  }
  if (list.length === 1) {
    lastLineByKey.set(key, 0);
    return list[0];
  }
  const prev = Number(lastLineByKey.get(key));
  let idx = Math.floor(Math.random() * list.length);
  if (Number.isFinite(prev) && idx === prev) {
    idx = (idx + 1 + Math.floor(Math.random() * (list.length - 1))) % list.length;
  }
  lastLineByKey.set(key, idx);
  return list[idx];
}

function sampleMumbleLineByAffection() {
  if (affectionScore <= -60) {
    return sampleLine("mumbleNeg60") || sampleLine("mumbleNeg30") || sampleLine("mumbleNeg10");
  }
  if (affectionScore <= -30) {
    return sampleLine("mumbleNeg30") || sampleLine("mumbleNeg10");
  }
  if (affectionScore < 0) {
    return sampleLine("mumbleNeg10");
  }
  if (affectionScore >= 90) {
    return sampleLine("mumbleHigh90") || sampleLine("mumbleHigh");
  }
  if (affectionScore >= 75) {
    return sampleLine("mumbleHigh75") || sampleLine("mumbleHigh");
  }
  if (affectionScore >= 55) {
    return sampleLine("mumbleHigh");
  }
  if (affectionScore <= -10) {
    return sampleLine("mumbleLow");
  }
  return sampleLine("mumbleMid");
}

function moodByAffection() {
  if (affectionScore >= 55) {
    return "happy";
  }
  if (affectionScore <= -35) {
    return "angry";
  }
  if (affectionScore < 0) {
    return "question";
  }
  return "neutral";
}

async function speakAmbientLine(line, opts = {}) {
  const text = String(line || "").trim();
  if (!text) {
    return;
  }
  const mood = String(opts.mood || moodByAffection());
  const restore = await applyContextActingForText(text);
  showLive2dSpeech(text, Boolean(opts.isError));
  if (mood === "happy") {
    triggerLive2dReaction("nod", 900);
  } else if (mood === "question" || mood === "frightened" || mood === "angry") {
    triggerLive2dReaction("shake", 760);
  }
  let playedByVoice = false;
  try {
    if (isVoiceReady() && !isPlaying && !isQuizAnswerPending) {
      const tokenId = ++playToken;
      setPlayingState("ambient");
      try {
        const blob = await getCachedAudioBlob(text, speakerSelect.value);
        await playBlob(blob, tokenId);
        playedByVoice = true;
      } finally {
        if (tokenId === playToken) {
          clearPlayingState();
        }
      }
    } else {
      await sleep(900);
    }
  } catch (error) {
    console.error(error);
    if (isAutoplayBlockedError(error)) {
      pendingAmbientRetry = { line: text, opts };
    }
  } finally {
    hideLive2dSpeech(playedByVoice ? 1200 : 2200);
    await restore();
  }
}

function clearMumbleTimer() {
  if (mumbleTimer) {
    clearTimeout(mumbleTimer);
    mumbleTimer = 0;
  }
}

function scheduleMumbleLoop() {
  clearMumbleTimer();
  if (!autoActingEnabled) {
    return;
  }
  const wait = Math.floor(randomIn(5000, 10000));
  const seq = ++mumbleSeq;
  mumbleTimer = setTimeout(async () => {
    mumbleTimer = 0;
    if (!autoActingEnabled || seq !== mumbleSeq || isPlaying || isQuizAnswerPending || cheekDragActive) {
      scheduleMumbleLoop();
      return;
    }
    const line = sampleMumbleLineByAffection();
    if (line) {
      await speakAmbientLine(line, { mood: moodByAffection() });
    }
    scheduleMumbleLoop();
  }, wait);
}

function applyCheekStretch(dx, dy) {
  cheekPullX = Math.max(-56, Math.min(56, Number(dx) || 0));
  cheekPullY = Math.max(-28, Math.min(28, Number(dy) || 0));
}

function clearCheekWarpEffect() {
  if (!live2dModel || !Array.isArray(live2dModel.filters)) {
    return;
  }
  live2dModel.filters = live2dModel.filters.filter((f) => !f || !f.__cheekWarpTag);
}

function resetCheekStretch() {
  cheekPullX = 0;
  cheekPullY = 0;
  clearCheekWarpEffect();
  setLive2dParam("ParamCheek", 0, 0.7);
  setLive2dParam("ParamCheek2", 0, 0.7);
  setLive2dParam("ParamCheek3", 0, 0.7);
  setLive2dParam("ParamCheekL", 0, 0.7);
  setLive2dParam("ParamCheekR", 0, 0.7);
  setLive2dParam("ParamPuff", 0, 0.7);
  setLive2dParam("ParamFaceX", 0, 0.35);
  setLive2dParam("ParamFaceY", 0, 0.35);
  setLive2dParam("ParamAngleZ", 0, 0.2);
  if (live2dStageShell) {
    live2dStageShell.style.transform = "";
  }
  if (!live2dStageShell) {
    return;
  }
  live2dStageShell.classList.remove("is-cheek-dragging");
}

function applyLive2dCheekFrame() {
  if (!live2dCore) {
    return;
  }
  const pullX = Number(cheekPullX) || 0;
  const pullY = Number(cheekPullY) || 0;
  const strength = Math.max(0, Math.min(1, Math.abs(pullX) / 56));
  const dir = pullX >= 0 ? 1 : -1;
  const vertical = Math.max(-1, Math.min(1, pullY / 28));

  if (strength <= 0.001) {
    setLive2dParam("ParamCheek", 0, 0.65);
    setLive2dParam("ParamCheekL", 0, 0.65);
    setLive2dParam("ParamCheekR", 0, 0.65);
    setLive2dParam("ParamPuff", 0, 0.65);
    setLive2dParam("ParamFaceX", 0, 0.3);
    setLive2dParam("ParamFaceY", 0, 0.3);
    return;
  }

  const cheek = strength * 0.95;
  setLive2dParam("ParamCheek", cheek, 0.82);
  setLive2dParam("ParamCheek2", cheek, 0.82);
  setLive2dParam("ParamCheek3", cheek, 0.82);
  setLive2dParam("ParamPuff", cheek * 0.85, 0.56);

  const rightBias = dir > 0 ? cheek : 0;
  const leftBias = dir < 0 ? cheek : 0;
  setLive2dParam("ParamCheekR", rightBias, 0.76);
  setLive2dParam("ParamCheekL", leftBias, 0.76);

  setLive2dParam("ParamFaceX", dir * cheek * 0.26, 0.34);
  setLive2dParam("ParamFaceY", vertical * cheek * 0.14, 0.28);
}

function clickMoodAndLine() {
  const tier = affectionTier();
  if (tier === "high") {
    return { line: sampleLine("high"), mood: "happy" };
  }
  if (tier === "low") {
    return { line: sampleLine("low"), mood: "question" };
  }
  return { line: sampleLine("mid"), mood: "neutral" };
}

function resolveTapTierKey() {
  const tier = affectionTier();
  if (tier === "high") {
    return "high";
  }
  if (tier === "low") {
    return "low";
  }
  return "mid";
}

function sampleTapPartLine(part) {
  const key = String(part || "default");
  const byPart = TAP_PART_LINES[key] || TAP_PART_LINES.default;
  const tierKey = resolveTapTierKey();
  const list = (byPart && byPart[tierKey]) || [];
  if (list.length > 0) {
    return list[Math.floor(Math.random() * list.length)];
  }
  return clickMoodAndLine().line;
}

function mapHitAreaToPart(name) {
  const lower = String(name || "").toLowerCase();
  if (!lower) {
    return "";
  }
  if (/(head|face|hithead|forehead|hair|bang|fronthair)/.test(lower)) {
    return "head";
  }
  if (/(cheek|eye|nose|mouth|lip|ear|face)/.test(lower)) {
    return "face";
  }
  if (/(body|bust|breast|torso|chest|hip|waist|belly)/.test(lower)) {
    return "body";
  }
  if (/(arm|hand|wrist|finger|shoulder)/.test(lower)) {
    return "hand";
  }
  return "";
}

function normalizeHitResultToName(result) {
  if (!result) {
    return "";
  }
  if (typeof result === "string") {
    return result;
  }
  if (Array.isArray(result)) {
    for (const item of result) {
      if (typeof item === "string" && item) {
        return item;
      }
      if (item && typeof item === "object") {
        const candidate = item.name || item.id || item.hitAreaName || item.hitAreaId;
        if (candidate) {
          return String(candidate);
        }
      }
    }
    return "";
  }
  if (typeof result === "object") {
    const candidate = result.name || result.id || result.hitAreaName || result.hitAreaId;
    if (candidate) {
      return String(candidate);
    }
  }
  return "";
}

function detectAvatarPartByPointer(event) {
  if (!event || !live2dStage) {
    return "default";
  }
  const rect = live2dStage.getBoundingClientRect();
  if (!rect.width || !rect.height) {
    return "default";
  }
  const stageX = event.clientX - rect.left;
  const stageY = event.clientY - rect.top;

  // Prefer model hit areas when available.
  if (activeAvatarType === "live2d" && live2dModel) {
    let detectedName = "";
    const settings = live2dModel.internalModel && live2dModel.internalModel.settings;
    const hitAreas = settings && Array.isArray(settings.hitAreas) ? settings.hitAreas : [];
    const areaNames = hitAreas
      .map((area) => String((area && (area.name || area.id)) || "").trim())
      .filter(Boolean);

    const modelHit = live2dModel && typeof live2dModel.hitTest === "function" ? live2dModel.hitTest.bind(live2dModel) : null;
    const internalHit = live2dModel.internalModel && typeof live2dModel.internalModel.hitTest === "function"
      ? live2dModel.internalModel.hitTest.bind(live2dModel.internalModel)
      : null;

    try {
      if (modelHit) {
        const r = modelHit(stageX, stageY);
        detectedName = normalizeHitResultToName(r);
      }
    } catch {
      // no-op
    }
    if (!detectedName) {
      for (const name of areaNames) {
        try {
          if (modelHit && modelHit(name, stageX, stageY) === true) {
            detectedName = name;
            break;
          }
        } catch {
          // no-op
        }
      }
    }
    if (!detectedName) {
      try {
        if (internalHit) {
          const r = internalHit(stageX, stageY);
          detectedName = normalizeHitResultToName(r);
        }
      } catch {
        // no-op
      }
    }
    if (!detectedName) {
      for (const name of areaNames) {
        try {
          if (internalHit && internalHit(name, stageX, stageY) === true) {
            detectedName = name;
            break;
          }
        } catch {
          // no-op
        }
      }
    }

    const byHit = mapHitAreaToPart(detectedName);
    if (byHit) {
      return byHit;
    }
  }

  // Fallback by click position on stage.
  const rx = stageX / rect.width;
  const ry = stageY / rect.height;
  if (ry < 0.28) {
    return "head";
  }
  if (ry < 0.48) {
    return "face";
  }
  if (ry < 0.82) {
    return rx < 0.25 || rx > 0.75 ? "hand" : "body";
  }
  return "default";
}

async function onAvatarTap(part = "default") {
  const resolvedPart = String(part || "default");
  const gain = resolvedPart === "head" ? 4 : resolvedPart === "face" ? 3 : resolvedPart === "hand" ? 2 : 2;
  affectionScore = clampAffection(affectionScore + gain);
  updateAffectionUi();
  const mood = resolvedPart === "head" || resolvedPart === "face" ? "happy" : moodByAffection();
  const line = sampleTapPartLine(resolvedPart);
  if (line) {
    await speakAmbientLine(line, { mood });
  }
}

function setPrepareProgress(pct, label) {
  const value = Math.max(0, Math.min(100, Number(pct) || 0));
  prepBar.style.width = `${value}%`;
  prepLabel.textContent = label;
  prepProgress.classList.toggle("active", value > 0 && value < 100);
}

function cacheKey(text, speakerId) {
  return `${speakerId}::${toneCacheSignature()}::${text}`;
}

function makeSpeakerRef(engineBase, styleId) {
  if (VOICE_CORE && typeof VOICE_CORE.makeSpeakerRef === "function") {
    return VOICE_CORE.makeSpeakerRef(engineBase, styleId);
  }
  return `${engineBase}@@${styleId}`;
}

function parseSpeakerRef(speakerRef) {
  if (VOICE_CORE && typeof VOICE_CORE.parseSpeakerRef === "function") {
    return VOICE_CORE.parseSpeakerRef(speakerRef);
  }
  const raw = String(speakerRef || "");
  const splitAt = raw.lastIndexOf("@@");
  if (splitAt < 0) {
    return { engineBase: "", speakerId: Number(raw) };
  }
  const engineBase = raw.slice(0, splitAt);
  const speakerId = Number(raw.slice(splitAt + 2));
  return { engineBase, speakerId };
}

function setSpeakerPreview({ name, description, imageUrl }) {
  speakerName.textContent = name || "캐릭터 선택 대기 중";
  speakerDesc.textContent = description || "캐릭터를 고르면 얼굴과 간단한 설명이 표시됩니다.";

  if (imageUrl) {
    speakerFace.src = imageUrl;
    speakerFace.style.display = "block";
  } else {
    speakerFace.removeAttribute("src");
    speakerFace.style.display = "none";
  }
}

speakerFace.addEventListener("error", () => {
  speakerFace.style.display = "none";
});

function summarizePolicy(policy) {
  const text = String(policy || "")
    .replace(/[#*_`>\-\r]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) {
    return "캐릭터 설명 정보가 없습니다.";
  }
  return text.length > 110 ? `${text.slice(0, 110)}...` : text;
}

async function fetchSpeakerInfo(speakerUuid, engineBase = "") {
  const uuid = String(speakerUuid || "").trim();
  const base = String(engineBase || "").trim();
  if (!uuid || !base) {
    return null;
  }
  const key = `${base}::${uuid}`;

  const cached = speakerInfoCache.get(key);
  if (cached) {
    return cached;
  }

  const query =
    `/api/voicevox/speaker-info?speaker_uuid=${encodeURIComponent(uuid)}&engine=${encodeURIComponent(base)}`;
  const res = await fetch(query);
  if (!res.ok) {
    throw new Error(`speaker_info_http_${res.status}`);
  }
  const data = await res.json();
  const info = data && data.ok ? data.info : null;
  speakerInfoCache.set(key, info);
  return info;
}

async function updateSpeakerPreview() {
  const meta = speakerStyleMeta.get(String(speakerSelect.value || ""));
  if (!meta) {
    setSpeakerPreview({});
    return;
  }

  setSpeakerPreview({
    name: `${meta.speakerName} - ${meta.styleName}`,
    description: "캐릭터 얼굴/설명 불러오는 중...",
    imageUrl: "",
  });

  const currentValue = String(speakerSelect.value || "");
  try {
    const info = await fetchSpeakerInfo(meta.speakerUuid, meta.engineBase);
    if (String(speakerSelect.value || "") !== currentValue) {
      return;
    }

    const styleIcon =
      info && info.styleIcons && typeof info.styleIcons === "object"
        ? info.styleIcons[String(meta.styleId)] || ""
        : "";
    const portrait = info && info.portrait ? String(info.portrait) : "";
    setSpeakerPreview({
      name: `${meta.speakerName} - ${meta.styleName}`,
      description: summarizePolicy(info ? info.policy : ""),
      imageUrl: styleIcon || portrait,
    });
  } catch {
    if (String(speakerSelect.value || "") !== currentValue) {
      return;
    }
    setSpeakerPreview({
      name: `${meta.speakerName} - ${meta.styleName}`,
      description: "캐릭터 설명을 불러오지 못했습니다.",
      imageUrl: "",
    });
  }
}

function clearAudioCache() {
  audioCache.clear();
  audioCacheTotalBytes = 0;
  prefetchToken += 1;
  preparedCount = 0;
  preparedTotal = 0;
  isAudioPreparing = false;
  isAudioPrepared = false;
  setPrepareProgress(0, "음성 준비 대기");
}

function touchAudioCacheEntry(key, value) {
  audioCache.delete(key);
  audioCache.set(key, value);
}

function enforceAudioCacheLimits() {
  while (audioCache.size > AUDIO_CACHE_MAX_ITEMS || audioCacheTotalBytes > AUDIO_CACHE_MAX_BYTES) {
    const first = audioCache.entries().next();
    if (first.done) {
      break;
    }
    const [oldKey, oldValue] = first.value;
    audioCache.delete(oldKey);
    if (oldValue && oldValue.blob) {
      audioCacheTotalBytes = Math.max(0, audioCacheTotalBytes - Number(oldValue.size || 0));
    }
  }
}

function saveSetting(key, value) {
  if (RUNTIME && typeof RUNTIME.safeSetLocalStorage === "function") {
    RUNTIME.safeSetLocalStorage(key, String(value));
    return;
  }
  try {
    localStorage.setItem(key, String(value));
  } catch {
    // no-op
  }
}

function loadSetting(key) {
  if (RUNTIME && typeof RUNTIME.safeGetLocalStorage === "function") {
    return RUNTIME.safeGetLocalStorage(key);
  }
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function clampLive2dExtraZoom(value) {
  if (LIVE2D_CORE && typeof LIVE2D_CORE.clampZoom === "function") {
    return LIVE2D_CORE.clampZoom(value, LIVE2D_VIEW_EXTRA_ZOOM_MIN, LIVE2D_VIEW_EXTRA_ZOOM_MAX);
  }
  const n = Number(value);
  if (!Number.isFinite(n)) {
    return 1;
  }
  return Math.min(LIVE2D_VIEW_EXTRA_ZOOM_MAX, Math.max(LIVE2D_VIEW_EXTRA_ZOOM_MIN, n));
}

function ensureLive2dViewTransformsLoaded() {
  if (live2dViewTransformsLoaded) {
    return;
  }
  live2dViewTransformsLoaded = true;
  const raw = loadSetting(LS_KEYS.live2dViewTransforms);
  if (!raw) {
    return;
  }
  if (LIVE2D_SERVICE && typeof LIVE2D_SERVICE.parseStoredViewTransforms === "function") {
    const parsedMap = LIVE2D_SERVICE.parseStoredViewTransforms(
      raw,
      LIVE2D_CORE && LIVE2D_CORE.normalizeViewTransform,
      LIVE2D_VIEW_EXTRA_ZOOM_MIN,
      LIVE2D_VIEW_EXTRA_ZOOM_MAX
    );
    parsedMap.forEach((value, key) => {
      live2dViewTransforms.set(key, value);
    });
    return;
  }
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return;
    }
    Object.entries(parsed).forEach(([key, item]) => {
      const modelKey = String(key || "").trim();
      if (!modelKey || !item || typeof item !== "object") {
        return;
      }
      const x = Number(item.x || 0);
      const y = Number(item.y || 0);
      const zoom = clampLive2dExtraZoom(item.zoom);
      live2dViewTransforms.set(modelKey, { x: Number.isFinite(x) ? x : 0, y: Number.isFinite(y) ? y : 0, zoom });
    });
  } catch {
    // ignore malformed storage
  }
}

function saveLive2dViewTransforms() {
  const payload = (LIVE2D_SERVICE && typeof LIVE2D_SERVICE.serializeViewTransforms === "function")
    ? LIVE2D_SERVICE.serializeViewTransforms(
      live2dViewTransforms,
      LIVE2D_CORE && LIVE2D_CORE.normalizeViewTransform,
      LIVE2D_VIEW_EXTRA_ZOOM_MIN,
      LIVE2D_VIEW_EXTRA_ZOOM_MAX
    )
    : (() => {
      const data = {};
      live2dViewTransforms.forEach((value, key) => {
        data[key] = {
          x: Number(value && value.x || 0),
          y: Number(value && value.y || 0),
          zoom: clampLive2dExtraZoom(value && value.zoom),
        };
      });
      return data;
    })();
  try {
    if (RUNTIME && typeof RUNTIME.safeSetLocalStorage === "function") {
      RUNTIME.safeSetLocalStorage(LS_KEYS.live2dViewTransforms, JSON.stringify(payload));
      return;
    }
    localStorage.setItem(LS_KEYS.live2dViewTransforms, JSON.stringify(payload));
  } catch {
    // no-op
  }
}

function getLive2dViewTransformByKey(modelKey) {
  ensureLive2dViewTransformsLoaded();
  const key = String(modelKey || "").trim();
  if (!key) {
    return { x: 0, y: 0, zoom: 1 };
  }
  const current = live2dViewTransforms.get(key);
  if (current) {
    if (LIVE2D_CORE && typeof LIVE2D_CORE.normalizeViewTransform === "function") {
      return LIVE2D_CORE.normalizeViewTransform(current, LIVE2D_VIEW_EXTRA_ZOOM_MIN, LIVE2D_VIEW_EXTRA_ZOOM_MAX);
    }
    return {
      x: Number(current.x || 0),
      y: Number(current.y || 0),
      zoom: clampLive2dExtraZoom(current.zoom),
    };
  }
  const created = { x: 0, y: 0, zoom: 1 };
  live2dViewTransforms.set(key, created);
  return created;
}

function setLive2dViewTransformByKey(modelKey, next) {
  const key = String(modelKey || "").trim();
  if (!key || !next || typeof next !== "object") {
    return;
  }
  ensureLive2dViewTransformsLoaded();
  if (LIVE2D_CORE && typeof LIVE2D_CORE.normalizeViewTransform === "function") {
    live2dViewTransforms.set(
      key,
      LIVE2D_CORE.normalizeViewTransform(next, LIVE2D_VIEW_EXTRA_ZOOM_MIN, LIVE2D_VIEW_EXTRA_ZOOM_MAX)
    );
    saveLive2dViewTransforms();
    return;
  }
  live2dViewTransforms.set(key, {
    x: Number(next.x || 0),
    y: Number(next.y || 0),
    zoom: clampLive2dExtraZoom(next.zoom),
  });
  saveLive2dViewTransforms();
}

function normalizeTonePreset(value) {
  const key = String(value || "").trim();
  return Object.prototype.hasOwnProperty.call(TONE_PRESETS, key) ? key : "normal";
}

function clampTonePitch(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) {
    return 0;
  }
  return Math.min(0.15, Math.max(-0.15, n));
}

function clampToneIntonation(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) {
    return 1.0;
  }
  return Math.min(1.6, Math.max(0.6, n));
}

function getToneConfig() {
  return {
    speedScale: 1.0,
    pitchScale: Number(toneState.pitchScale.toFixed(2)),
    intonationScale: Number(toneState.intonationScale.toFixed(2)),
    volumeScale: 1.0,
  };
}

function toneCacheSignature() {
  const tone = getToneConfig();
  return `${tone.pitchScale.toFixed(2)}:${tone.intonationScale.toFixed(2)}`;
}

function updateToneUi() {
  if (tonePresetSelect) {
    tonePresetSelect.value = toneState.preset;
  }
  if (tonePitchRange) {
    tonePitchRange.value = String(toneState.pitchScale);
  }
  if (tonePitchValue) {
    tonePitchValue.textContent = toneState.pitchScale.toFixed(2);
  }
  if (toneIntonationRange) {
    toneIntonationRange.value = String(toneState.intonationScale);
  }
  if (toneIntonationValue) {
    toneIntonationValue.textContent = toneState.intonationScale.toFixed(2);
  }
}

function applyTonePreset(preset, shouldPersist = true) {
  const key = normalizeTonePreset(preset);
  const values = TONE_PRESETS[key];
  toneState.preset = key;
  toneState.pitchScale = clampTonePitch(values.pitchScale);
  toneState.intonationScale = clampToneIntonation(values.intonationScale);
  updateToneUi();
  if (shouldPersist) {
    saveSetting(LS_KEYS.tonePreset, toneState.preset);
    saveSetting(LS_KEYS.tonePitch, toneState.pitchScale);
    saveSetting(LS_KEYS.toneIntonation, toneState.intonationScale);
  }
}

function setTonePitch(value, shouldPersist = true) {
  toneState.pitchScale = clampTonePitch(value);
  toneState.preset = "custom";
  updateToneUi();
  if (shouldPersist) {
    saveSetting(LS_KEYS.tonePreset, toneState.preset);
    saveSetting(LS_KEYS.tonePitch, toneState.pitchScale);
    saveSetting(LS_KEYS.toneIntonation, toneState.intonationScale);
  }
}

function setToneIntonation(value, shouldPersist = true) {
  toneState.intonationScale = clampToneIntonation(value);
  toneState.preset = "custom";
  updateToneUi();
  if (shouldPersist) {
    saveSetting(LS_KEYS.tonePreset, toneState.preset);
    saveSetting(LS_KEYS.tonePitch, toneState.pitchScale);
    saveSetting(LS_KEYS.toneIntonation, toneState.intonationScale);
  }
}

function updateOutputFontUi() {
  const pct = Math.round(outputFontScale * 100);
  fontSizeValue.textContent = `${pct}%`;
  fontDecreaseBtn.disabled = outputFontScale <= OUTPUT_FONT_MIN;
  fontIncreaseBtn.disabled = outputFontScale >= OUTPUT_FONT_MAX;
}

function applyOutputFontScale() {
  output.style.setProperty("--output-font-scale", String(outputFontScale));
  updateOutputFontUi();
}

function setOutputFontScale(nextScale, shouldPersist = true) {
  const clamped = Math.max(OUTPUT_FONT_MIN, Math.min(OUTPUT_FONT_MAX, Number(nextScale) || 1));
  outputFontScale = Number(clamped.toFixed(2));
  applyOutputFontScale();
  if (shouldPersist) {
    saveSetting(LS_KEYS.outputFontScale, outputFontScale);
  }
}

function applyGridSplit() {
  if (!appGrid) {
    return;
  }
  appGrid.style.gridTemplateColumns = `${gridSplitPercent}% 4px calc(${100 - gridSplitPercent}% - 4px)`;
}

function setGridSplit(nextSplit, shouldPersist = true) {
  const clamped = Math.max(GRID_SPLIT_MIN, Math.min(GRID_SPLIT_MAX, Number(nextSplit) || 44));
  gridSplitPercent = Number(clamped.toFixed(1));
  applyGridSplit();
  if (shouldPersist) {
    saveSetting(LS_KEYS.gridSplitPercent, gridSplitPercent);
  }
}

function setPlayingState(mode, sentenceIndex = -1) {
  isPlaying = Boolean(mode);
  playingMode = mode;
  activeSentenceIndex = sentenceIndex;
  refreshPlaybackUi();
}

function clearPlayingState() {
  isPlaying = false;
  playingMode = "";
  activeSentenceIndex = -1;
  refreshPlaybackUi();
}

function refreshPlaybackUi() {
  playAllBtn.textContent = isPlaying && playingMode === "all" ? "정지" : "전체 재생";
  const canPlay = isVoiceReady() && sentences.length > 0;
  playAllBtn.disabled = !canPlay;

  const sentenceRows = output.querySelectorAll(".sentence-row");
  sentenceRows.forEach((row) => {
    const rowIndex = Number(row.dataset.sentenceIndex);
    const shouldHighlight =
      isPlaying &&
      ((playingMode === "sentence" && rowIndex === activeSentenceIndex) ||
        (playingMode === "all" && rowIndex === activeSentenceIndex));
    row.classList.toggle("is-playing", shouldHighlight);
  });

  const sentencePlayButtons = output.querySelectorAll(".sentence-play");
  sentencePlayButtons.forEach((btn) => {
    const index = Number(btn.dataset.sentenceIndex);
    const isActiveSentence = isPlaying && playingMode === "sentence" && index === activeSentenceIndex;
    btn.textContent = isActiveSentence ? "■" : "▶";
    btn.disabled = !canPlay;
  });
}

function shuffleArray(values) {
  const next = [...values];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

function normalizeForCompare(text) {
  return String(text || "").replace(/\s+/g, " ").trim();
}

function meaningTokens(text) {
  return normalizeForCompare(text)
    .split(/[,\s/|(){}\[\]'"`~!@#$%^&*+=<>?:;.-]+/)
    .map((token) => token.trim())
    .filter(Boolean);
}

function buildBigrams(text) {
  const chars = [...normalizeForCompare(text).replace(/\s+/g, "")];
  if (chars.length < 2) {
    return new Set(chars);
  }
  const grams = new Set();
  for (let i = 0; i < chars.length - 1; i += 1) {
    grams.add(`${chars[i]}${chars[i + 1]}`);
  }
  return grams;
}

function scoreMeaningSimilarity(a, b) {
  const aNorm = normalizeForCompare(a);
  const bNorm = normalizeForCompare(b);
  if (!aNorm || !bNorm) {
    return 0;
  }

  const aTokens = new Set(meaningTokens(aNorm));
  const bTokens = new Set(meaningTokens(bNorm));
  let overlap = 0;
  aTokens.forEach((token) => {
    if (bTokens.has(token)) {
      overlap += 1;
    }
  });
  const tokenJaccard = (aTokens.size + bTokens.size) > 0
    ? overlap / (aTokens.size + bTokens.size - overlap)
    : 0;

  const aBigrams = buildBigrams(aNorm);
  const bBigrams = buildBigrams(bNorm);
  let gramOverlap = 0;
  aBigrams.forEach((gram) => {
    if (bBigrams.has(gram)) {
      gramOverlap += 1;
    }
  });
  const gramJaccard = (aBigrams.size + bBigrams.size) > 0
    ? gramOverlap / (aBigrams.size + bBigrams.size - gramOverlap)
    : 0;

  const lenA = aNorm.length;
  const lenB = bNorm.length;
  const lenScore = 1 - (Math.abs(lenA - lenB) / Math.max(lenA, lenB, 1));

  return tokenJaccard * 0.55 + gramJaccard * 0.35 + lenScore * 0.1;
}

function scoreWordDifficulty(word, meaningResult) {
  const text = String(word || "");
  const chars = [...text];
  const length = Math.max(1, chars.length);
  const kanjiCount = chars.filter((ch) => RE_KANJI.test(ch)).length;
  const kanjiRatio = kanjiCount / length;

  let jlptScore = 2.8;
  const jlptList = meaningResult && Array.isArray(meaningResult.jlpt) ? meaningResult.jlpt : [];
  const numeric = jlptList
    .map((level) => {
      const match = String(level || "").toUpperCase().match(/N([1-5])/);
      return match ? Number(match[1]) : NaN;
    })
    .filter((value) => Number.isFinite(value));
  if (numeric.length > 0) {
    const best = Math.min(...numeric);
    jlptScore = 6 - best;
  }

  const lengthScore = Math.min(2, length / 3.5);
  const kanjiScore = kanjiRatio * 3;
  return jlptScore * 1.15 + kanjiScore + lengthScore;
}

function sortRowsByDifficulty(rows, mode = "mixed") {
  if (mode === "mixed") {
    return shuffleArray(rows);
  }

  const sorted = [...rows].sort((a, b) => {
    const diff = (b.wordDifficulty || 0) - (a.wordDifficulty || 0);
    if (Math.abs(diff) > 1e-6) {
      return diff;
    }
    return Math.random() - 0.5;
  });

  if (mode === "hard") {
    return sorted;
  }
  if (mode === "easy") {
    return [...sorted].reverse();
  }
  return shuffleArray(rows);
}

function firstMeaningText(result) {
  if (!result || !Array.isArray(result.meanings) || result.meanings.length === 0) {
    return "";
  }
  return String(result.meanings[0] || "").trim();
}

function buildQuizOptions(answer, pool, optionCount, distractorMode = "mixed") {
  const normalizedAnswer = normalizeForCompare(answer);
  if (!normalizedAnswer) {
    return [];
  }

  const unique = new Map();
  pool.forEach((value) => {
    const raw = String(value || "").trim();
    const key = normalizeForCompare(raw);
    if (!key || key === normalizedAnswer || unique.has(key)) {
      return;
    }
    unique.set(key, raw);
  });

  const ranked = [...unique.values()]
    .map((value) => ({ value, score: scoreMeaningSimilarity(answer, value) }));
  if (distractorMode === "near") {
    ranked.sort((a, b) => b.score - a.score);
  } else if (distractorMode === "far") {
    ranked.sort((a, b) => a.score - b.score);
  } else {
    ranked.sort((a, b) => b.score - a.score);
    const half = Math.floor(ranked.length / 2);
    const head = ranked.slice(0, half);
    const tail = ranked.slice(half);
    const mixed = [...shuffleArray(head), ...shuffleArray(tail)];
    ranked.splice(0, ranked.length, ...mixed);
  }

  const distractors = ranked.slice(0, Math.max(1, optionCount - 1)).map((entry) => entry.value);
  const merged = shuffleArray([answer, ...distractors]);
  const mergedUnique = [];
  const seen = new Set();
  merged.forEach((value) => {
    const key = normalizeForCompare(value);
    if (!key || seen.has(key)) {
      return;
    }
    seen.add(key);
    mergedUnique.push(String(value));
  });

  if (!mergedUnique.some((value) => normalizeForCompare(value) === normalizedAnswer)) {
    mergedUnique.unshift(answer);
  }
  return mergedUnique;
}

async function buildQuizItemsFromSentences(difficultyKey = "normal") {
  const profile = QUIZ_DIFFICULTY[difficultyKey] || QUIZ_DIFFICULTY.normal;
  const tokenRows = [];
  const wordSet = new Set();

  sentences.forEach((sentence, sentenceIndex) => {
    const tokens = Array.isArray(sentence.tokens) ? sentence.tokens : [];
    tokens.forEach((token) => {
      const word = getLookupWordFromToken(token);
      if (!word) {
        return;
      }
      const readingRaw = String(token && token.reading || "").trim();
      const reading = readingRaw && readingRaw !== "*" ? katakanaToHiragana(readingRaw) : "";
      tokenRows.push({
        word,
        reading,
        sentencePlain: String(sentence.plain || ""),
        sentenceIndex,
      });
      wordSet.add(word);
    });
  });

  const uniqueWords = [...wordSet];
  if (uniqueWords.length === 0) {
    return [];
  }

  const missingWords = uniqueWords.filter((word) => !meaningCache.has(word));
  if (missingWords.length > 0) {
    const chunks = [];
    for (let i = 0; i < missingWords.length; i += DICT_BATCH_SIZE) {
      chunks.push(missingWords.slice(i, i + DICT_BATCH_SIZE));
    }
    for (const chunk of chunks) {
      // eslint-disable-next-line no-await-in-loop
      await fetchMeaningsBatch(chunk);
    }
  }

  const meaningPool = uniqueWords
    .map((word) => firstMeaningText(meaningCache.get(word)))
    .filter(Boolean);
  const uniqueMeaningPool = [...new Set(meaningPool)];

  const seenWord = new Set();
  const items = [];
  const enrichedRows = tokenRows.map((row) => {
    const meaningResult = meaningCache.get(row.word) || null;
    return {
      ...row,
      wordDifficulty: scoreWordDifficulty(row.word, meaningResult),
    };
  });
  const rankedRows = sortRowsByDifficulty(enrichedRows, profile.wordSelectMode);
  for (const row of rankedRows) {
    if (items.length >= Math.min(QUIZ_MAX_COUNT, profile.maxCount)) {
      break;
    }
    if (seenWord.has(row.word)) {
      continue;
    }

    const meaning = firstMeaningText(meaningCache.get(row.word));
    if (!meaning) {
      continue;
    }
    const options = buildQuizOptions(meaning, uniqueMeaningPool, profile.optionCount, profile.distractorMode);
    if (options.length < 2) {
      continue;
    }
    if (!options.some((value) => normalizeForCompare(value) === normalizeForCompare(meaning))) {
      continue;
    }

    seenWord.add(row.word);
    items.push({
      sentenceIndex: row.sentenceIndex,
      promptWord: row.word,
      promptReading: row.reading,
      promptSentence: row.sentencePlain,
      answer: meaning,
      options,
    });
  }

  return items;
}

function resetQuizState() {
  quizState.active = false;
  quizState.completed = false;
  quizState.index = 0;
  quizState.correct = 0;
  quizState.wrong = 0;
  quizState.items = [];
  quizState.difficulty = "normal";
  if (quizDifficultyMenu) {
    quizDifficultyMenu.hidden = true;
  }
}

function updateQuizButton() {
  if (!startQuizBtn) {
    return;
  }
  const profile = QUIZ_DIFFICULTY[quizState.difficulty] || QUIZ_DIFFICULTY.normal;
  startQuizBtn.textContent = quizState.active ? `퀴즈 재시작 (${profile.label})` : "퀴즈 시작";
  startQuizBtn.disabled = sentences.length === 0;
}

function renderQuizPanelHtml() {
  if (!quizState.active || quizState.items.length === 0) {
    return "";
  }

  if (quizState.completed) {
    return (
      `<section class="quiz-panel"><div class="quiz-head"><strong>퀴즈 결과</strong><span class="quiz-meta">정답 ${quizState.correct} / 오답 ${quizState.wrong}</span></div>` +
      `<p class="quiz-result">퀴즈가 끝났어. 다시 풀어보려면 <em>퀴즈 재시작</em>을 눌러줘.</p></section>`
    );
  }

  const item = quizState.items[quizState.index];
  const profile = QUIZ_DIFFICULTY[quizState.difficulty] || QUIZ_DIFFICULTY.normal;
  const optionHtml = item.options
    .map((option) => (
      `<button type="button" class="ghost quiz-option" data-quiz-option="${escapeHtml(option)}">${escapeHtml(option)}</button>`
    ))
    .join("");
  const readingHtml = item.promptReading
    ? (hasKanji(item.promptWord)
      ? ` <ruby>${escapeHtml(item.promptWord)}<rt>${escapeHtml(item.promptReading)}</rt></ruby>`
      : ` <strong>${escapeHtml(item.promptWord)}</strong> <span class="quiz-meta">(${escapeHtml(item.promptReading)})</span>`)
    : ` <strong>${escapeHtml(item.promptWord)}</strong>`;
  const sentenceHintHtml = profile.showSentenceHint && item.promptSentence
    ? `<br /><span class="quiz-meta">예문 힌트: ${escapeHtml(item.promptSentence)}</span>`
    : "";

  return (
    `<section class="quiz-panel" data-quiz-active="true"><div class="quiz-head"><strong>단어 뜻 퀴즈</strong>` +
    `<span class="quiz-meta">${profile.label} | ${quizState.index + 1}/${quizState.items.length} | 정답 ${quizState.correct} | 오답 ${quizState.wrong}</span></div>` +
    `<p class="quiz-question">${readingHtml}<br />뜻으로 맞는 보기를 고르세요.${sentenceHintHtml}</p><div class="quiz-options">${optionHtml}</div></section>`
  );
}

function renderSentences() {
  if (sentences.length === 0) {
    output.innerHTML =
      '<div class="empty-state"><strong>아직 생성된 문장이 없어요.</strong><p>일본어 문장을 입력하고 <em>후리가나 생성</em>을 눌러보세요.</p></div>';
    playAllBtn.disabled = true;
    updateQuizButton();
    refreshPlaybackUi();
    return;
  }

  const sentenceRowsHtml = sentences
    .map(
      (sentence, index) =>
        `<div class="sentence-row" data-sentence-index="${index}"><button class="sentence-play" data-sentence-index="${index}" type="button">▶</button><button class="sentence-download" data-download-sentence-index="${index}" type="button">↓</button><div class="sentence-text">${sentence.html}</div></div>`
    )
    .join("");
  output.innerHTML = `${sentenceRowsHtml}${renderQuizPanelHtml()}`;

  playAllBtn.disabled = true;
  downloadAllBtn.disabled = !isVoiceReady();
  updateQuizButton();
  refreshPlaybackUi();
}

function scrollOutputToTop() {
  output.scrollTo({ top: 0, behavior: "smooth" });
}

function scrollOutputToQuiz() {
  const panel = output.querySelector(".quiz-panel");
  if (!panel) {
    return;
  }
  const top = panel.offsetTop - 6;
  output.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
}

function stopActiveAudio() {
  stopLive2dLipSync();
  if (activeAudio) {
    activeAudio.pause();
    activeAudio.currentTime = 0;
    activeAudio = null;
  }
  if (activeAudioUrl) {
    URL.revokeObjectURL(activeAudioUrl);
    activeAudioUrl = "";
  }
}

function stopPlayback(message = "재생 정지") {
  playToken += 1;
  stopActiveAudio();
  clearPlayingState();
  setVoiceStatus(message);
}

function sanitizeFilePart(text) {
  return text
    .replace(/[\\/:*?"<>|]/g, "")
    .replace(/\s+/g, "_")
    .slice(0, 24);
}

function triggerBlobDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function hideMeaningTooltip() {
  meaningTooltip.classList.remove("show");
}

function showMeaningTooltip(html, clientX, clientY) {
  meaningTooltip.innerHTML = html;
  const offset = 14;
  const margin = 12;
  const rect = meaningTooltip.getBoundingClientRect();

  let left = clientX + offset;
  let top = clientY + offset;

  if (left + rect.width > window.innerWidth - margin) {
    left = window.innerWidth - rect.width - margin;
  }
  if (top + rect.height > window.innerHeight - margin) {
    top = clientY - rect.height - offset;
  }
  if (top < margin) {
    top = margin;
  }
  if (left < margin) {
    left = margin;
  }

  meaningTooltip.style.left = `${left}px`;
  meaningTooltip.style.top = `${top}px`;
  meaningTooltip.classList.add("show");
}

async function fetchMeaning(word) {
  if (meaningCache.has(word)) {
    return meaningCache.get(word);
  }
  if (meaningInFlight.has(word)) {
    return meaningInFlight.get(word);
  }

  const pending = (async () => {
    const res = await fetchWithRuntimeTimeout(`/api/dict?word=${encodeURIComponent(word)}`, {}, REQUEST_TIMEOUT_MS);
    if (!res.ok) {
      throw new Error(`dict_http_${res.status}`);
    }
    const data = await res.json();
    const result = data && data.ok ? data.result : null;
    meaningCache.set(word, result);
    upsertWordbookEntry(word, result);
    renderWordbook();
    return result;
  })();
  meaningInFlight.set(word, pending);
  try {
    return await pending;
  } finally {
    meaningInFlight.delete(word);
  }
}

async function fetchMeaningsBatch(words) {
  const res = await fetchWithRuntimeTimeout("/api/dict/batch", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ words }),
  }, REQUEST_TIMEOUT_MS);
  if (!res.ok) {
    throw new Error(`dict_batch_http_${res.status}`);
  }
  const data = await res.json();
  const results = data && data.ok && data.results && typeof data.results === "object" ? data.results : {};

  const retryWords = [];
  Object.entries(results).forEach(([word, value]) => {
    if (value) {
      meaningCache.set(word, value);
      upsertWordbookEntry(word, value);
      return;
    }
    retryWords.push(word);
  });

  if (retryWords.length > 0) {
    await Promise.all(
      retryWords.map(async (word) => {
        try {
          await fetchMeaning(word);
        } catch {
          meaningCache.set(word, null);
          upsertWordbookEntry(word, null);
        }
      })
    );
  }
  renderWordbook();
  return results;
}

function collectOutputWords() {
  const tokens = output.querySelectorAll(".dict-token");
  const words = [];
  tokens.forEach((tokenEl) => {
    const word = String(tokenEl.dataset.word || "").trim();
    if (word) {
      words.push(word);
    }
  });
  return [...new Set(words)];
}

function upsertWordbookEntry(rawWord, result, readingFallback = "") {
  const word = String(rawWord || "").trim();
  if (!word) {
    return;
  }

  const current = wordbookMap.get(word);
  const entry = {
    word: result && result.word ? String(result.word) : word,
    reading: result && result.reading ? String(result.reading) : String(readingFallback || ""),
    meanings: result && Array.isArray(result.meanings) ? result.meanings : [],
    jlpt: result && Array.isArray(result.jlpt) ? result.jlpt : [],
    partsOfSpeech: result && Array.isArray(result.partsOfSpeech) ? result.partsOfSpeech : [],
  };

  if (current) {
    if (entry.meanings.length === 0 && current.meanings.length > 0) {
      entry.meanings = current.meanings;
    }
    if (entry.jlpt.length === 0 && current.jlpt.length > 0) {
      entry.jlpt = current.jlpt;
    }
    if (entry.partsOfSpeech.length === 0 && current.partsOfSpeech.length > 0) {
      entry.partsOfSpeech = current.partsOfSpeech;
    }
  }
  wordbookMap.set(word, entry);
}

function renderWordbook() {
  const entries = [...wordbookMap.values()];
  wordbookCount.textContent = `${entries.length}개`;

  if (entries.length === 0) {
    wordbookGrid.innerHTML = '<div class="wordbook-empty">단어장을 아직 만들지 않았어. 뜻 모드를 준비하면 자동으로 채워져.</div>';
    return;
  }

  const sorted = [...entries].sort((a, b) => a.word.localeCompare(b.word, "ja"));
  wordbookGrid.innerHTML = `<section class="wordbook-group"><header><h4>전체</h4><span>${sorted.length}</span></header><div class="wordbook-items">${
    sorted
      .map((entry) => {
        const readingHtml = entry.reading ? `<span class="reading">${escapeHtml(entry.reading)}</span>` : "";
        const posHtml = entry.partsOfSpeech.length > 0
          ? `<span class="pos">${escapeHtml(entry.partsOfSpeech.join(" / "))}</span>`
          : "";
        const jlptHtml = entry.jlpt.length > 0
          ? `<span class="pos">${escapeHtml(entry.jlpt.join(", "))}</span>`
          : "";
        const meaning = entry.meanings.length > 0
          ? escapeHtml(entry.meanings.slice(0, 2).join(" | "))
          : "뜻 없음";
        return `<article class="wordbook-item"><div class="head"><strong>${escapeHtml(entry.word)}</strong>${readingHtml}</div>${jlptHtml}${posHtml}<p>${meaning}</p></article>`;
      })
      .join("")
  }</div></section>`;
}

function refreshWordbookFromCurrentOutput() {
  const words = collectOutputWords();
  words.forEach((word) => {
    if (!wordbookMap.has(word)) {
      upsertWordbookEntry(word, meaningCache.get(word) || null);
    }
  });
  renderWordbook();
}

function setWordbookVisible(visible) {
  wordbookPanel.hidden = !visible;
  toggleWordbookBtn.textContent = visible ? "단어장 닫기" : "단어장 열기";
}

function setWordbookButtonVisible(visible) {
  wordbookAnchor.hidden = false;
  toggleWordbookBtn.disabled = !visible;
  if (!visible) {
    setWordbookVisible(false);
    toggleWordbookBtn.textContent = "단어장 열기";
  }
}

async function prefetchMeanings(words, seq) {
  const queue = words.filter((word) => {
    if (!meaningCache.has(word)) {
      return true;
    }
    const cached = meaningCache.get(word);
    const cachedJlpt = cached && Array.isArray(cached.jlpt) ? cached.jlpt : [];
    // Refresh entries that were previously unknown so new server-side matching can reclassify them.
    return cached && cachedJlpt.length === 0;
  });
  const total = queue.length;
  if (total === 0) {
    refreshWordbookFromCurrentOutput();
    return { done: 0, total: 0 };
  }

  let done = 0;
  for (let i = 0; i < queue.length; i += DICT_BATCH_SIZE) {
    if (seq !== meaningPrepareSeq) {
      break;
    }

    const chunk = queue.slice(i, i + DICT_BATCH_SIZE);
    try {
      await fetchMeaningsBatch(chunk);
    } catch {
      await Promise.all(
        chunk.map(async (word) => {
          try {
            await fetchMeaning(word);
          } catch {
            meaningCache.set(word, null);
            upsertWordbookEntry(word, null);
          }
        })
      );
      renderWordbook();
    }

    done += chunk.length;
    if (seq === meaningPrepareSeq) {
      toggleMeaningBtn.textContent = `뜻 모드 준비중... (${done}/${total})`;
    }
  }

  return { done, total };
}

function disableMeaningMode() {
  meaningPrepareSeq += 1;
  isMeaningPreparing = false;
  meaningMode = false;
  toggleMeaningBtn.disabled = false;
  toggleMeaningBtn.textContent = "뜻 모드 OFF";
  document.body.classList.remove("meaning-mode");
  if (currentMeaningTarget) {
    currentMeaningTarget.classList.remove("active");
    currentMeaningTarget = null;
  }
  hideMeaningTooltip();
  setWordbookButtonVisible(false);
}

async function enableMeaningMode() {
  if (meaningMode) {
    return true;
  }
  if (isMeaningPreparing) {
    while (isMeaningPreparing) {
      // Wait for any in-flight preparation triggered by another action.
      // eslint-disable-next-line no-await-in-loop
      await sleep(60);
    }
    return meaningMode;
  }

  const words = collectOutputWords();
  if (words.length === 0) {
    meaningMode = true;
    toggleMeaningBtn.textContent = "뜻 모드 ON";
    document.body.classList.add("meaning-mode");
    setWordbookButtonVisible(true);
    return true;
  }

  isMeaningPreparing = true;
  const seq = ++meaningPrepareSeq;
  toggleMeaningBtn.textContent = "뜻 모드 준비중... (0/0)";
  try {
    const result = await prefetchMeanings(words, seq);
    if (seq !== meaningPrepareSeq) {
      return false;
    }
    meaningMode = true;
    document.body.classList.add("meaning-mode");
    toggleMeaningBtn.textContent = "뜻 모드 ON";
    setWordbookButtonVisible(true);
    if (result.total > 0) {
      setStatus(`뜻 모드 준비 완료 (${result.done}/${result.total}).`);
    }
    return true;
  } finally {
    if (seq === meaningPrepareSeq) {
      isMeaningPreparing = false;
    }
  }
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`스크립트 로드 실패: ${src}`));
    document.head.appendChild(script);
  });
}

async function ensureLive2dLoaded(mode = "cubism4") {
  const requestedMode = mode === "cubism5" ? "cubism5" : "cubism4";

  const hasLoadedCandidateScript = (candidates) =>
    [...document.scripts].some((script) => candidates.includes(script.src));

  const loadFirstAvailable = async (candidates) => {
    let lastError = null;
    for (const src of candidates) {
      const already = [...document.scripts].some((script) => script.src === src);
      if (already) {
        return src;
      }
      try {
        // eslint-disable-next-line no-await-in-loop
        await loadScript(src);
        return src;
      } catch (error) {
        lastError = error;
      }
    }
    throw lastError || new Error("script_load_failed");
  };

  if (!window.PIXI) {
    await loadFirstAvailable(LIVE2D_SCRIPT_CANDIDATES.pixi);
  }
  // Always prefer Core v5 first: it can read newer MOC3 and is backward-compatible in our flow.
  const coreCandidates = LIVE2D_SCRIPT_CANDIDATES.core5;
  const coreAlreadyLoaded = hasLoadedCandidateScript(coreCandidates);
  if (!window.Live2DCubismCore || !coreAlreadyLoaded) {
    await loadFirstAvailable(coreCandidates);
  }

  const displayCandidates = LIVE2D_SCRIPT_CANDIDATES.display4;
  const alreadyLoadedRequested = hasLoadedCandidateScript(displayCandidates);
  const hasLive2d = Boolean(window.PIXI && window.PIXI.live2d && window.PIXI.live2d.Live2DModel);
  if (!alreadyLoadedRequested || !hasLive2d || live2dDisplayRuntimeMode !== requestedMode) {
    await loadFirstAvailable(displayCandidates);
    live2dDisplayRuntimeMode = requestedMode;
  }

  if (!window.PIXI || !window.PIXI.live2d || !window.PIXI.live2d.Live2DModel) {
    throw new Error(`live2d_loader_unavailable:${requestedMode}`);
  }
}

function shouldMarkModelAsBad(error) {
  const msg = String(error && error.message ? error.message : error || "").toLowerCase();
  if (!msg) {
    return false;
  }
  // Runtime mismatch/temporary load errors should not permanently mark model as incompatible.
  if (msg.includes("unknown error") || msg.includes("live2d_runtime_failed") || msg.includes("model_moc_version_unsupported")) {
    return false;
  }
  return msg.includes("not found") || msg.includes("http_404") || msg.includes("model_not_found") || msg.includes("syntaxerror");
}

function getLive2dCoreModel() {
  return (
    live2dModel &&
    live2dModel.internalModel &&
    live2dModel.internalModel.coreModel &&
    typeof live2dModel.internalModel.coreModel.setParameterValueById === "function"
  )
    ? live2dModel.internalModel.coreModel
    : null;
}

function setLive2dParam(id, value, weight = 1) {
  if (!live2dCore) {
    return;
  }
  try {
    live2dCore.setParameterValueById(id, Number(value) || 0, Number(weight) || 1);
  } catch {
    // ignore param misses
  }
}

function hideLive2dPartById(partId) {
  const targetId = String(partId || "").trim();
  if (!targetId || !live2dCore) {
    return false;
  }
  try {
    if (typeof live2dCore.setPartOpacityById === "function") {
      live2dCore.setPartOpacityById(targetId, 0);
      return true;
    }
  } catch {
    // continue
  }
  try {
    const count = Number(typeof live2dCore.getPartCount === "function" ? live2dCore.getPartCount() : 0);
    if (Number.isFinite(count) && count > 0 && typeof live2dCore.getPartId === "function" && typeof live2dCore.setPartOpacityByIndex === "function") {
      for (let i = 0; i < count; i += 1) {
        const currentId = String(live2dCore.getPartId(i) || "");
        if (currentId === targetId) {
          live2dCore.setPartOpacityByIndex(i, 0);
          return true;
        }
      }
    }
  } catch {
    // continue
  }
  return false;
}

function applyLive2dAutoHideParts(modelConfig) {
  const partIds = Array.isArray(modelConfig && modelConfig.autoHidePartIds) ? modelConfig.autoHidePartIds : [];
  if (!live2dCore || partIds.length === 0) {
    return 0;
  }
  let hidden = 0;
  partIds.forEach((id) => {
    if (hideLive2dPartById(id)) {
      hidden += 1;
    }
  });
  return hidden;
}

function applyLive2dExpressionFrame() {
  if (!live2dCore || live2dExpressionParams.length === 0) {
    return;
  }
  live2dExpressionParams.forEach((param) => {
    const id = String(param.Id || "");
    const value = Number(param.Value || 0);
    const blend = String(param.Blend || "Add").toLowerCase();
    if (!id) {
      return;
    }
    const base = live2dExpressionDefaults.has(id) ? live2dExpressionDefaults.get(id) : 0;
    if (blend === "add") {
      setLive2dParam(id, base + value);
    } else if (blend === "multiply") {
      setLive2dParam(id, base * value);
    } else {
      setLive2dParam(id, value);
    }
  });
}

function rememberExpressionDefaults(params) {
  if (!live2dCore || !params) {
    return;
  }
  if (typeof live2dCore.getParameterValueById !== "function") {
    return;
  }
  params.forEach((param) => {
    const id = String(param && param.Id || "");
    if (!id || live2dExpressionDefaults.has(id)) {
      return;
    }
    try {
      live2dExpressionDefaults.set(id, Number(live2dCore.getParameterValueById(id) || 0));
    } catch {
      live2dExpressionDefaults.set(id, 0);
    }
  });
}

function resetActiveExpressionParams() {
  if (!live2dCore || live2dExpressionActiveIds.size === 0) {
    return;
  }
  live2dExpressionActiveIds.forEach((id) => {
    const base = live2dExpressionDefaults.has(id) ? live2dExpressionDefaults.get(id) : 0;
    setLive2dParam(id, base);
  });
  live2dExpressionActiveIds = new Set();
}

async function loadLive2dExpression(filePath) {
  const file = String(filePath || "").trim();
  if (!file) {
    resetActiveExpressionParams();
    live2dExpressionParams = [];
    return;
  }

  let params = live2dExpressionCache.get(file);
  if (!params) {
    const res = await fetch(encodeURI(file));
    if (!res.ok) {
      throw new Error(`expression_http_${res.status}`);
    }
    const data = await res.json();
    params = data && Array.isArray(data.Parameters) ? data.Parameters : [];
    live2dExpressionCache.set(file, params);
  }

  rememberExpressionDefaults(params);
  resetActiveExpressionParams();
  live2dExpressionActiveIds = new Set(params.map((param) => String(param && param.Id || "")).filter(Boolean));
  live2dExpressionParams = params;
}

function initLive2dExpressionUi() {
  if (!live2dExpressionSelect) {
    return;
  }
  live2dExpressionSelect.innerHTML = live2dExpressionOptions
    .map((opt) => `<option value="${escapeHtml(opt.value)}">${escapeHtml(opt.label)}</option>`)
    .join("");
}

function initLive2dMotionUi() {
  if (!live2dMotionSelect) {
    return;
  }
  live2dMotionSelect.innerHTML = live2dMotionOptions
    .map((opt) => `<option value="${escapeHtml(opt.value)}">${escapeHtml(opt.label)}</option>`)
    .join("");
}

function getCurrentLive2dModelConfig() {
  if (!live2dCurrentModelKey) {
    return null;
  }
  return live2dCatalog.find((item) => item.key === live2dCurrentModelKey) || null;
}

function getCurrentLive2dZoomMultiplier() {
  const model = getCurrentLive2dModelConfig();
  const key = String(model && model.key ? model.key : live2dCurrentModelKey || "").toLowerCase();
  if (!key) {
    return 1;
  }
  const found = LIVE2D_MODEL_ZOOM_OVERRIDES.find((rule) => key.includes(String(rule.match || "").toLowerCase()));
  if (!found) {
    return 1;
  }
  const value = Number(found.zoom);
  return Number.isFinite(value) && value > 0 ? value : 1;
}

function getCurrentLive2dYOffset() {
  const model = getCurrentLive2dModelConfig();
  const key = String(model && model.key ? model.key : live2dCurrentModelKey || "").toLowerCase();
  if (!key) {
    return 0;
  }
  const found = LIVE2D_MODEL_Y_OFFSET_OVERRIDES.find((rule) => key.includes(String(rule.match || "").toLowerCase()));
  if (!found) {
    return 0;
  }
  const value = Number(found.yOffset);
  return Number.isFinite(value) ? value : 0;
}

function setLive2dExpressionOptionsFromModel(modelConfig) {
  const expressions = modelConfig && Array.isArray(modelConfig.expressions)
    ? modelConfig.expressions
      .filter((exp) => exp && exp.value && exp.file)
      .map((exp) => ({
        value: String(exp.value),
        label: String(exp.label || exp.value),
        file: String(exp.file),
      }))
    : [];
  live2dExpressionOptions = [{ value: "", label: "기본 표정", file: "" }, ...expressions];
  initLive2dExpressionUi();
}

function setLive2dMotionOptionsFromModel(modelConfig) {
  const procedural = [
    { value: "proc:nod", label: "가상 · 끄덕끄덕", group: "proc", index: 0, file: "" },
    { value: "proc:shake", label: "가상 · 절래절래", group: "proc", index: 1, file: "" },
    { value: "proc:tilt", label: "가상 · 고개 기울이기", group: "proc", index: 2, file: "" },
    { value: "proc:sway", label: "가상 · 좌우 리듬", group: "proc", index: 3, file: "" },
    { value: "proc:bounce", label: "가상 · 통통 점프", group: "proc", index: 4, file: "" },
    { value: "proc:dance", label: "가상 · 댄스", group: "proc", index: 5, file: "" },
  ];
  const motions = modelConfig && Array.isArray(modelConfig.motions)
    ? modelConfig.motions
      .filter((motion) =>
        motion
        && motion.value
        && Number.isInteger(Number(motion.index))
        && String(motion.group || "").trim()
      )
      .map((motion) => ({
        value: String(motion.value),
        label: String(motion.label || motion.value),
        group: String(motion.group || ""),
        index: Number(motion.index),
        file: String(motion.file || ""),
      }))
    : [];
  live2dMotionOptions = [{ value: "", label: "기본 대기", group: "", index: -1, file: "" }, ...procedural, ...motions];
  initLive2dMotionUi();
}

function toAbsoluteAssetPath(value) {
  const raw = String(value || "").trim();
  if (!raw) {
    return "";
  }
  if (/^https?:\/\//i.test(raw) || raw.startsWith("blob:") || raw.startsWith("data:")) {
    return encodeURI(raw);
  }
  const normalized = raw.startsWith("/") ? raw : `/${raw.replace(/^\/+/, "")}`;
  const origin = typeof window !== "undefined" && window.location && window.location.origin
    ? String(window.location.origin)
    : "";
  return encodeURI(origin ? `${origin}${normalized}` : normalized);
}

function joinPosixPath(baseDir, relPath) {
  const base = String(baseDir || "").replace(/\/+$/g, "");
  const rel = String(relPath || "").replace(/^\/+/g, "");
  if (!base) {
    return rel;
  }
  if (!rel) {
    return base;
  }
  return `${base}/${rel}`;
}

function revokePatchedLive2dModelConfigUrl() {
  if (!live2dPatchedModelConfigUrl) {
    return;
  }
  try {
    URL.revokeObjectURL(live2dPatchedModelConfigUrl);
  } catch {
    // no-op
  }
  live2dPatchedModelConfigUrl = "";
}

async function buildLive2dModelConfigUrl(modelConfig) {
  const modelPath = String(modelConfig && modelConfig.modelPath || "").trim();
  if (!modelPath) {
    throw new Error("model_path_empty");
  }
  const directUrl = encodeURI(modelPath);
  const modelRes = await fetch(directUrl, { cache: "no-cache" });
  if (!modelRes.ok) {
    throw new Error(`model_json_http_${modelRes.status}`);
  }
  const modelJson = await modelRes.json();
  if (!modelJson || typeof modelJson !== "object") {
    return directUrl;
  }
  const refs = modelJson.FileReferences && typeof modelJson.FileReferences === "object"
    ? modelJson.FileReferences
    : null;
  if (!refs) {
    return directUrl;
  }

  const hasNativeMotions = refs.Motions && typeof refs.Motions === "object" && Object.keys(refs.Motions).length > 0;
  const hasCatalogMotions = Array.isArray(modelConfig.motions) && modelConfig.motions.length > 0;
  const shouldPatchMotions = !hasNativeMotions && hasCatalogMotions;
  if (!shouldPatchMotions) {
    return directUrl;
  }

  try {
    const modelDir = modelPath.includes("/") ? modelPath.slice(0, modelPath.lastIndexOf("/")) : "";
    const patched = JSON.parse(JSON.stringify(modelJson));
    if (!patched.FileReferences || typeof patched.FileReferences !== "object") {
      patched.FileReferences = {};
    }
    const patchedRefs = patched.FileReferences;

    const mocRaw = String(patchedRefs.Moc || "").trim();
    if (mocRaw) {
      patchedRefs.Moc = toAbsoluteAssetPath(joinPosixPath(modelDir, mocRaw));
    }
    const physicsRaw = String(patchedRefs.Physics || "").trim();
    if (physicsRaw) {
      patchedRefs.Physics = toAbsoluteAssetPath(joinPosixPath(modelDir, physicsRaw));
    }
    const displayInfoRaw = String(patchedRefs.DisplayInfo || "").trim();
    if (displayInfoRaw) {
      patchedRefs.DisplayInfo = toAbsoluteAssetPath(joinPosixPath(modelDir, displayInfoRaw));
    }
    if (Array.isArray(patchedRefs.Textures)) {
      patchedRefs.Textures = patchedRefs.Textures
        .map((tex) => String(tex || "").trim())
        .filter(Boolean)
        .map((tex) => toAbsoluteAssetPath(joinPosixPath(modelDir, tex)));
    }
    if (Array.isArray(patchedRefs.Expressions)) {
      patchedRefs.Expressions = patchedRefs.Expressions.map((exp) => {
        const fileRaw = String(exp && exp.File || "").trim();
        if (!fileRaw) {
          return exp;
        }
        return {
          ...exp,
          File: toAbsoluteAssetPath(joinPosixPath(modelDir, fileRaw)),
        };
      });
    }

    const grouped = {};
    modelConfig.motions.forEach((motion) => {
      const group = String(motion && motion.group || "").trim() || "Auto";
      const index = Number(motion && motion.index);
      const filePath = toAbsoluteAssetPath(String(motion && motion.file || "").trim());
      if (!filePath || !Number.isFinite(index) || index < 0) {
        return;
      }
      if (!grouped[group]) {
        grouped[group] = [];
      }
      grouped[group][index] = { File: filePath };
    });
    Object.keys(grouped).forEach((group) => {
      const dense = grouped[group];
      grouped[group] = dense.map((item) => item || { File: "" });
    });
    patchedRefs.Motions = grouped;

    revokePatchedLive2dModelConfigUrl();
    const blob = new Blob([JSON.stringify(patched)], { type: "application/json" });
    live2dPatchedModelConfigUrl = URL.createObjectURL(blob);
    return live2dPatchedModelConfigUrl;
  } catch (error) {
    console.warn("live2d model config patch failed; fallback to original", error);
    return directUrl;
  }
}

function fillLive2dModelSelect() {
  if (!live2dModelSelect) {
    return;
  }
  if (live2dCatalog.length === 0) {
    live2dModelSelect.innerHTML = "<option value=''>모델 없음</option>";
    live2dModelSelect.disabled = true;
    return;
  }
  live2dModelSelect.innerHTML = live2dCatalog
    .map((model) => {
      const tag = model.type === "live2d" ? "Live2D" : model.type === "vrm" ? "VRM" : "FBX";
      const bad = badLive2dModelKeys.has(model.key);
      const unsupported = model.compatible === false;
      const mocSuffix = model.mocVersion > 0 ? ` moc v${model.mocVersion}` : "";
      const suffix = unsupported ? ` (${mocSuffix} 미지원)` : bad ? " (호환 불가)" : "";
      const disabledAttr = unsupported ? " disabled" : "";
      return `<option value="${escapeHtml(model.key)}"${disabledAttr}>[${escapeHtml(tag)}] ${escapeHtml(model.name)}${escapeHtml(suffix)}</option>`;
    })
    .join("");
  live2dModelSelect.disabled = false;
  const selectableKeys = live2dCatalog.filter((item) => item.compatible !== false).map((item) => item.key);
  if (live2dCurrentModelKey && selectableKeys.includes(live2dCurrentModelKey)) {
    live2dModelSelect.value = live2dCurrentModelKey;
  } else if (selectableKeys.length > 0) {
    live2dModelSelect.value = selectableKeys[0];
    live2dCurrentModelKey = selectableKeys[0];
  } else {
    live2dModelSelect.value = "";
    live2dCurrentModelKey = "";
  }
}

async function loadLive2dCatalog() {
  const res = await fetchWithRuntimeTimeout("/api/live2d/models", {}, REQUEST_TIMEOUT_MS);
  if (!res.ok) {
    throw new Error(`live2d_models_http_${res.status}`);
  }
  const data = await res.json();
  const models = data && data.ok && Array.isArray(data.models) ? data.models : [];
  live2dCatalog = models
    .filter((item) => item && item.key && item.modelPath && String(item.type || "live2d") === "live2d")
    .map((item) => ({
      key: String(item.key),
      type: String(item.type || "live2d"),
      name: String(item.name || item.key),
      modelPath: String(item.modelPath),
      mocVersion: Number(item.mocVersion || 0),
      compatible: item.compatible !== false,
      autoHidePartIds: Array.isArray(item.autoHidePartIds) ? item.autoHidePartIds.map((id) => String(id)) : [],
      expressions: Array.isArray(item.expressions) ? item.expressions : [],
      motions: Array.isArray(item.motions) ? item.motions : [],
    }));
  if (!live2dCurrentModelKey || !live2dCatalog.some((item) => item.key === live2dCurrentModelKey)) {
    live2dCurrentModelKey = live2dCatalog.length > 0 ? live2dCatalog[0].key : "";
  }
  fillLive2dModelSelect();
}

async function loadSelectedLive2dModel(modelKey) {
  const key = String(modelKey || "").trim();
  const modelConfig = live2dCatalog.find((item) => item.key === key);
  if (!modelConfig) {
    throw new Error("model_not_found");
  }
  if (modelConfig.compatible === false) {
    throw new Error(`model_moc_version_unsupported:v${modelConfig.mocVersion || "?"}`);
  }

  setLive2dStatus("모델 불러오는 중...");

  if (modelConfig.type === "live2d") {
    const preferredRuntimeMode = modelConfig.mocVersion >= 5 ? "cubism5" : "cubism4";
    destroyThreeRuntime();

    let nextModel = null;
    let lastError = null;
    const runtimeAttempts = preferredRuntimeMode === "cubism5"
      ? ["cubism5", "cubism4"]
      : ["cubism4", "cubism5"];
    for (const runtimeMode of runtimeAttempts) {
      try {
        // eslint-disable-next-line no-await-in-loop
        await ensureLive2dLoaded(runtimeMode);
        if (!live2dApp) {
          live2dApp = new window.PIXI.Application({
            resizeTo: live2dStage,
            autoDensity: true,
            antialias: true,
            backgroundAlpha: 0,
          });
          live2dStage.appendChild(live2dApp.view);
          live2dApp.ticker.add(updateLive2dFaceTracking);
        }
        // Some models ship motion3 files but omit FileReferences.Motions in model3.json.
        // Build a patched config URL so runtime motion playback can work.
        // eslint-disable-next-line no-await-in-loop
        const modelUrl = await buildLive2dModelConfigUrl(modelConfig);
        // eslint-disable-next-line no-await-in-loop
        nextModel = await window.PIXI.live2d.Live2DModel.from(modelUrl, {
          autoInteract: false,
        });
        break;
      } catch (error) {
        lastError = error;
      }
    }
    if (!nextModel) {
      if (shouldMarkModelAsBad(lastError)) {
        badLive2dModelKeys.add(modelConfig.key);
        fillLive2dModelSelect();
      }
      throw lastError || new Error(`live2d_runtime_failed:v${modelConfig.mocVersion || "?"}`);
    }

    stopLive2dLipSync();
    resetActiveExpressionParams();
    live2dExpressionParams = [];
    live2dExpressionActiveIds = new Set();
    live2dExpressionDefaults.clear();
    if (live2dModel) {
      try {
        live2dApp.stage.removeChild(live2dModel);
      } catch {
        // no-op
      }
      if (typeof live2dModel.destroy === "function") {
        live2dModel.destroy();
      }
      live2dModel = null;
      live2dCore = null;
    }

    live2dModel = nextModel;
    live2dCore = getLive2dCoreModel();
    live2dApp.stage.addChild(live2dModel);
    // Set current key before fitting so model-specific zoom override is applied correctly on switches.
    live2dCurrentModelKey = modelConfig.key;
    fitLive2dModelToStage();
    activeAvatarType = "live2d";
    const hiddenPartCount = applyLive2dAutoHideParts(modelConfig);

    setLive2dExpressionOptionsFromModel(modelConfig);
    setLive2dMotionOptionsFromModel(modelConfig);
    if (live2dExpressionSelect) {
      live2dExpressionSelect.disabled = false;
      live2dExpressionSelect.value = "";
    }
    if (live2dMotionSelect) {
      live2dMotionSelect.disabled = live2dMotionOptions.length <= 1;
      live2dMotionSelect.value = "";
    }
    if (playLive2dMotionBtn) {
      playLive2dMotionBtn.disabled = live2dMotionOptions.length <= 1;
    }
    await loadLive2dExpression("");
    saveSetting(LS_KEYS.live2dModelKey, live2dCurrentModelKey);
    if (badLive2dModelKeys.has(modelConfig.key)) {
      badLive2dModelKeys.delete(modelConfig.key);
      fillLive2dModelSelect();
    }
    if (live2dModelSelect) {
      live2dModelSelect.value = live2dCurrentModelKey;
    }
    const hideNote = hiddenPartCount > 0 ? ` (워터마크성 레이어 ${hiddenPartCount}개 숨김)` : "";
    setLive2dStatus(`Live2D 준비 완료: ${modelConfig.name}${hideNote}`);
    return;
  }

  destroyLive2dRuntime();
  activeAvatarType = modelConfig.type || "3d";
  setLive2dExpressionOptionsFromModel(null);
  setLive2dMotionOptionsFromModel(null);
  if (live2dExpressionSelect) {
    live2dExpressionSelect.disabled = true;
    live2dExpressionSelect.value = "";
  }
  if (live2dMotionSelect) {
    live2dMotionSelect.disabled = true;
    live2dMotionSelect.value = "";
  }
  if (playLive2dMotionBtn) {
    playLive2dMotionBtn.disabled = true;
  }
  await load3dAvatarModel(modelConfig);
  fitThreeModelToStage();
  clearAutoExpressionTimers();
  live2dCurrentModelKey = modelConfig.key;
  saveSetting(LS_KEYS.live2dModelKey, live2dCurrentModelKey);
  if (live2dModelSelect) {
    live2dModelSelect.value = live2dCurrentModelKey;
  }
  if (modelConfig.type === "fbx") {
    setLive2dStatus(`FBX 모델 준비 완료: ${modelConfig.name} (애니메이션 없으면 정지 포즈로 보일 수 있어요)`);
  } else {
    setLive2dStatus(`VRM 모델 준비 완료: ${modelConfig.name}`);
  }
}

async function loadFirstAvailableLive2dModel(preferredKey = "") {
  if (!Array.isArray(live2dCatalog) || live2dCatalog.length === 0) {
    throw new Error("live2d_catalog_empty");
  }
  const preferred = String(preferredKey || "").trim();
  const candidates = live2dCatalog
    .filter((item) => item.compatible !== false)
    .map((item) => item.key)
    .filter((k) => !badLive2dModelKeys.has(k));
  const order = preferred && !badLive2dModelKeys.has(preferred)
    ? [preferred, ...candidates.filter((k) => k !== preferred)]
    : candidates;
  let lastError = null;
  for (const key of order) {
    try {
      // eslint-disable-next-line no-await-in-loop
      await loadSelectedLive2dModel(key);
      return key;
    } catch (error) {
      lastError = error;
      console.error(error);
    }
  }
  throw lastError || new Error("live2d_load_all_failed");
}

function triggerLive2dReaction(kind, durationMs = 900) {
  live2dReactionKind = String(kind || "");
  live2dReactionStartAt = performance.now();
  live2dReactionDurationMs = Math.max(240, Number(durationMs) || 900);
}

function getLive2dReactionOffset(now) {
  if (!live2dReactionKind || !live2dReactionStartAt || !live2dReactionDurationMs) {
    return { x: 0, y: 0 };
  }

  const elapsed = now - live2dReactionStartAt;
  if (elapsed >= live2dReactionDurationMs) {
    live2dReactionKind = "";
    return { x: 0, y: 0 };
  }

  const progress = elapsed / live2dReactionDurationMs;
  const fade = 1 - progress;
  const wave = Math.sin(progress * Math.PI * 6);
  if (live2dReactionKind === "nod") {
    return { x: 0, y: wave * 14 * fade };
  }
  if (live2dReactionKind === "shake") {
    return { x: wave * 18 * fade, y: 0 };
  }
  return { x: 0, y: 0 };
}

function triggerLive2dProceduralMotion(kind, durationMs = 1100, intensity = 1) {
  live2dProceduralMotionKind = String(kind || "").trim();
  live2dProceduralMotionStartAt = performance.now();
  live2dProceduralMotionDurationMs = Math.max(240, Number(durationMs) || 1100);
  live2dProceduralMotionIntensity = Math.max(0.2, Math.min(2, Number(intensity) || 1));
}

function getLive2dProceduralMotionOffset(now) {
  if (!live2dProceduralMotionKind || !live2dProceduralMotionStartAt || !live2dProceduralMotionDurationMs) {
    return { angleX: 0, angleY: 0, angleZ: 0, bodyX: 0, bodyY: 0 };
  }
  const elapsed = now - live2dProceduralMotionStartAt;
  if (elapsed >= live2dProceduralMotionDurationMs) {
    live2dProceduralMotionKind = "";
    return { angleX: 0, angleY: 0, angleZ: 0, bodyX: 0, bodyY: 0 };
  }

  const progress = elapsed / live2dProceduralMotionDurationMs;
  const fade = 1 - progress;
  const amp = live2dProceduralMotionIntensity;
  const fastWave = Math.sin(progress * Math.PI * 6);
  const midWave = Math.sin(progress * Math.PI * 4);
  const bounce = Math.abs(Math.sin(progress * Math.PI * 7));

  if (live2dProceduralMotionKind === "nod") {
    return { angleX: 0, angleY: fastWave * 16 * fade * amp, angleZ: 0, bodyX: 0, bodyY: 0 };
  }
  if (live2dProceduralMotionKind === "shake") {
    return { angleX: fastWave * 18 * fade * amp, angleY: 0, angleZ: 0, bodyX: 0, bodyY: 0 };
  }
  if (live2dProceduralMotionKind === "tilt") {
    return { angleX: 0, angleY: 0, angleZ: midWave * 20 * fade * amp, bodyX: midWave * 6 * fade * amp, bodyY: 0 };
  }
  if (live2dProceduralMotionKind === "sway") {
    return { angleX: midWave * 10 * fade * amp, angleY: 0, angleZ: midWave * 14 * fade * amp, bodyX: midWave * 9 * fade * amp, bodyY: 0 };
  }
  if (live2dProceduralMotionKind === "bounce") {
    return { angleX: 0, angleY: -bounce * 10 * fade * amp, angleZ: 0, bodyX: 0, bodyY: bounce * 8 * fade * amp };
  }
  if (live2dProceduralMotionKind === "dance") {
    const spin = Math.sin(progress * Math.PI * 8);
    const hop = Math.abs(Math.sin(progress * Math.PI * 10));
    return {
      angleX: spin * 14 * fade * amp,
      angleY: -hop * 8 * fade * amp,
      angleZ: spin * 16 * fade * amp,
      bodyX: spin * 12 * fade * amp,
      bodyY: hop * 10 * fade * amp,
    };
  }
  return { angleX: 0, angleY: 0, angleZ: 0, bodyX: 0, bodyY: 0 };
}

function updateLive2dFaceTracking() {
  if (!live2dModel || !live2dCore) {
    return;
  }
  updateAvatarAim(performance.now());
  applyLive2dExpressionFrame();
  applyLive2dCheekFrame();

  live2dCurrentEyeX += (avatarAimX - live2dCurrentEyeX) * 0.18;
  live2dCurrentEyeY += (avatarAimY - live2dCurrentEyeY) * 0.18;
  const now = performance.now();
  const reactionOffset = getLive2dReactionOffset(now);
  const procOffset = getLive2dProceduralMotionOffset(now);

  setLive2dParam("ParamEyeBallX", live2dCurrentEyeX);
  setLive2dParam("ParamEyeBallY", live2dCurrentEyeY);
  setLive2dParam("ParamAngleX", live2dCurrentEyeX * 16 + reactionOffset.x + procOffset.angleX, 0.7);
  setLive2dParam("ParamAngleY", live2dCurrentEyeY * 12 + reactionOffset.y + procOffset.angleY, 0.7);
  setLive2dParam("ParamAngleZ", procOffset.angleZ, 0.7);
  setLive2dParam("ParamBodyAngleX", procOffset.bodyX, 0.66);
  setLive2dParam("ParamBodyAngleY", procOffset.bodyY, 0.66);
}

function updateLive2dMouth(value) {
  const v = Math.max(0, Math.min(1.1, Number(value) || 0));
  live2dCurrentMouth += (v - live2dCurrentMouth) * 0.36;
  setLive2dParam("ParamMouthOpenY", live2dCurrentMouth);
}

function stopLive2dLipSync() {
  if (live2dLipTimer) {
    cancelAnimationFrame(live2dLipTimer);
    live2dLipTimer = 0;
  }
  live2dLipSource = null;
  updateLive2dMouth(0);
}

function startLive2dLipSync(audioEl) {
  if (!audioEl || !live2dModel) {
    return;
  }

  stopLive2dLipSync();

  if (!live2dAudioCtx) {
    try {
      live2dAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
      live2dAnalyser = live2dAudioCtx.createAnalyser();
      live2dAnalyser.fftSize = 512;
      live2dLipData = new Uint8Array(live2dAnalyser.fftSize);
    } catch {
      return;
    }
  }

  try {
    if (live2dAudioCtx.state === "suspended") {
      live2dAudioCtx.resume();
    }
    live2dLipSource = live2dAudioCtx.createMediaElementSource(audioEl);
    live2dLipSource.connect(live2dAnalyser);
    live2dAnalyser.connect(live2dAudioCtx.destination);
  } catch {
    // createMediaElementSource can only be bound once per media element in some browsers.
    return;
  }

  const tick = () => {
    if (!live2dAnalyser || !live2dLipData || !activeAudio || activeAudio !== audioEl) {
      updateLive2dMouth(0);
      return;
    }
    live2dAnalyser.getByteTimeDomainData(live2dLipData);
    let sum = 0;
    for (let i = 0; i < live2dLipData.length; i += 1) {
      const centered = (live2dLipData[i] - 128) / 128;
      sum += centered * centered;
    }
    const rms = Math.sqrt(sum / live2dLipData.length);
    updateLive2dMouth(Math.min(1, rms * 5.6));
    live2dLipTimer = requestAnimationFrame(tick);
  };

  live2dLipTimer = requestAnimationFrame(tick);
}

function fitLive2dModelToStage() {
  if (!live2dModel || !live2dStage) {
    return;
  }
  const w = live2dStage.clientWidth || 1;
  const h = live2dStage.clientHeight || 1;
  if (live2dModel.anchor && typeof live2dModel.anchor.set === "function") {
    live2dModel.anchor.set(0.5, 1);
  }

  const bounds = typeof live2dModel.getLocalBounds === "function"
    ? live2dModel.getLocalBounds()
    : { width: live2dModel.width || 1, height: live2dModel.height || 1 };
  const boundsW = Math.max(1, Number(bounds.width) || 1);
  const boundsH = Math.max(1, Number(bounds.height) || 1);
  const zoomMultiplier = getCurrentLive2dZoomMultiplier();
  const viewTransform = getLive2dViewTransformByKey(live2dCurrentModelKey);
  const extraZoom = clampLive2dExtraZoom(viewTransform.zoom);
  const scale = Math.min((w * 0.72) / boundsW, (h * 0.96) / boundsH) * LIVE2D_VIEW_ZOOM * zoomMultiplier * extraZoom;
  if (Number.isFinite(scale) && scale > 0) {
    live2dModel.scale.set(scale);
  } else {
    live2dModel.scale.set(0.2);
  }

  const scaledHeight = boundsH * live2dModel.scale.y;
  const yOffset = getCurrentLive2dYOffset();
  live2dModel.x = Math.round(w * 0.5 + Number(viewTransform.x || 0));
  // Keep ears visible by pinning the top edge near the stage top,
  // while allowing lower body to overflow below the stage.
  live2dModel.y = Math.round(LIVE2D_TOP_MARGIN_PX + scaledHeight + yOffset + Number(viewTransform.y || 0));
}

async function ensureThreeLoaded() {
  if (threeModule && gltfLoaderModule && fbxLoaderModule && vrmModule) {
    return;
  }
  if (!threeModule) {
    threeModule = await import("https://esm.sh/three@0.160.0");
  }
  if (!gltfLoaderModule) {
    gltfLoaderModule = await import("https://esm.sh/three@0.160.0/examples/jsm/loaders/GLTFLoader.js");
  }
  if (!fbxLoaderModule) {
    fbxLoaderModule = await import("https://esm.sh/three@0.160.0/examples/jsm/loaders/FBXLoader.js");
  }
  if (!vrmModule) {
    vrmModule = await import("https://esm.sh/@pixiv/three-vrm@2.1.1");
  }
}

function stopThreeRenderLoop() {
  if (threeRenderTimer) {
    cancelAnimationFrame(threeRenderTimer);
    threeRenderTimer = 0;
  }
}

function destroyThreeRuntime() {
  stopThreeRenderLoop();
  threeVrmInstance = null;
  threeIdleTime = 0;
  vrmBlinkElapsed = 0;
  vrmBlinkInterval = 2.6;
  if (threeAvatarRoot) {
    try {
      threeScene.remove(threeAvatarRoot);
    } catch {
      // no-op
    }
    if (typeof threeAvatarRoot.traverse === "function") {
      threeAvatarRoot.traverse((obj) => {
        if (obj.geometry && typeof obj.geometry.dispose === "function") {
          obj.geometry.dispose();
        }
        if (obj.material) {
          const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
          materials.forEach((mat) => {
            if (mat && typeof mat.dispose === "function") {
              mat.dispose();
            }
          });
        }
      });
    }
    threeAvatarRoot = null;
  }
  threeAnimMixers = [];
  if (threeRenderer && threeRenderer.domElement && threeRenderer.domElement.parentNode) {
    threeRenderer.domElement.parentNode.removeChild(threeRenderer.domElement);
  }
  if (threeRenderer) {
    threeRenderer.dispose();
  }
  threeRenderer = null;
  threeScene = null;
  threeCamera = null;
  threeClock = null;
}

function cloneEuler(euler) {
  return { x: Number(euler.x || 0), y: Number(euler.y || 0), z: Number(euler.z || 0) };
}

function ensureBoneBaseRotation(node) {
  if (!node) {
    return null;
  }
  if (!node.userData) {
    node.userData = {};
  }
  if (!node.userData.baseRot) {
    node.userData.baseRot = cloneEuler(node.rotation);
  }
  return node.userData.baseRot;
}

function applyBoneTarget(node, x = 0, y = 0, z = 0, lerp = 0.16) {
  if (!node) {
    return;
  }
  const base = ensureBoneBaseRotation(node);
  if (!base) {
    return;
  }
  const targetX = base.x + x;
  const targetY = base.y + y;
  const targetZ = base.z + z;
  node.rotation.x += (targetX - node.rotation.x) * lerp;
  node.rotation.y += (targetY - node.rotation.y) * lerp;
  node.rotation.z += (targetZ - node.rotation.z) * lerp;
}

function destroyLive2dRuntime() {
  stopLive2dLipSync();
  revokePatchedLive2dModelConfigUrl();
  live2dExpressionParams = [];
  live2dExpressionActiveIds = new Set();
  live2dExpressionDefaults.clear();
  if (live2dApp) {
    try {
      live2dApp.destroy(true, { children: true, texture: true, baseTexture: true });
    } catch {
      // no-op
    }
  }
  live2dApp = null;
  live2dModel = null;
  live2dCore = null;
}

function ensureThreeRuntime() {
  if (!live2dStage || !threeModule) {
    return;
  }
  const THREE = threeModule;
  destroyThreeRuntime();
  threeRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  threeRenderer.setPixelRatio(window.devicePixelRatio || 1);
  const w = Math.max(1, live2dStage.clientWidth || 1);
  const h = Math.max(1, live2dStage.clientHeight || 1);
  threeRenderer.setSize(w, h);
  live2dStage.appendChild(threeRenderer.domElement);

  threeScene = new THREE.Scene();
  threeCamera = new THREE.PerspectiveCamera(28, w / h, 0.01, 100);
  threeCamera.position.set(0, 1.35, 2.6);
  threeClock = new THREE.Clock();
  threeAnimMixers = [];

  const ambient = new THREE.AmbientLight(0xffffff, 1.05);
  const key = new THREE.DirectionalLight(0xffffff, 1.1);
  key.position.set(1.4, 2.2, 1.3);
  const fill = new THREE.DirectionalLight(0xa4d8ff, 0.36);
  fill.position.set(-1.3, 1.1, -0.8);
  threeScene.add(ambient, key, fill);

  const renderTick = () => {
    if (!threeRenderer || !threeScene || !threeCamera) {
      return;
    }
    const dt = threeClock ? threeClock.getDelta() : 0.016;
    threeIdleTime += dt;
    threeAnimMixers.forEach((mixer) => {
      try {
        mixer.update(dt);
      } catch {
        // no-op
      }
    });
    if (threeVrmInstance && typeof threeVrmInstance.update === "function") {
      try {
        updateVrmIdleAndTracking(threeVrmInstance, dt);
        threeVrmInstance.update(dt);
      } catch {
        // no-op
      }
    }
    if (threeAvatarRoot) {
      const baseY = Number(threeAvatarRoot.userData && threeAvatarRoot.userData.baseY || 0);
      const baseRotY = Number(threeAvatarRoot.userData && threeAvatarRoot.userData.baseRotY || 0);
      threeAvatarRoot.position.y = baseY + Math.sin(threeIdleTime * 1.8) * 0.015;
      threeAvatarRoot.rotation.y = baseRotY + Math.sin(threeIdleTime * 0.8) * 0.05;
    }
    threeRenderer.render(threeScene, threeCamera);
    threeRenderTimer = requestAnimationFrame(renderTick);
  };
  threeRenderTimer = requestAnimationFrame(renderTick);
}

function fitThreeModelToStage() {
  if (!threeRenderer || !threeCamera || !live2dStage) {
    return;
  }
  const w = Math.max(1, live2dStage.clientWidth || 1);
  const h = Math.max(1, live2dStage.clientHeight || 1);
  threeRenderer.setSize(w, h);
  threeCamera.aspect = w / h;
  threeCamera.updateProjectionMatrix();
  frameThreeAvatarToView();
}

function frameThreeAvatarToView() {
  if (!threeModule || !threeAvatarRoot || !threeCamera) {
    return;
  }
  const THREE = threeModule;
  const box = new THREE.Box3().setFromObject(threeAvatarRoot);
  if (box.isEmpty()) {
    return;
  }

  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const aspect = Math.max(0.3, Number(threeCamera.aspect) || 1);
  const fov = THREE.MathUtils.degToRad(Number(threeCamera.fov) || 28);

  const fitHeightDistance = (size.y * 0.5) / Math.tan(fov / 2);
  const fitWidthDistance = (size.x * 0.5) / (Math.tan(fov / 2) * aspect);
  const distance = Math.max(fitHeightDistance, fitWidthDistance) * 1.45 + size.z * 0.8;

  const lookY = center.y + size.y * 0.43;
  threeCamera.position.set(center.x, lookY - size.y * 0.12, center.z + distance);
  threeCamera.near = Math.max(0.01, distance / 120);
  threeCamera.far = Math.max(80, distance * 30);
  threeCamera.lookAt(center.x, lookY, center.z);
  threeCamera.updateProjectionMatrix();
}

function getVrmBoneNode(vrm, boneName) {
  if (!vrm || !vrm.humanoid) {
    return null;
  }
  const lower = String(boneName || "").trim();
  const upper = lower ? `${lower.slice(0, 1).toUpperCase()}${lower.slice(1)}` : lower;
  const names = [lower, upper];
  const enumObj = vrmModule && vrmModule.VRMHumanBoneName ? vrmModule.VRMHumanBoneName : null;
  if (enumObj) {
    names.push(enumObj[lower], enumObj[upper]);
  }
  try {
    if (typeof vrm.humanoid.getNormalizedBoneNode === "function") {
      for (const name of names) {
        if (!name) {
          continue;
        }
        const node = vrm.humanoid.getNormalizedBoneNode(name);
        if (node) {
          return node;
        }
      }
    }
  } catch {
    // no-op
  }
  try {
    if (typeof vrm.humanoid.getRawBoneNode === "function") {
      for (const name of names) {
        if (!name) {
          continue;
        }
        const node = vrm.humanoid.getRawBoneNode(name);
        if (node) {
          return node;
        }
      }
    }
  } catch {
    // no-op
  }
  return null;
}

function findBoneByName(root, patterns) {
  if (!root || typeof root.traverse !== "function") {
    return null;
  }
  const keys = (Array.isArray(patterns) ? patterns : []).map((p) => String(p).toLowerCase());
  let found = null;
  root.traverse((node) => {
    if (found || !node || !node.isBone || !node.name) {
      return;
    }
    const name = String(node.name).toLowerCase();
    if (keys.some((key) => name.includes(key))) {
      found = node;
    }
  });
  return found;
}

function getAvatarBone(vrm, root, humanName, fallbackPatterns = []) {
  return getVrmBoneNode(vrm, humanName) || findBoneByName(root, fallbackPatterns);
}

function getRootBone(root) {
  if (!root || typeof root.traverse !== "function") {
    return null;
  }
  let found = null;
  root.traverse((node) => {
    if (found || !node || !node.isBone) {
      return;
    }
    const parent = node.parent;
    if (!parent || !parent.isBone) {
      found = node;
    }
  });
  return found;
}

function getBoneWorldPosition(root, patterns) {
  const bone = findBoneByName(root, patterns);
  if (!bone || !threeModule) {
    return null;
  }
  const THREE = threeModule;
  const pos = new THREE.Vector3();
  bone.getWorldPosition(pos);
  return pos;
}

function alignModelToUpright(root) {
  if (!root || !threeModule) {
    return;
  }
  const THREE = threeModule;
  root.updateMatrixWorld(true);

  const hipPos = getBoneWorldPosition(root, ["hip", "hips", "pelvis", "j_bip_c_hips"]);
  const headPos = getBoneWorldPosition(root, ["head", "j_bip_c_head"]);
  if (hipPos && headPos) {
    const dir = headPos.clone().sub(hipPos).normalize();
    const up = new THREE.Vector3(0, 1, 0);
    if (Number.isFinite(dir.length()) && dir.length() > 0.2) {
      const q = new THREE.Quaternion().setFromUnitVectors(dir, up);
      root.quaternion.premultiply(q);
      root.updateMatrixWorld(true);
    }
  }

  const box = new THREE.Box3().setFromObject(root);
  if (box.isEmpty()) {
    return;
  }
  const size = box.getSize(new THREE.Vector3());
  // If still lying down after bone-based alignment, try axis correction fallback.
  if (size.y < Math.max(size.x, size.z) * 0.75) {
    root.rotation.x -= Math.PI / 2;
    root.updateMatrixWorld(true);
  }
}

function applyFbxArmDownPose(root) {
  if (!root) {
    return;
  }
  const leftUpperArm = findBoneByName(root, ["leftupperarm", "upperarm_l", "arm_l", "l_arm", "left arm"]);
  const rightUpperArm = findBoneByName(root, ["rightupperarm", "upperarm_r", "arm_r", "r_arm", "right arm"]);
  const leftLowerArm = findBoneByName(root, ["leftlowerarm", "lowerarm_l", "forearm_l", "left forearm"]);
  const rightLowerArm = findBoneByName(root, ["rightlowerarm", "lowerarm_r", "forearm_r", "right forearm"]);

  if (leftUpperArm) {
    leftUpperArm.rotation.z += 0.9;
    leftUpperArm.rotation.x -= 0.22;
  }
  if (rightUpperArm) {
    rightUpperArm.rotation.z -= 0.9;
    rightUpperArm.rotation.x -= 0.22;
  }
  if (leftLowerArm) {
    leftLowerArm.rotation.z += 0.12;
  }
  if (rightLowerArm) {
    rightLowerArm.rotation.z -= 0.12;
  }
}

function applyVrmRelaxPose(vrm, root = null) {
  const leftUpperArm = getAvatarBone(vrm, root, "leftUpperArm", ["leftupperarm", "upperarm_l", "arm_l", "l_arm"]);
  const rightUpperArm = getAvatarBone(vrm, root, "rightUpperArm", ["rightupperarm", "upperarm_r", "arm_r", "r_arm"]);
  const leftLowerArm = getAvatarBone(vrm, root, "leftLowerArm", ["leftlowerarm", "lowerarm_l", "forearm_l"]);
  const rightLowerArm = getAvatarBone(vrm, root, "rightLowerArm", ["rightlowerarm", "lowerarm_r", "forearm_r"]);
  const spine = getAvatarBone(vrm, root, "spine", ["spine"]);
  const chest = getAvatarBone(vrm, root, "chest", ["chest"]);
  const neck = getAvatarBone(vrm, root, "neck", ["neck"]);

  if (leftUpperArm) {
    leftUpperArm.rotation.z = 1.24;
    leftUpperArm.rotation.x = -0.08;
    leftUpperArm.rotation.y = 0.02;
    ensureBoneBaseRotation(leftUpperArm);
  }
  if (rightUpperArm) {
    rightUpperArm.rotation.z = -1.24;
    rightUpperArm.rotation.x = -0.08;
    rightUpperArm.rotation.y = -0.02;
    ensureBoneBaseRotation(rightUpperArm);
  }
  if (leftLowerArm) {
    leftLowerArm.rotation.z = 0.04;
    leftLowerArm.rotation.x = -0.03;
    ensureBoneBaseRotation(leftLowerArm);
  }
  if (rightLowerArm) {
    rightLowerArm.rotation.z = -0.04;
    rightLowerArm.rotation.x = -0.03;
    ensureBoneBaseRotation(rightLowerArm);
  }
  if (spine) {
    spine.rotation.x = 0.04;
    ensureBoneBaseRotation(spine);
  }
  if (chest) {
    chest.rotation.x = 0.03;
    ensureBoneBaseRotation(chest);
  }
  if (neck) {
    neck.rotation.x = -0.02;
    ensureBoneBaseRotation(neck);
  }
}

function updateVrmIdleAndTracking(vrm, dt) {
  if (!vrm) {
    return;
  }

  const root = threeAvatarRoot;
  const head = getAvatarBone(vrm, root, "head", ["head"]);
  const neck = getAvatarBone(vrm, root, "neck", ["neck"]);
  const spine = getAvatarBone(vrm, root, "spine", ["spine"]);
  const chest = getAvatarBone(vrm, root, "chest", ["chest"]);
  const leftEye = getAvatarBone(vrm, root, "leftEye", ["lefteye", "eye_l"]);
  const rightEye = getAvatarBone(vrm, root, "rightEye", ["righteye", "eye_r"]);
  const leftUpperArm = getAvatarBone(vrm, root, "leftUpperArm", ["leftupperarm", "upperarm_l", "arm_l"]);
  const rightUpperArm = getAvatarBone(vrm, root, "rightUpperArm", ["rightupperarm", "upperarm_r", "arm_r"]);

  const mx = Math.max(-1, Math.min(1, avatarAimX || 0));
  const my = Math.max(-1, Math.min(1, avatarAimY || 0));
  const t = threeIdleTime;
  const breath = Math.sin(t * 1.7) * 0.03;
  const sway = Math.sin(t * 0.9) * 0.035;

  applyBoneTarget(spine, 0.02 + breath * 0.3, mx * 0.05, sway * 0.3, 0.1);
  applyBoneTarget(chest, 0.02 + breath * 0.45, mx * 0.07, sway * 0.42, 0.12);
  applyBoneTarget(neck, -my * 0.11, mx * 0.22, sway * 0.2, 0.16);
  applyBoneTarget(head, -my * 0.16, mx * 0.27, sway * 0.18, 0.2);
  applyBoneTarget(leftEye, -my * 0.08, mx * 0.14, 0, 0.22);
  applyBoneTarget(rightEye, -my * 0.08, mx * 0.14, 0, 0.22);
  applyBoneTarget(leftUpperArm, 0, 0, 0, 0.1);
  applyBoneTarget(rightUpperArm, 0, 0, 0, 0.1);

  if (vrm.expressionManager && typeof vrm.expressionManager.setValue === "function") {
    vrmBlinkElapsed += dt;
    if (vrmBlinkElapsed >= vrmBlinkInterval) {
      const phase = (vrmBlinkElapsed - vrmBlinkInterval) / 0.18;
      const blink = phase <= 1 ? Math.sin(Math.min(1, phase) * Math.PI) : 0;
      try {
        vrm.expressionManager.setValue("blink", blink);
      } catch {
        // no-op
      }
      if (phase > 1.05) {
        vrmBlinkElapsed = 0;
        vrmBlinkInterval = 2.2 + Math.random() * 2.6;
      }
    } else {
      try {
        vrm.expressionManager.setValue("blink", 0);
      } catch {
        // no-op
      }
    }
  }
}

async function load3dAvatarModel(modelConfig) {
  if (!modelConfig) {
    return;
  }
  await ensureThreeLoaded();
  ensureThreeRuntime();
  const THREE = threeModule;
  if (!threeRenderer || !threeScene) {
    throw new Error("three_runtime_unavailable");
  }

  if (threeAvatarRoot) {
    threeScene.remove(threeAvatarRoot);
    threeAvatarRoot = null;
  }
  threeAnimMixers = [];

  const modelPath = String(modelConfig.modelPath || "");
  const modelUrl = encodeURI(modelPath);
  if (!modelPath) {
    throw new Error("avatar_model_path_required");
  }

  if (modelConfig.type === "vrm") {
    const THREE = threeModule;
    const loader = new gltfLoaderModule.GLTFLoader();
    if (vrmModule && vrmModule.VRMLoaderPlugin) {
      loader.register((parser) => new vrmModule.VRMLoaderPlugin(parser));
    }
    const gltf = await new Promise((resolve, reject) => {
      loader.load(modelUrl, resolve, undefined, reject);
    });
    const vrm = gltf.userData && gltf.userData.vrm ? gltf.userData.vrm : null;
    if (vrm && vrmModule && vrmModule.VRMUtils) {
      try {
        vrmModule.VRMUtils.removeUnnecessaryVertices(gltf.scene);
        vrmModule.VRMUtils.removeUnnecessaryJoints(gltf.scene);
      } catch {
        // no-op
      }
    }
    if (vrm && vrmModule && typeof vrmModule.VRMUtils.rotateVRM0 === "function") {
      try {
        vrmModule.VRMUtils.rotateVRM0(vrm);
      } catch {
        // no-op
      }
    }
    const root = vrm ? vrm.scene : (gltf.scene || gltf.scenes && gltf.scenes[0]);
    if (!root) {
      throw new Error("vrm_scene_missing");
    }
    threeVrmInstance = vrm;
    vrmBlinkElapsed = 0;
    vrmBlinkInterval = 2.1 + Math.random() * 2.4;
    threeAvatarRoot = root;
    threeScene.add(root);
    if (threeAvatarRoot) {
      threeAvatarRoot.rotation.y = Math.PI;
    }
    if (threeVrmInstance) {
      applyVrmRelaxPose(threeVrmInstance, threeAvatarRoot);
    }
    if (Array.isArray(gltf.animations) && gltf.animations.length > 0) {
      const mixer = new THREE.AnimationMixer(root);
      gltf.animations.forEach((clip) => mixer.clipAction(clip).play());
      threeAnimMixers.push(mixer);
    }
  } else if (modelConfig.type === "fbx") {
    threeVrmInstance = null;
    const loader = new fbxLoaderModule.FBXLoader();
    const root = await new Promise((resolve, reject) => {
      loader.load(modelUrl, resolve, undefined, reject);
    });
    alignModelToUpright(root);
    applyFbxArmDownPose(root);
    threeAvatarRoot = root;
    threeScene.add(root);
  } else {
    throw new Error("unsupported_3d_model_type");
  }

  const box = new THREE.Box3().setFromObject(threeAvatarRoot);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const maxDim = Math.max(size.x || 1, size.y || 1, size.z || 1);
  const scale = maxDim > 0 ? 1.5 / maxDim : 1;
  threeAvatarRoot.scale.setScalar(scale);
  threeAvatarRoot.position.set(-center.x * scale, -box.min.y * scale, -center.z * scale);
  threeAvatarRoot.userData.baseY = threeAvatarRoot.position.y;
  threeAvatarRoot.userData.baseRotY = threeAvatarRoot.rotation.y;
  frameThreeAvatarToView();
}

function handleLive2dStagePointerMove(event) {
  if (!live2dStage) {
    return;
  }
  const rect = live2dStage.getBoundingClientRect();
  if (!rect.width || !rect.height) {
    return;
  }
  const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
  live2dMouseX = Math.max(-1, Math.min(1, x));
  live2dMouseY = Math.max(-1, Math.min(1, y));
  manualLookExpireAt = performance.now() + 2400;

  if (live2dViewDragActive && event.pointerId === live2dViewDragPointerId) {
    const modelKey = String(live2dCurrentModelKey || "").trim();
    if (modelKey) {
      const dx = event.clientX - live2dViewDragStartX;
      const dy = event.clientY - live2dViewDragStartY;
      setLive2dViewTransformByKey(modelKey, {
        x: live2dViewDragBaseX + dx,
        y: live2dViewDragBaseY + dy,
        zoom: getLive2dViewTransformByKey(modelKey).zoom,
      });
      fitLive2dModelToStage();
    }
    return;
  }

  if (cheekDragActive && event.pointerId === cheekDragPointerId) {
    const dx = event.clientX - cheekDragStartX;
    const dy = event.clientY - cheekDragStartY;
    applyCheekStretch(dx, dy);
  }
}

function handleLive2dStagePointerLeave() {
  live2dMouseX = 0;
  live2dMouseY = 0;
  manualLookExpireAt = performance.now() + 300;
}

function handleLive2dStagePointerDown(event) {
  if (!live2dStage) {
    return;
  }
  if (event.button === 2) {
    const modelKey = String(live2dCurrentModelKey || "").trim();
    if (!modelKey) {
      return;
    }
    const current = getLive2dViewTransformByKey(modelKey);
    live2dViewDragActive = true;
    live2dViewDragPointerId = event.pointerId;
    live2dViewDragStartX = event.clientX;
    live2dViewDragStartY = event.clientY;
    live2dViewDragBaseX = Number(current.x || 0);
    live2dViewDragBaseY = Number(current.y || 0);
    try {
      live2dStage.setPointerCapture(event.pointerId);
    } catch {
      // no-op
    }
    event.preventDefault();
    return;
  }
  if (event.button !== 0) {
    return;
  }
  pointerDownAvatarPart = detectAvatarPartByPointer(event);
  cheekDragActive = true;
  cheekDragPointerId = event.pointerId;
  cheekDragStartX = event.clientX;
  cheekDragStartY = event.clientY;
  if (live2dStageShell) {
    live2dStageShell.classList.add("is-cheek-dragging");
  }
  try {
    live2dStage.setPointerCapture(event.pointerId);
  } catch {
    // no-op
  }
}

async function handleLive2dStagePointerUp(event) {
  if (live2dViewDragActive && event.pointerId === live2dViewDragPointerId) {
    live2dViewDragActive = false;
    live2dViewDragPointerId = -1;
    return;
  }
  const moved = Math.abs(event.clientX - cheekDragStartX) + Math.abs(event.clientY - cheekDragStartY);
  if (event.pointerId === cheekDragPointerId) {
    cheekDragActive = false;
    cheekDragPointerId = -1;
    resetCheekStretch();
  }
  if (moved < 12) {
    await onAvatarTap(pointerDownAvatarPart);
  } else {
    affectionScore = clampAffection(affectionScore - 1);
    updateAffectionUi();
  }
}

function handleLive2dStagePointerCancel() {
  live2dViewDragActive = false;
  live2dViewDragPointerId = -1;
  cheekDragActive = false;
  cheekDragPointerId = -1;
  resetCheekStretch();
}

function handleLive2dStageContextMenu(event) {
  event.preventDefault();
}

function handleLive2dStageWheel(event) {
  if (activeAvatarType !== "live2d") {
    return;
  }
  const modelKey = String(live2dCurrentModelKey || "").trim();
  if (!modelKey) {
    return;
  }
  event.preventDefault();
  const current = getLive2dViewTransformByKey(modelKey);
  const zoomFactor = event.deltaY < 0 ? 1.07 : 1 / 1.07;
  const nextZoom = clampLive2dExtraZoom(Number(current.zoom || 1) * zoomFactor);
  setLive2dViewTransformByKey(modelKey, {
    x: Number(current.x || 0),
    y: Number(current.y || 0),
    zoom: nextZoom,
  });
  fitLive2dModelToStage();
}

function handleLive2dStageResize() {
  fitLive2dModelToStage();
  fitThreeModelToStage();
}

async function initLive2d() {
  if (!live2dStage) {
    return;
  }

  setLive2dStatus("모델 로딩 중...");
  try {
    await loadLive2dCatalog();
    if (live2dCatalog.length === 0) {
      setLive2dStatus("사용 가능한 모델(.model3.json/.vrm/.fbx)을 찾지 못했습니다.", true);
      return;
    }

    if (!live2dStageEventsBound && LIVE2D_STAGE_UI && typeof LIVE2D_STAGE_UI.bindLive2dStageEvents === "function") {
      LIVE2D_STAGE_UI.bindLive2dStageEvents({
        stage: live2dStage,
        onPointerMove: handleLive2dStagePointerMove,
        onPointerLeave: handleLive2dStagePointerLeave,
        onPointerDown: handleLive2dStagePointerDown,
        onPointerUp: handleLive2dStagePointerUp,
        onPointerCancel: handleLive2dStagePointerCancel,
        onContextMenu: handleLive2dStageContextMenu,
        onWheel: handleLive2dStageWheel,
        onResize: handleLive2dStageResize,
      });
      live2dStageEventsBound = true;
    }
    const savedModelKey = loadSetting(LS_KEYS.live2dModelKey);
    if (savedModelKey && live2dCatalog.some((item) => item.key === savedModelKey)) {
      live2dCurrentModelKey = savedModelKey;
    }
    await loadFirstAvailableLive2dModel(live2dCurrentModelKey || live2dCatalog[0].key);
    if (autoActingEnabled) {
      scheduleMumbleLoop();
    }
    setLive2dStatus("모델 준비 완료.");
  } catch (error) {
    console.error(error);
    const detail = error && error.message ? ` (${error.message})` : "";
    setLive2dStatus(`Live2D 로딩 실패. 모델 파일/네트워크를 확인해 주세요.${detail}`, true);
  }
}

if (LIVE2D_UI && typeof LIVE2D_UI.bindLive2dControlEvents === "function") {
  LIVE2D_UI.bindLive2dControlEvents({
    live2dModelSelect,
    onModelChange: async () => {
      const selectedKey = String(live2dModelSelect && live2dModelSelect.value || "").trim();
      if (!selectedKey || selectedKey === live2dCurrentModelKey) {
        return;
      }
      try {
        await loadSelectedLive2dModel(selectedKey);
      } catch (error) {
        console.error(error);
        if (live2dModelSelect && live2dCurrentModelKey) {
          live2dModelSelect.value = live2dCurrentModelKey;
        }
        const detail = error && error.message ? ` (${error.message})` : "";
        setLive2dStatus(`모델 변경 실패. 해당 모델은 현재 런타임과 호환되지 않을 수 있습니다.${detail}`, true);
      }
    },
    live2dExpressionSelect,
    onExpressionChange: async () => {
      if (activeAvatarType !== "live2d") {
        return;
      }
      const selected = live2dExpressionOptions.find((opt) => opt.value === live2dExpressionSelect.value);
      const file = selected ? selected.file : "";
      try {
        await loadLive2dExpression(file);
        setLive2dStatus("표정을 적용했어요.");
      } catch (error) {
        console.error(error);
        setLive2dStatus("표정 적용 실패. 파일 경로를 확인해 주세요.", true);
      }
    },
    live2dMotionSelect,
    onMotionChange: async () => {
      if (activeAvatarType !== "live2d") {
        return;
      }
      const selected = live2dMotionOptions.find((opt) => opt.value === live2dMotionSelect.value);
      if (!selected || !selected.value) {
        return;
      }
      try {
        const ok = await playLive2dMotionByValue(selected.value);
        if (ok) {
          setLive2dStatus("동작을 실행했어요.");
        } else {
          setLive2dStatus("이 모델은 동작 재생을 지원하지 않아요.", true);
        }
      } catch (error) {
        console.error(error);
        setLive2dStatus("동작 실행에 실패했어요. 모션 파일을 확인해 주세요.", true);
      }
    },
    playLive2dMotionBtn,
    onPlayMotion: async () => {
      if (activeAvatarType !== "live2d") {
        return;
      }
      const selectedValue = live2dMotionSelect ? String(live2dMotionSelect.value || "").trim() : "";
      if (!selectedValue) {
        setLive2dStatus("먼저 실행할 동작을 골라 주세요.", true);
        return;
      }
      try {
        const ok = await playLive2dMotionByValue(selectedValue);
        if (ok) {
          setLive2dStatus("동작을 실행했어요.");
        } else {
          setLive2dStatus("이 모델은 동작 재생을 지원하지 않아요.", true);
        }
      } catch (error) {
        console.error(error);
        setLive2dStatus("동작 실행에 실패했어요. 모션 파일을 확인해 주세요.", true);
      }
    },
    autoActingBtn,
    onAutoActingToggle: () => {
      setAutoActingEnabled(!autoActingEnabled);
    },
    uploadLive2dBtn,
    live2dUploadInput,
    onUploadFolder: async (files) => {
      await handleLive2dFolderUpload(files);
    },
    uploadLive2dZipBtn,
    live2dZipUploadInput,
    onUploadZip: async (file) => {
      await handleLive2dZipUpload(file);
    },
  });
}

async function ensureKuromojiLoaded() {
  if (window.kuromoji) {
    return;
  }

  let lastError = null;
  for (const src of KUROMOJI_SCRIPTS) {
    try {
      await loadScript(src);
      if (window.kuromoji) {
        return;
      }
    } catch (error) {
      lastError = error;
      console.error(error);
    }
  }

  throw lastError || new Error("kuromoji 로드 실패");
}

function buildTokenizer(dicPath) {
  return new Promise((resolve, reject) => {
    window.kuromoji.builder({ dicPath }).build((err, builtTokenizer) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(builtTokenizer);
    });
  });
}

async function initTokenizer() {
  setStatus("사전을 불러오는 중입니다...");
  convertBtn.disabled = true;

  try {
    await ensureKuromojiLoaded();
  } catch (error) {
    console.error(error);
    setStatus("kuromoji 스크립트 로딩에 실패했습니다. 인터넷/차단 설정을 확인해 주세요.", true);
    return;
  }

  let lastError = null;
  for (const dicPath of DICT_PATHS) {
    try {
      tokenizer = await buildTokenizer(dicPath);
      convertBtn.disabled = false;
      setStatus("준비 완료. 일본어 문장을 입력하고 후리가나 생성 버튼을 누르세요.");
      return;
    } catch (error) {
      lastError = error;
      console.error(`사전 로딩 실패(${dicPath})`, error);
    }
  }

  const detail = lastError && lastError.message ? ` (${lastError.message})` : "";
  setStatus(`사전 로딩에 실패했습니다. 네트워크/광고차단 확장프로그램을 확인해 주세요.${detail}`, true);
}

async function loadVoicevoxSpeakers() {
  speakerSelect.innerHTML = "<option value=''>캐릭터 불러오는 중...</option>";
  speakerSelect.disabled = true;
  playAllBtn.disabled = true;
  speakerStyleMeta.clear();

  try {
    const res = await fetchWithRuntimeTimeout("/api/voicevox/speakers", {}, REQUEST_TIMEOUT_MS);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const speakers = await res.json();
    const normalized = (VOICE_SERVICE && typeof VOICE_SERVICE.buildSpeakerOptions === "function")
      ? VOICE_SERVICE.buildSpeakerOptions(speakers, VOICE_CORE)
      : { options: [], meta: new Map() };
    const options = Array.isArray(normalized.options) ? normalized.options : [];
    normalized.meta.forEach((value, key) => {
      speakerStyleMeta.set(key, value);
    });

    if (options.length === 0) {
      throw new Error("사용 가능한 캐릭터가 없습니다.");
    }

    speakerSelect.innerHTML = options
      .map((opt) => `<option value="${opt.id}">${escapeHtml(opt.label)}</option>`)
      .join("");
    const savedSpeaker = loadSetting(LS_KEYS.speakerId);
    if (savedSpeaker && options.some((opt) => String(opt.id) === String(savedSpeaker))) {
      speakerSelect.value = String(savedSpeaker);
    }
    speakerSelect.disabled = false;
    setVoiceStatus("VOICEVOX 연결 완료. 캐릭터를 선택해서 재생할 수 있습니다.");
    updateSpeakerPreview();
    playAllBtn.disabled = sentences.length === 0;
    downloadAllBtn.disabled = sentences.length === 0;
    clearAudioCache();
    prefetchAudioForCurrentSentences();
  } catch (error) {
    console.error(error);
    speakerSelect.innerHTML = "<option value=''>연결 실패</option>";
    speakerSelect.disabled = true;
    setSpeakerPreview({});
    setVoiceStatus("로컬 VOICEVOX 엔진 연결 실패. VOICEVOX 앱이 켜져 있는지 확인해 주세요.", true);
  }
}

function isVoiceReady() {
  return !speakerSelect.disabled && Boolean(speakerSelect.value);
}

async function fetchWithRuntimeTimeout(input, init = {}, timeoutMs = REQUEST_TIMEOUT_MS) {
  if (RUNTIME && typeof RUNTIME.fetchWithTimeout === "function") {
    return RUNTIME.fetchWithTimeout(input, init, timeoutMs);
  }
  return fetch(input, init);
}

function errorDetail(error) {
  if (RUNTIME && typeof RUNTIME.parseErrorDetail === "function") {
    return RUNTIME.parseErrorDetail(error);
  }
  return String(error && (error.message || error) || "unknown_error");
}

async function createVoiceAudioBlob(text, speakerId) {
  if (VOICE_SERVICE && typeof VOICE_SERVICE.requestVoiceBlob === "function" && RUNTIME) {
    return VOICE_SERVICE.requestVoiceBlob({
      text,
      speakerRef: speakerId,
      tone: getToneConfig(),
      provider: TTS_PROVIDER,
      voiceModel: TTS_VOICE_MODEL,
      requestTimeoutMs: REQUEST_TIMEOUT_MS,
      runtime: RUNTIME,
      voiceCore: VOICE_CORE,
    });
  }
  throw new Error(errorDetail("voice_service_unavailable"));
}

async function createVoiceAudioBlobWithRetry(text, speakerId) {
  if (VOICE_SERVICE && typeof VOICE_SERVICE.requestVoiceBlobWithRetry === "function" && RUNTIME) {
    return VOICE_SERVICE.requestVoiceBlobWithRetry({
      text,
      speakerRef: speakerId,
      tone: getToneConfig(),
      provider: TTS_PROVIDER,
      voiceModel: TTS_VOICE_MODEL,
      requestTimeoutMs: REQUEST_TIMEOUT_MS,
      runtime: RUNTIME,
      voiceCore: VOICE_CORE,
      sleep,
      maxTries: 3,
    });
  }
  return createVoiceAudioBlob(text, speakerId);
}

async function prepareTextsWithRetries(texts, speakerId, token) {
  const maxRounds = 3;
  const success = new Set();
  let pending = [...texts];

  for (let round = 1; round <= maxRounds && pending.length > 0; round += 1) {
    if (token !== prefetchToken) {
      return { cancelled: true, successCount: success.size, failedCount: pending.length };
    }

    const failedThisRound = [];
    let cursor = 0;
    const concurrency = PREFETCH_CONCURRENCY;

    async function worker() {
      while (cursor < pending.length) {
        if (token !== prefetchToken) {
          return;
        }

        const idx = cursor;
        cursor += 1;
        const text = pending[idx];

        try {
          await getCachedAudioBlob(text, speakerId);
          success.add(text);
          preparedCount = success.size;
          updatePrepareStatus();
        } catch {
          failedThisRound.push(text);
        }
      }
    }

    const workers = Array.from({ length: Math.min(concurrency, pending.length) }, () => worker());
    await Promise.all(workers);

    if (token !== prefetchToken) {
      return { cancelled: true, successCount: success.size, failedCount: failedThisRound.length };
    }

    pending = [...new Set(failedThisRound)];
    if (pending.length > 0 && round < maxRounds) {
      setVoiceStatus(`음성 준비 재시도 중... (${round + 1}/${maxRounds})`);
      await sleep(500);
    }
  }

  return { cancelled: false, successCount: success.size, failedCount: pending.length };
}

async function getCachedAudioBlob(text, speakerId) {
  const key = cacheKey(text, speakerId);
  const cached = audioCache.get(key);

  if (cached && cached.blob) {
    touchAudioCacheEntry(key, cached);
    return cached.blob;
  }

  if (cached && cached.promise) {
    return cached.promise;
  }

  const promise = createVoiceAudioBlobWithRetry(text, speakerId)
    .then((blob) => {
      const existing = audioCache.get(key);
      if (existing && existing.blob) {
        audioCacheTotalBytes = Math.max(0, audioCacheTotalBytes - Number(existing.size || 0));
      }
      const next = { blob, size: Number(blob && blob.size || 0) };
      touchAudioCacheEntry(key, next);
      audioCacheTotalBytes += next.size;
      enforceAudioCacheLimits();
      return blob;
    })
    .catch((error) => {
      audioCache.delete(key);
      throw error;
    });

  audioCache.set(key, { promise });
  return promise;
}

function updatePrepareStatus() {
  if (preparedTotal <= 0) {
    return;
  }
  const pct = Math.floor((preparedCount / preparedTotal) * 100);
  setPrepareProgress(pct, `음성 준비 ${pct}% (${preparedCount}/${preparedTotal})`);
  setVoiceStatus(`음성 준비중입니다... ${pct}% (${preparedCount}/${preparedTotal})`);
}

async function prefetchAudioForCurrentSentences() {
  if (!isVoiceReady() || sentences.length === 0) {
    return;
  }

  const token = ++prefetchToken;
  const speakerId = speakerSelect.value;
  const texts = [...new Set(sentences.map((s) => s.plain.trim()).filter(Boolean))];
  preparedCount = 0;
  preparedTotal = texts.length;
  isAudioPreparing = true;
  isAudioPrepared = false;
  refreshPlaybackUi();
  updatePrepareStatus();

  const result = await prepareTextsWithRetries(texts, speakerId, token);

  if (token === prefetchToken) {
    isAudioPreparing = false;
    isAudioPrepared = !result.cancelled && result.successCount > 0;
    refreshPlaybackUi();

    if (result.cancelled) {
      return;
    }

    if (result.failedCount === 0) {
      setPrepareProgress(100, `음성 준비 완료 (${preparedTotal}/${preparedTotal})`);
      setVoiceStatus("음성 준비 완료. 이제 재생할 수 있습니다.");
    } else if (result.successCount > 0) {
      const pct = Math.floor((result.successCount / preparedTotal) * 100);
      setPrepareProgress(pct, `부분 준비 완료 ${pct}% (${result.successCount}/${preparedTotal})`);
      setVoiceStatus(
        `일부 문장은 아직 준비 중입니다. 재생 중 자동으로 이어서 준비합니다. (${result.successCount}/${preparedTotal})`
      );
    } else {
      setPrepareProgress(0, "음성 준비 실패 - 재생 시 자동 재시도");
      setVoiceStatus("음성 서버가 혼잡합니다. 재생하면 필요한 문장부터 자동으로 불러옵니다.", true);
    }
  }
}

async function playBlob(blob, tokenId) {
  if (tokenId !== playToken) {
    return;
  }

  stopActiveAudio();
  activeAudioUrl = URL.createObjectURL(blob);
  activeAudio = new Audio(activeAudioUrl);
  activeAudio.playbackRate = playbackRate;
  startLive2dLipSync(activeAudio);

  await new Promise((resolve, reject) => {
    activeAudio.onended = () => {
      stopActiveAudio();
      resolve();
    };
    activeAudio.onerror = () => {
      stopActiveAudio();
      reject(new Error("오디오 재생 실패"));
    };
    activeAudio.play().catch(reject);
  });
}

async function playText(text, tokenId) {
  const restoreContextActing = await applyContextActingForText(text);
  const speakerId = speakerSelect.value;
  try {
    const blob = await getCachedAudioBlob(text, speakerId);
    await playBlob(blob, tokenId);
  } finally {
    await restoreContextActing();
  }
}

async function applyLive2dExpressionByValue(value) {
  if (activeAvatarType !== "live2d") {
    return;
  }
  const target = String(value || "").trim().toLowerCase();
  const selected = live2dExpressionOptions.find((opt) => {
    const v = String(opt && opt.value || "").toLowerCase();
    const label = String(opt && opt.label || "").toLowerCase();
    const file = String(opt && opt.file || "").toLowerCase();
    return v === target || label.includes(target) || file.includes(target);
  });
  const file = selected ? selected.file : "";
  await loadLive2dExpression(file);
  if (live2dExpressionSelect) {
    live2dExpressionSelect.value = value;
  }
}

function findLive2dMotionOption(value) {
  const target = String(value || "").trim().toLowerCase();
  if (!target) {
    return null;
  }
  return live2dMotionOptions.find((opt) => {
    const v = String(opt && opt.value || "").toLowerCase();
    const label = String(opt && opt.label || "").toLowerCase();
    const file = String(opt && opt.file || "").toLowerCase();
    return v === target || label.includes(target) || file.includes(target);
  }) || null;
}

async function playLive2dMotionByValue(value) {
  if (activeAvatarType !== "live2d" || !live2dModel) {
    return false;
  }
  const raw = String(value || "").trim();
  if (raw.startsWith("proc:")) {
    const kind = raw.slice("proc:".length);
    triggerLive2dProceduralMotion(kind, 1100, 1);
    if (live2dMotionSelect) {
      live2dMotionSelect.value = raw;
    }
    return true;
  }
  const selected = findLive2dMotionOption(value);
  if (!selected || !selected.group || selected.index < 0) {
    return false;
  }

  if (typeof live2dModel.motion === "function") {
    await Promise.resolve(live2dModel.motion(selected.group, selected.index));
    if (live2dMotionSelect) {
      live2dMotionSelect.value = selected.value;
    }
    return true;
  }

  const internal = live2dModel.internalModel || live2dModel._internalModel || null;
  const manager = internal && (internal.motionManager || internal._motionManager) || null;
  if (manager && typeof manager.startMotion === "function") {
    await Promise.resolve(manager.startMotion(selected.group, selected.index, 3));
    if (live2dMotionSelect) {
      live2dMotionSelect.value = selected.value;
    }
    return true;
  }
  if (selected.file) {
    // Native motion API is unavailable for this runtime/model.
    // Fallback to a visible procedural motion so the user still sees action.
    triggerLive2dProceduralMotion("sway", 1000, 1);
    return true;
  }
  return false;
}

function detectSentenceMood(text) {
  const source = String(text || "");
  const lower = source.toLowerCase();
  if (!lower) {
    return "neutral";
  }
  if (/[!！]+/.test(source) || /(やった|最高|嬉しい|うれしい|楽しい|すごい|좋아|대박|멋지)/.test(source)) {
    return "happy";
  }
  if (/[?？]+/.test(source) || /(かな|だろう|でしょう|왜|뭐지|어떻게|맞아\?)/.test(source)) {
    return "question";
  }
  if (/(怖|不安|嫌|だめ|失敗|무섭|불안|싫|망했)/.test(source)) {
    return "frightened";
  }
  if (/(怒|許さ|最悪|짜증|화나|열받)/.test(source)) {
    return "angry";
  }
  if (/(ゆっくり|静か|穏やか|차분|천천히)/.test(source)) {
    return "calm";
  }
  return "neutral";
}

function pickExpressionForMood(mood) {
  const aliasesByMood = {
    happy: ["doya", "ooface", "happy", "smile"],
    question: ["hair", "sweat", "ooface"],
    frightened: ["frightened", "sweat", "fear"],
    angry: ["angry"],
    calm: [""],
    neutral: [""],
  };
  const aliases = aliasesByMood[mood] || aliasesByMood.neutral;
  for (const alias of aliases) {
    if (!alias) {
      return "";
    }
    const found = live2dExpressionOptions.find((opt) => {
      const value = String(opt && opt.value || "").toLowerCase();
      const label = String(opt && opt.label || "").toLowerCase();
      const file = String(opt && opt.file || "").toLowerCase();
      return value.includes(alias) || label.includes(alias) || file.includes(alias);
    });
    if (found) {
      return String(found.value || "");
    }
  }
  return "";
}

function pickMotionForMood(mood) {
  const aliasesByMood = {
    happy: ["proc:dance", "dance", "doya", "happy", "idle1", "scene1"],
    question: ["haoqi", "think", "idle"],
    frightened: ["fright", "sweat", "cry"],
    angry: ["angry"],
    calm: ["idle"],
    neutral: ["idle"],
  };
  const aliases = aliasesByMood[mood] || aliasesByMood.neutral;
  for (const alias of aliases) {
    const found = live2dMotionOptions.find((opt) => {
      const value = String(opt && opt.value || "").toLowerCase();
      const label = String(opt && opt.label || "").toLowerCase();
      const file = String(opt && opt.file || "").toLowerCase();
      return value.includes(alias) || label.includes(alias) || file.includes(alias);
    });
    if (found) {
      return String(found.value || "");
    }
  }
  if (mood === "happy") {
    return "proc:dance";
  }
  if (mood === "question" || mood === "frightened" || mood === "angry") {
    return "proc:shake";
  }
  if (mood === "calm") {
    return "proc:tilt";
  }
  return "proc:nod";
}

async function applyContextActingForText(text) {
  if (activeAvatarType !== "live2d") {
    return async () => {};
  }
  const prevAuto = autoActingEnabled;
  if (prevAuto) {
    autoExpressionSeq += 1;
    clearAutoExpressionTimers();
  }
  const mood = detectSentenceMood(text);
  const current = live2dExpressionSelect ? String(live2dExpressionSelect.value || "") : "";
  const next = pickExpressionForMood(mood);
  const nextMotion = pickMotionForMood(mood);

  if (mood === "happy") {
    triggerLive2dReaction("nod", 1000);
  } else if (mood === "question" || mood === "frightened" || mood === "angry") {
    triggerLive2dReaction("shake", 780);
  }

  if (next !== current) {
    try {
      await applyLive2dExpressionByValue(next);
    } catch {
      // no-op
    }
  }
  if (nextMotion) {
    try {
      await playLive2dMotionByValue(nextMotion);
    } catch {
      // no-op
    }
  }

  return async () => {
    if (activeAvatarType !== "live2d") {
      return;
    }
    if (current !== next) {
      try {
        await applyLive2dExpressionByValue(current);
      } catch {
        // no-op
      }
    }
    if (prevAuto && autoActingEnabled) {
      // auto expression cycling disabled
    }
  };
}

async function speakFeedbackLine(text) {
  if (!isVoiceReady()) {
    return;
  }
  const tokenId = ++playToken;
  clearPlayingState();
  const blob = await getCachedAudioBlob(text, speakerSelect.value);
  await playBlob(blob, tokenId);
}

async function playQuizFeedback({ line, expression, motion, isError = false }) {
  const currentExpression = live2dExpressionSelect ? live2dExpressionSelect.value : "";
  try {
    await applyLive2dExpressionByValue(expression);
    triggerLive2dReaction(motion);
  } catch (error) {
    console.error(error);
  }

  showLive2dSpeech(line, isError);
  try {
    await speakFeedbackLine(line);
    setVoiceStatus("퀴즈 피드백 재생 완료.", isError);
  } catch (error) {
    console.error(error);
    setVoiceStatus("퀴즈 피드백 재생 실패. 캐릭터 연결을 확인해 주세요.", true);
  } finally {
    hideLive2dSpeech(1300);
    try {
      await applyLive2dExpressionByValue(currentExpression);
    } catch {
      // no-op
    }
  }
}

async function finishQuizWithFeedback() {
  quizState.completed = true;
  renderSentences();

  if (quizState.wrong === 0) {
    await playQuizFeedback({
      line: QUIZ_LINES.finalPerfect,
      expression: "ooface",
      motion: "nod",
    });
    setStatus("퀴즈 완료: 전부 정답!");
    return;
  }

  if (quizState.wrong < QUIZ_STRICT_WRONG_THRESHOLD) {
    await playQuizFeedback({
      line: QUIZ_LINES.finalGood,
      expression: "doya",
      motion: "nod",
    });
    setStatus(`퀴즈 완료: 오답 ${quizState.wrong}개.`);
    return;
  }

  await playQuizFeedback({
    line: QUIZ_LINES.finalStrict,
    expression: "frightened",
    motion: "shake",
    isError: true,
  });
  setStatus(`퀴즈 완료: 오답 ${quizState.wrong}개. 다음 라운드에서 만회해보자.`, true);
}

async function startSentenceQuiz(difficultyKey = "normal") {
  if (sentences.length === 0) {
    setStatus("먼저 후리가나를 생성해 주세요.", true);
    return;
  }

  await enableMeaningMode();
  const profile = QUIZ_DIFFICULTY[difficultyKey] || QUIZ_DIFFICULTY.normal;
  quizState.difficulty = difficultyKey in QUIZ_DIFFICULTY ? difficultyKey : "normal";
  setStatus("퀴즈 단어 뜻을 준비하는 중...");
  const items = await buildQuizItemsFromSentences(quizState.difficulty);
  if (items.length === 0) {
    setStatus("뜻 퀴즈를 만들 단어/의미가 부족합니다. 다른 문장을 입력해 주세요.", true);
    return;
  }

  quizState.active = true;
  quizState.completed = false;
  quizState.index = 0;
  quizState.correct = 0;
  quizState.wrong = 0;
  quizState.items = items;
  quizState.completed = false;
  if (quizDifficultyMenu) {
    quizDifficultyMenu.hidden = true;
  }
  renderSentences();
  scrollOutputToQuiz();
  setStatus(`단어 뜻 퀴즈 시작! 난이도 ${profile.label}, 총 ${items.length}문제`);
}

let isQuizAnswerPending = false;

async function handleQuizAnswer(selected) {
  if (!quizState.active || quizState.completed || isQuizAnswerPending) {
    return;
  }
  const current = quizState.items[quizState.index];
  if (!current) {
    return;
  }

  isQuizAnswerPending = true;
  const selectedNormalized = normalizeForCompare(selected);
  const answerNormalized = normalizeForCompare(current.answer);
  const isCorrect = selectedNormalized === answerNormalized;
  if (isCorrect) {
    quizState.correct += 1;
    setStatus("정답!");
    await playQuizFeedback({
      line: QUIZ_LINES.perCorrect,
      expression: "doya",
      motion: "nod",
    });
  } else {
    quizState.wrong += 1;
    setStatus(`오답. 정답: ${current.answer}`, true);
    setVoiceStatus(`오답. 정답은 "${current.answer}"`, true);
    await playQuizFeedback({
      line: QUIZ_LINES.perWrong,
      expression: "frightened",
      motion: "shake",
      isError: true,
    });
  }

  quizState.index += 1;
  if (quizState.index >= quizState.items.length) {
    isQuizAnswerPending = false;
    await finishQuizWithFeedback();
    return;
  }

  renderSentences();
  isQuizAnswerPending = false;
}

async function playSingleSentence(index) {
  if (!isVoiceReady()) {
    setVoiceStatus("먼저 캐릭터를 선택해 주세요.", true);
    return;
  }

  const sentence = sentences[index];
  if (!sentence) {
    return;
  }

  if (isPlaying && playingMode === "sentence" && activeSentenceIndex === index) {
    stopPlayback("문장 재생 정지");
    return;
  }

  playToken += 1;
  const tokenId = playToken;
  setPlayingState("sentence", index);
  setVoiceStatus("문장 재생 중...");

  try {
    await playText(sentence.plain, tokenId);
    if (tokenId === playToken) {
      clearPlayingState();
      setVoiceStatus("문장 재생 완료.");
    }
  } catch (error) {
    console.error(error);
    if (tokenId === playToken) {
      clearPlayingState();
      setVoiceStatus("문장 재생에 실패했습니다. 잠시 후 다시 시도해 주세요.", true);
    }
  }
}

async function playAllSentences() {
  if (!isVoiceReady()) {
    setVoiceStatus("먼저 캐릭터를 선택해 주세요.", true);
    return;
  }

  if (sentences.length === 0) {
    setVoiceStatus("먼저 후리가나를 생성해 주세요.", true);
    return;
  }

  if (isPlaying && playingMode === "all") {
    stopPlayback("전체 재생 정지");
    return;
  }

  playToken += 1;
  const tokenId = playToken;
  setPlayingState("all", -1);
  setVoiceStatus("전체 문장 재생 중...");

  try {
    const mode = playModeSelect.value;

    if (mode === "continuous") {
      const fullText = sentences.map((sentence) => sentence.plain.trim()).filter(Boolean).join(" ");
      await playText(fullText, tokenId);
    } else {
      const parts = sentences.map((sentence) => sentence.plain.trim()).filter(Boolean);
      let failedCount = 0;
      for (let i = 0; i < parts.length; i += 1) {
        if (tokenId !== playToken) {
          return;
        }

        activeSentenceIndex = i;
        refreshPlaybackUi();
        setVoiceStatus(`전체 문장 재생 중... (${i + 1}/${parts.length})`);

        try {
          await playText(parts[i], tokenId);
        } catch (error) {
          failedCount += 1;
          console.error(error);
        }
      }

      if (tokenId === playToken && failedCount > 0) {
        clearPlayingState();
        setVoiceStatus(
          `전체 재생 완료 (일부 문장 ${failedCount}개는 음성 준비가 늦어 건너뜀).`,
          true
        );
        return;
      }
    }

    if (tokenId === playToken) {
      clearPlayingState();
      setVoiceStatus("전체 재생 완료.");
    }
  } catch (error) {
    console.error(error);
    if (tokenId === playToken) {
      clearPlayingState();
      setVoiceStatus("전체 재생에 실패했습니다. 잠시 후 다시 시도해 주세요.", true);
    }
  }
}

convertBtn.addEventListener("click", () => {
  const text = inputText.value;
  if (!text.trim()) {
    sentences = [];
    resetQuizState();
    renderSentences();
    wordbookMap.clear();
    renderWordbook();
    clearAudioCache();
    stopPlayback("입력된 문장이 없습니다.");
    setStatus("입력된 문장이 없습니다.", true);
    return;
  }

  if (!tokenizer) {
    setStatus("아직 사전이 준비되지 않았습니다. 잠시 후 다시 시도해 주세요.", true);
    return;
  }

  const tokens = tokenizer.tokenize(text);
  sentences = splitSentences(tokens);
  resetQuizState();
  wordbookMap.clear();
  clearAudioCache();
  renderSentences();
  refreshWordbookFromCurrentOutput();
  prefetchAudioForCurrentSentences();
  setStatus("후리가나 생성이 완료되었습니다.");
});

clearBtn.addEventListener("click", () => {
  inputText.value = "";
  sentences = [];
  resetQuizState();
  renderSentences();
  wordbookMap.clear();
  renderWordbook();
  clearAudioCache();
  stopPlayback("입력이 지워졌습니다.");
  setStatus(tokenizer ? "입력이 지워졌습니다." : "사전을 불러오는 중입니다...");
});

output.addEventListener("click", (event) => {
  const quizBtn = event.target.closest(".quiz-option");
  if (quizBtn) {
    const selected = String(quizBtn.dataset.quizOption || "").trim();
    if (selected) {
      handleQuizAnswer(selected);
    }
    return;
  }

  const button = event.target.closest(".sentence-play");
  if (!button) {
    return;
  }

  const index = Number(button.dataset.sentenceIndex);
  if (Number.isNaN(index)) {
    return;
  }

  playSingleSentence(index);
});

output.addEventListener("click", async (event) => {
  const button = event.target.closest(".sentence-download");
  if (!button) {
    return;
  }

  if (!isVoiceReady()) {
    setVoiceStatus("먼저 캐릭터를 선택해 주세요.", true);
    return;
  }

  const index = Number(button.dataset.downloadSentenceIndex);
  if (Number.isNaN(index) || !sentences[index]) {
    return;
  }

  try {
    const speakerId = speakerSelect.value;
    const text = sentences[index].plain.trim();
    setVoiceStatus("문장 음성 다운로드 준비 중...");
    const blob = await getCachedAudioBlob(text, speakerId);
    const filename = `voice_sentence_${index + 1}_${sanitizeFilePart(text)}.wav`;
    triggerBlobDownload(blob, filename);
    setVoiceStatus("문장 음성 다운로드 완료.");
  } catch (error) {
    console.error(error);
    setVoiceStatus("문장 음성 다운로드에 실패했습니다.", true);
  }
});

if (startQuizBtn) {
  startQuizBtn.addEventListener("click", () => {
    if (!quizDifficultyMenu) {
      return;
    }
    if (!meaningMode && !isMeaningPreparing) {
      enableMeaningMode().catch((error) => console.error(error));
    }
    quizDifficultyMenu.hidden = !quizDifficultyMenu.hidden;
  });
}

if (quizDifficultyMenu) {
  quizDifficultyMenu.addEventListener("click", async (event) => {
    const button = event.target.closest(".quiz-difficulty-btn");
    if (!button) {
      return;
    }
    const difficulty = String(button.dataset.quizDifficulty || "normal");
    stopPlayback("퀴즈 시작");
    quizDifficultyMenu.hidden = true;
    try {
      await startSentenceQuiz(difficulty);
    } catch (error) {
      console.error(error);
      setStatus("퀴즈 준비 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.", true);
    }
  });

  document.addEventListener("click", (event) => {
    if (quizDifficultyMenu.hidden) {
      return;
    }
    const target = event.target;
    if ((startQuizBtn && startQuizBtn.contains(target)) || quizDifficultyMenu.contains(target)) {
      return;
    }
    quizDifficultyMenu.hidden = true;
  });
}

toggleWordbookBtn.addEventListener("click", () => {
  setWordbookVisible(wordbookPanel.hidden);
  if (!wordbookPanel.hidden) {
    refreshWordbookFromCurrentOutput();
  }
});

if (VOICE_UI && typeof VOICE_UI.bindVoicePanelEvents === "function") {
  VOICE_UI.bindVoicePanelEvents({
    playAllBtn,
    onPlayAll: () => {
      playAllSentences();
    },
    downloadAllBtn,
    onDownloadAll: async () => {
      if (!isVoiceReady()) {
        setVoiceStatus("먼저 캐릭터를 선택해 주세요.", true);
        return;
      }
      if (sentences.length === 0) {
        setVoiceStatus("먼저 후리가나를 생성해 주세요.", true);
        return;
      }
      try {
        const speakerId = speakerSelect.value;
        const fullText = sentences.map((sentence) => sentence.plain.trim()).filter(Boolean).join(" ");
        setVoiceStatus("전체 음성 다운로드 준비 중...");
        const blob = await getCachedAudioBlob(fullText, speakerId);
        triggerBlobDownload(blob, "voice_all.wav");
        setVoiceStatus("전체 음성 다운로드 완료.");
      } catch (error) {
        console.error(error);
        setVoiceStatus("전체 음성 다운로드에 실패했습니다.", true);
      }
    },
    reloadVoicesBtn,
    onReloadVoices: () => {
      stopPlayback("캐릭터 목록 갱신");
      clearAudioCache();
      loadVoicevoxSpeakers();
    },
    speakerSelect,
    onSpeakerChange: () => {
      stopPlayback("캐릭터 변경");
      saveSetting(LS_KEYS.speakerId, speakerSelect.value);
      updateSpeakerPreview();
      clearAudioCache();
      playAllBtn.disabled = sentences.length === 0 || !isVoiceReady();
      downloadAllBtn.disabled = sentences.length === 0 || !isVoiceReady();
      prefetchAudioForCurrentSentences();
    },
    toggleMeaningBtn,
    onToggleMeaning: async () => {
      if (meaningMode || isMeaningPreparing) {
        disableMeaningMode();
        return;
      }
      await enableMeaningMode();
    },
    scrollResultTopBtn,
    onScrollTop: () => {
      scrollOutputToTop();
    },
    scrollResultBottomBtn,
    onScrollBottom: () => {
      scrollOutputToQuiz();
    },
  });
}

output.addEventListener("mouseover", async (event) => {
  if (!meaningMode) {
    return;
  }

  const tokenEl = event.target.closest(".dict-token");
  if (!tokenEl || !output.contains(tokenEl)) {
    return;
  }

  if (currentMeaningTarget && currentMeaningTarget !== tokenEl) {
    currentMeaningTarget.classList.remove("active");
  }
  currentMeaningTarget = tokenEl;
  tokenEl.classList.add("active");

  const word = tokenEl.dataset.word || "";
  const reading = tokenEl.dataset.reading || "";
  const seq = ++meaningHoverSeq;
  showMeaningTooltip("뜻 불러오는 중...", event.clientX, event.clientY);

  try {
    const result = await fetchMeaning(word);
    if (seq !== meaningHoverSeq || !meaningMode || currentMeaningTarget !== tokenEl) {
      return;
    }

    if (!result) {
      const title = reading ? `${escapeHtml(word)} (${escapeHtml(reading)})` : escapeHtml(word);
      showMeaningTooltip(`<strong>${title}</strong><br />뜻을 찾지 못했어.`, event.clientX, event.clientY);
      return;
    }

    const titleWord = result.word || word;
    const titleReading = result.reading || reading;
    const title = titleReading ? `${escapeHtml(titleWord)} (${escapeHtml(titleReading)})` : escapeHtml(titleWord);
    const defs = Array.isArray(result.meanings) ? result.meanings : [];
    const jlpt = Array.isArray(result.jlpt) && result.jlpt.length > 0 ? ` [${escapeHtml(result.jlpt.join(", "))}]` : "";
    const defsHtml = defs.length > 0 ? defs.map((d) => `- ${escapeHtml(d)}`).join("<br />") : "뜻 정보 없음";
    showMeaningTooltip(`<strong>${title}${jlpt}</strong><br />${defsHtml}`, event.clientX, event.clientY);
  } catch {
    if (seq !== meaningHoverSeq || !meaningMode || currentMeaningTarget !== tokenEl) {
      return;
    }
    showMeaningTooltip("뜻 조회 실패. 잠시 후 다시 시도해봐.", event.clientX, event.clientY);
  }
});

output.addEventListener("mousemove", (event) => {
  if (!meaningMode || !currentMeaningTarget || !meaningTooltip.classList.contains("show")) {
    return;
  }
  const html = meaningTooltip.innerHTML;
  showMeaningTooltip(html, event.clientX, event.clientY);
});

output.addEventListener("mouseout", (event) => {
  if (!meaningMode) {
    return;
  }
  const tokenEl = event.target.closest(".dict-token");
  if (!tokenEl) {
    return;
  }
  if (event.relatedTarget && tokenEl.contains(event.relatedTarget)) {
    return;
  }
  tokenEl.classList.remove("active");
  if (currentMeaningTarget === tokenEl) {
    currentMeaningTarget = null;
  }
  hideMeaningTooltip();
});

playModeSelect.addEventListener("change", () => {
  saveSetting(LS_KEYS.playMode, playModeSelect.value);
  stopPlayback("재생 모드 변경");
});

speedRange.addEventListener("input", () => {
  playbackRate = Number(speedRange.value);
  saveSetting(LS_KEYS.playbackRate, playbackRate);
  speedValue.textContent = `${playbackRate.toFixed(2)}x`;
  if (activeAudio) {
    activeAudio.playbackRate = playbackRate;
  }
});

if (tonePresetSelect) {
  tonePresetSelect.addEventListener("change", () => {
    const nextPreset = normalizeTonePreset(tonePresetSelect.value);
    applyTonePreset(nextPreset);
    clearAudioCache();
    prefetchAudioForCurrentSentences();
  });
}

if (tonePitchRange) {
  tonePitchRange.addEventListener("input", () => {
    setTonePitch(tonePitchRange.value);
    clearAudioCache();
    prefetchAudioForCurrentSentences();
  });
}

if (toneIntonationRange) {
  toneIntonationRange.addEventListener("input", () => {
    setToneIntonation(toneIntonationRange.value);
    clearAudioCache();
    prefetchAudioForCurrentSentences();
  });
}

fontDecreaseBtn.addEventListener("click", () => {
  setOutputFontScale(outputFontScale - OUTPUT_FONT_STEP);
});

fontIncreaseBtn.addEventListener("click", () => {
  setOutputFontScale(outputFontScale + OUTPUT_FONT_STEP);
});

fontResetBtn.addEventListener("click", () => {
  setOutputFontScale(1);
});

if (gridResizer && appGrid) {
  let resizing = false;
  let pendingClientX = 0;
  let rafId = 0;

  const stopResize = () => {
    if (!resizing) {
      return;
    }
    resizing = false;
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
    appGrid.classList.remove("is-resizing");
    document.body.style.cursor = "";
    saveSetting(LS_KEYS.gridSplitPercent, gridSplitPercent);
  };

  const applyPendingResize = () => {
    rafId = 0;
    if (!resizing || window.matchMedia("(max-width: 980px)").matches) {
      return;
    }
    const rect = appGrid.getBoundingClientRect();
    const next = ((pendingClientX - rect.left) / rect.width) * 100;
    setGridSplit(next, false);
  };

  const onPointerMove = (event) => {
    if (!resizing || window.matchMedia("(max-width: 980px)").matches) {
      return;
    }
    pendingClientX = event.clientX;
    if (!rafId) {
      rafId = requestAnimationFrame(applyPendingResize);
    }
  };

  gridResizer.addEventListener("pointerdown", (event) => {
    if (window.matchMedia("(max-width: 980px)").matches) {
      return;
    }
    event.preventDefault();
    resizing = true;
    appGrid.classList.add("is-resizing");
    document.body.style.cursor = "ew-resize";
    gridResizer.setPointerCapture(event.pointerId);
    pendingClientX = event.clientX;
    applyPendingResize();
  });

  gridResizer.addEventListener("pointermove", onPointerMove);
  gridResizer.addEventListener("pointerup", stopResize);
  gridResizer.addEventListener("pointercancel", stopResize);
  gridResizer.addEventListener("dblclick", () => setGridSplit(44));
  window.addEventListener("resize", () => {
    if (!window.matchMedia("(max-width: 980px)").matches) {
      applyGridSplit();
    }
  });
}

window.addEventListener("pointerdown", () => {
  flushPendingAmbientRetry().catch(() => {});
}, { passive: true });
window.addEventListener("touchstart", () => {
  flushPendingAmbientRetry().catch(() => {});
}, { passive: true });
window.addEventListener("keydown", () => {
  flushPendingAmbientRetry().catch(() => {});
}, { passive: true });

function resolveActiveProfileTone() {
  const tone = activeCharacterProfile && activeCharacterProfile.defaultTone
    && typeof activeCharacterProfile.defaultTone === "object"
    ? activeCharacterProfile.defaultTone
    : null;
  return tone;
}

function applyResolvedProfileTone() {
  const tone = resolveActiveProfileTone();
  if (!tone) {
    applyTonePreset("normal", false);
    return;
  }
  toneState.preset = "normal";
  toneState.pitchScale = clampTonePitch(tone.pitchScale);
  toneState.intonationScale = clampToneIntonation(tone.intonationScale);
  updateToneUi();
}

function storeActiveCharacterProfileKey(key) {
  try {
    if (!key) {
      if (RUNTIME && typeof RUNTIME.safeRemoveLocalStorage === "function") {
        RUNTIME.safeRemoveLocalStorage(LS_KEYS.characterProfileActiveKey);
        return;
      }
      localStorage.removeItem(LS_KEYS.characterProfileActiveKey);
      return;
    }
    if (RUNTIME && typeof RUNTIME.safeSetLocalStorage === "function") {
      RUNTIME.safeSetLocalStorage(LS_KEYS.characterProfileActiveKey, key);
      return;
    }
    localStorage.setItem(LS_KEYS.characterProfileActiveKey, key);
  } catch {
    // no-op
  }
}

function setActiveCharacterProfileByKey(key, sourceLabel = "") {
  const requestedKey = String(key || "").trim();
  const selected = findCharacterProfileByKey(requestedKey);
  const nextKey = selected ? selected.key : "";
  activeCharacterProfileKey = nextKey;
  applyCharacterProfiles({
    profile: selected ? selected.profile : null,
    sourceLabel,
  });
  if (characterProfileSelect) {
    characterProfileSelect.value = activeCharacterProfileKey;
  }
  storeActiveCharacterProfileKey(activeCharacterProfileKey);
}

async function handleCharacterProfileUpload(file) {
  const target = file || null;
  if (!target) {
    return;
  }
  try {
    const raw = await target.text();
    const parsed = parseCharacterProfileJson(raw);
    if (!parsed) {
      setStatus("설정집 JSON 형식이 올바르지 않습니다.", true);
      return;
    }
    const checked = validateCompleteCharacterProfile(parsed);
    if (!checked.ok || !checked.normalized) {
      setStatus(checked.message || "설정집 형식이 올바르지 않습니다.", true);
      return;
    }

    const profile = checked.normalized;
    const existingIndex = userCharacterProfiles.findIndex(
      (item) => item.profile && item.profile.id === profile.id
    );
    let key = "";
    if (existingIndex >= 0) {
      key = userCharacterProfiles[existingIndex].key;
      userCharacterProfiles[existingIndex] = {
        key,
        name: profile.displayName,
        profile,
      };
    } else {
      key = makeUniqueUserProfileKey(profile.id || profile.displayName || target.name || "profile");
      userCharacterProfiles.push({
        key,
        name: profile.displayName,
        profile,
      });
    }
    storeCharacterProfileLibrary(userCharacterProfiles);
    updateCharacterProfileSelect();
    setActiveCharacterProfileByKey(key, "사용자 선택");
    applyResolvedProfileTone();
    clearAudioCache();
    prefetchAudioForCurrentSentences();
    const who = String((activeCharacterProfile && activeCharacterProfile.displayName) || "").trim();
    setStatus(`설정집 적용 완료${who ? `: ${who}` : ""}`);
  } catch (error) {
    console.error(error);
    setStatus("설정집 업로드 중 오류가 발생했습니다.", true);
  } finally {
    if (characterProfileInput) {
      characterProfileInput.value = "";
    }
  }
}

function openCharacterProfileGuide() {
  if (characterProfileGuideModal) {
    characterProfileGuideModal.hidden = false;
  }
}

function closeCharacterProfileGuide() {
  if (characterProfileGuideModal) {
    characterProfileGuideModal.hidden = true;
  }
}

function openNovelQuickLinks() {
  if (novelQuickLinksModal) {
    novelQuickLinksModal.hidden = false;
  }
}

function closeNovelQuickLinks() {
  if (novelQuickLinksModal) {
    novelQuickLinksModal.hidden = true;
  }
}

if (characterProfileUploadBtn && characterProfileInput) {
  characterProfileUploadBtn.addEventListener("click", () => {
    characterProfileInput.click();
  });
  characterProfileInput.addEventListener("change", async () => {
    const file = characterProfileInput.files && characterProfileInput.files[0];
    await handleCharacterProfileUpload(file);
  });
}

if (characterProfileSelect) {
  characterProfileSelect.addEventListener("change", () => {
    const selectedKey = String(characterProfileSelect.value || "").trim();
    setActiveCharacterProfileByKey(selectedKey, selectedKey ? "선택됨" : "기본");
    applyResolvedProfileTone();
    clearAudioCache();
    prefetchAudioForCurrentSentences();
    if (!selectedKey) {
      setStatus("설정집이 해제되어 기본(설정 없음) 상태로 돌아왔습니다.");
      return;
    }
    const who = String((activeCharacterProfile && activeCharacterProfile.displayName) || "").trim();
    setStatus(`설정집 변경 완료${who ? `: ${who}` : ""}`);
  });
}

if (characterProfileClearBtn) {
  characterProfileClearBtn.addEventListener("click", () => {
    setActiveCharacterProfileByKey("", "기본");
    applyResolvedProfileTone();
    clearAudioCache();
    prefetchAudioForCurrentSentences();
    setStatus("설정집이 해제되어 기본(설정 없음) 상태로 돌아왔습니다.");
  });
}

if (characterProfileGuideBtn) {
  characterProfileGuideBtn.addEventListener("click", () => {
    openCharacterProfileGuide();
  });
}

if (characterProfileGuideCloseBtn) {
  characterProfileGuideCloseBtn.addEventListener("click", () => {
    closeCharacterProfileGuide();
  });
}

if (characterProfileGuideModal) {
  characterProfileGuideModal.addEventListener("click", (event) => {
    const target = event.target;
    if (target && target.dataset && target.dataset.guideClose === "true") {
      closeCharacterProfileGuide();
    }
  });
}

if (novelQuickLinksBtn) {
  novelQuickLinksBtn.addEventListener("click", () => {
    openNovelQuickLinks();
  });
}

if (novelQuickLinksCloseBtn) {
  novelQuickLinksCloseBtn.addEventListener("click", () => {
    closeNovelQuickLinks();
  });
}

if (novelQuickLinksModal) {
  novelQuickLinksModal.addEventListener("click", (event) => {
    const target = event.target;
    if (target && target.dataset && target.dataset.novelLinksClose === "true") {
      closeNovelQuickLinks();
    }
  });
}

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && characterProfileGuideModal && !characterProfileGuideModal.hidden) {
    closeCharacterProfileGuide();
  }
  if (event.key === "Escape" && novelQuickLinksModal && !novelQuickLinksModal.hidden) {
    closeNovelQuickLinks();
  }
});

async function bootstrapApp() {
  for (const item of BUILTIN_CHARACTER_PROFILES) {
    const raw = await loadCharacterProfile(item.path);
    const checked = validateCompleteCharacterProfile(raw);
    if (!checked.ok || !checked.normalized) {
      console.warn(`builtin profile invalid: ${item.path}`);
      continue;
    }
    builtInCharacterProfileMap.set(item.key, {
      name: checked.normalized.displayName || item.name,
      profile: checked.normalized,
    });
  }
  userCharacterProfiles = readStoredCharacterProfileLibrary();
  if (userCharacterProfiles.length === 0) {
    userCharacterProfiles = migrateLegacyCharacterProfile();
  }
  updateCharacterProfileSelect();
  const savedActiveProfileKey = String(loadSetting(LS_KEYS.characterProfileActiveKey) || "").trim();
  setActiveCharacterProfileByKey(savedActiveProfileKey, savedActiveProfileKey ? "선택됨" : "기본");

  const savedAutoActing = loadSetting(LS_KEYS.autoActing);
  if (savedAutoActing === "0") {
    setAutoActingEnabled(false, false);
  } else {
    setAutoActingEnabled(true, false);
  }

  applyTonePreset("normal", false);
  const savedTonePreset = normalizeTonePreset(loadSetting(LS_KEYS.tonePreset));
  if (savedTonePreset !== "normal" && !activeCharacterProfile) {
    applyTonePreset(savedTonePreset, false);
  } else {
    const profileTone = resolveActiveProfileTone();
    if (profileTone) {
      toneState.pitchScale = clampTonePitch(profileTone.pitchScale);
      toneState.intonationScale = clampToneIntonation(profileTone.intonationScale);
    } else {
      const savedTonePitch = Number(loadSetting(LS_KEYS.tonePitch));
      const savedToneIntonation = Number(loadSetting(LS_KEYS.toneIntonation));
      if (Number.isFinite(savedTonePitch)) {
        toneState.pitchScale = clampTonePitch(savedTonePitch);
      }
      if (Number.isFinite(savedToneIntonation)) {
        toneState.intonationScale = clampToneIntonation(savedToneIntonation);
      }
    }
    updateToneUi();
  }

  const savedMode = loadSetting(LS_KEYS.playMode);
  if (savedMode && ["sentence", "continuous"].includes(savedMode)) {
    playModeSelect.value = savedMode;
  }

  const savedRate = Number(loadSetting(LS_KEYS.playbackRate));
  if (Number.isFinite(savedRate) && savedRate >= 0.7 && savedRate <= 1.3) {
    playbackRate = savedRate;
    speedRange.value = String(savedRate);
  }
  speedValue.textContent = `${playbackRate.toFixed(2)}x`;

  const savedFontScale = Number(loadSetting(LS_KEYS.outputFontScale));
  if (Number.isFinite(savedFontScale) && savedFontScale >= OUTPUT_FONT_MIN && savedFontScale <= OUTPUT_FONT_MAX) {
    outputFontScale = savedFontScale;
  }
  applyOutputFontScale();

  const savedGridSplit = Number(loadSetting(LS_KEYS.gridSplitPercent));
  if (Number.isFinite(savedGridSplit) && savedGridSplit >= GRID_SPLIT_MIN && savedGridSplit <= GRID_SPLIT_MAX) {
    gridSplitPercent = savedGridSplit;
  }
  applyGridSplit();

  initTokenizer();
  loadVoicevoxSpeakers();
  initLive2d();
  renderSentences();
  renderWordbook();
  setWordbookButtonVisible(false);
  if (activeCharacterProfile && activeCharacterProfile.identityLine) {
    setStatus(String(activeCharacterProfile.identityLine).trim() || "캐릭터 설정 적용 완료.");
  }
}

bootstrapApp().catch((error) => {
  console.error(error);
  setStatus("캐릭터 설정 초기화 중 오류가 발생했습니다. 기본 모드로 실행합니다.", true);
  initTokenizer();
  loadVoicevoxSpeakers();
  initLive2d();
  renderSentences();
  renderWordbook();
  setWordbookButtonVisible(false);
});
