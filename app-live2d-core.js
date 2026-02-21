(function (globalScope) {
  "use strict";

  function clampZoom(value, min, max) {
    const n = Number(value);
    if (!Number.isFinite(n)) {
      return 1;
    }
    return Math.min(Number(max), Math.max(Number(min), n));
  }

  function normalizeViewTransform(input, zoomMin, zoomMax) {
    const source = input && typeof input === "object" ? input : {};
    const x = Number(source.x || 0);
    const y = Number(source.y || 0);
    return {
      x: Number.isFinite(x) ? x : 0,
      y: Number.isFinite(y) ? y : 0,
      zoom: clampZoom(source.zoom, zoomMin, zoomMax),
    };
  }

  const api = {
    clampZoom,
    normalizeViewTransform,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  globalScope.AppLive2dCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
