(function (globalScope) {
  "use strict";

  function bindLive2dControlEvents(ctx = {}) {
    const {
      live2dModelSelect,
      onModelChange,
      live2dExpressionSelect,
      onExpressionChange,
      live2dMotionSelect,
      onMotionChange,
      playLive2dMotionBtn,
      onPlayMotion,
      autoActingBtn,
      onAutoActingToggle,
      uploadLive2dBtn,
      live2dUploadInput,
      onUploadFolder,
      uploadLive2dZipBtn,
      live2dZipUploadInput,
      onUploadZip,
    } = ctx;

    if (live2dModelSelect && typeof onModelChange === "function") {
      live2dModelSelect.addEventListener("change", async () => {
        await onModelChange();
      });
    }

    if (live2dExpressionSelect && typeof onExpressionChange === "function") {
      live2dExpressionSelect.addEventListener("change", async () => {
        await onExpressionChange();
      });
    }

    if (live2dMotionSelect && typeof onMotionChange === "function") {
      live2dMotionSelect.addEventListener("change", async () => {
        await onMotionChange();
      });
    }

    if (playLive2dMotionBtn && typeof onPlayMotion === "function") {
      playLive2dMotionBtn.addEventListener("click", async () => {
        await onPlayMotion();
      });
    }

    if (autoActingBtn && typeof onAutoActingToggle === "function") {
      autoActingBtn.addEventListener("click", () => {
        onAutoActingToggle();
      });
    }

    if (uploadLive2dBtn && live2dUploadInput && typeof onUploadFolder === "function") {
      uploadLive2dBtn.addEventListener("click", () => {
        live2dUploadInput.click();
      });
      live2dUploadInput.addEventListener("change", async () => {
        const files = [...(live2dUploadInput.files || [])];
        await onUploadFolder(files);
      });
    }

    if (uploadLive2dZipBtn && live2dZipUploadInput && typeof onUploadZip === "function") {
      uploadLive2dZipBtn.addEventListener("click", () => {
        live2dZipUploadInput.click();
      });
      live2dZipUploadInput.addEventListener("change", async () => {
        const file = live2dZipUploadInput.files && live2dZipUploadInput.files[0];
        await onUploadZip(file);
      });
    }
  }

  const api = {
    bindLive2dControlEvents,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  globalScope.AppLive2dUi = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
