(function (globalScope) {
  "use strict";

  function bindLive2dStageEvents(ctx = {}) {
    const {
      stage,
      onPointerMove,
      onPointerLeave,
      onPointerDown,
      onPointerUp,
      onPointerCancel,
      onContextMenu,
      onWheel,
      onResize,
    } = ctx;

    if (!stage || typeof stage.addEventListener !== "function") {
      return false;
    }

    if (typeof onPointerMove === "function") {
      stage.addEventListener("pointermove", onPointerMove);
    }
    if (typeof onPointerLeave === "function") {
      stage.addEventListener("pointerleave", onPointerLeave);
    }
    if (typeof onPointerDown === "function") {
      stage.addEventListener("pointerdown", onPointerDown);
    }
    if (typeof onPointerUp === "function") {
      stage.addEventListener("pointerup", onPointerUp);
    }
    if (typeof onPointerCancel === "function") {
      stage.addEventListener("pointercancel", onPointerCancel);
    }
    if (typeof onContextMenu === "function") {
      stage.addEventListener("contextmenu", onContextMenu);
    }
    if (typeof onWheel === "function") {
      stage.addEventListener("wheel", onWheel, { passive: false });
    }
    if (typeof onResize === "function" && typeof window !== "undefined" && window.addEventListener) {
      window.addEventListener("resize", onResize);
    }
    return true;
  }

  const api = {
    bindLive2dStageEvents,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  globalScope.AppLive2dStageUi = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
