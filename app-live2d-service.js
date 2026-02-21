(function (globalScope) {
  "use strict";

  function parseStoredViewTransforms(raw, normalizeViewTransform, zoomMin, zoomMax) {
    if (!raw) {
      return new Map();
    }
    let parsed = null;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return new Map();
    }
    if (!parsed || typeof parsed !== "object") {
      return new Map();
    }
    const result = new Map();
    Object.entries(parsed).forEach(([key, item]) => {
      const modelKey = String(key || "").trim();
      if (!modelKey || !item || typeof item !== "object") {
        return;
      }
      if (typeof normalizeViewTransform === "function") {
        result.set(modelKey, normalizeViewTransform(item, zoomMin, zoomMax));
        return;
      }
      const x = Number(item.x || 0);
      const y = Number(item.y || 0);
      const zoomRaw = Number(item.zoom);
      result.set(modelKey, {
        x: Number.isFinite(x) ? x : 0,
        y: Number.isFinite(y) ? y : 0,
        zoom: Number.isFinite(zoomRaw) ? zoomRaw : 1,
      });
    });
    return result;
  }

  function serializeViewTransforms(map, normalizeViewTransform, zoomMin, zoomMax) {
    const payload = {};
    map.forEach((value, key) => {
      if (!key) {
        return;
      }
      if (typeof normalizeViewTransform === "function") {
        payload[key] = normalizeViewTransform(value, zoomMin, zoomMax);
        return;
      }
      payload[key] = {
        x: Number(value && value.x || 0),
        y: Number(value && value.y || 0),
        zoom: Number(value && value.zoom || 1),
      };
    });
    return payload;
  }

  const api = {
    parseStoredViewTransforms,
    serializeViewTransforms,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  globalScope.AppLive2dService = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
