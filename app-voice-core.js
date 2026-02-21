(function (globalScope) {
  "use strict";

  function makeSpeakerRef(engineBase, styleId) {
    return `${String(engineBase || "")}@@${String(styleId || "")}`;
  }

  function parseSpeakerRef(speakerRef) {
    const raw = String(speakerRef || "");
    const splitAt = raw.lastIndexOf("@@");
    if (splitAt < 0) {
      return { engineBase: "", speakerId: Number(raw) };
    }
    const engineBase = raw.slice(0, splitAt);
    const speakerId = Number(raw.slice(splitAt + 2));
    return { engineBase, speakerId };
  }

  function shouldRetryTts(error, attempt, maxTries) {
    const canRetryCount = Number(attempt) < Number(maxTries);
    if (!canRetryCount) {
      return false;
    }
    const status = Number(error && error.status);
    return status === 429 || status === 502;
  }

  function getRetryDelayMs(error, attempt) {
    const retryAfter = Number(error && error.retryAfter);
    if (Number.isFinite(retryAfter) && retryAfter > 0) {
      return Math.max(100, retryAfter * 1000);
    }
    return 1000 * Math.max(1, Number(attempt) || 1);
  }

  const api = {
    getRetryDelayMs,
    makeSpeakerRef,
    parseSpeakerRef,
    shouldRetryTts,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  globalScope.AppVoiceCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
