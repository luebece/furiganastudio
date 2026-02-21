(function (globalScope) {
  "use strict";

  const DEFAULT_CONFIG = {
    ttsProvider: "voicevox",
    ttsVoiceModel: "",
    requestTimeoutMs: 20000,
  };

  function asObject(value) {
    return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  }

  function parseErrorDetail(error) {
    if (!error) {
      return "unknown_error";
    }
    return String(error.message || error);
  }

  async function parseJsonSafe(response) {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }

  async function fetchWithTimeout(input, init = {}, timeoutMs = 0) {
    const timeout = Math.max(0, Number(timeoutMs) || 0);
    if (!timeout) {
      return fetch(input, init);
    }
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try {
      return await fetch(input, {
        ...init,
        signal: controller.signal,
      });
    } catch (error) {
      if (error && error.name === "AbortError") {
        throw new Error("request_timeout");
      }
      throw error;
    } finally {
      clearTimeout(timer);
    }
  }

  function safeGetLocalStorage(key) {
    try {
      return localStorage.getItem(String(key || ""));
    } catch {
      return null;
    }
  }

  function safeSetLocalStorage(key, value) {
    try {
      localStorage.setItem(String(key || ""), String(value || ""));
      return true;
    } catch {
      return false;
    }
  }

  function safeRemoveLocalStorage(key) {
    try {
      localStorage.removeItem(String(key || ""));
      return true;
    } catch {
      return false;
    }
  }

  const mergedConfig = {
    ...DEFAULT_CONFIG,
    ...asObject(globalScope.APP_RUNTIME_CONFIG),
  };

  globalScope.AppRuntime = {
    config: mergedConfig,
    fetchWithTimeout,
    parseErrorDetail,
    parseJsonSafe,
    safeGetLocalStorage,
    safeRemoveLocalStorage,
    safeSetLocalStorage,
  };
})(typeof globalThis !== "undefined" ? globalThis : this);
