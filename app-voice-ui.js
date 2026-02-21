(function (globalScope) {
  "use strict";

  function bindVoicePanelEvents(ctx = {}) {
    const {
      playAllBtn,
      onPlayAll,
      downloadAllBtn,
      onDownloadAll,
      reloadVoicesBtn,
      onReloadVoices,
      speakerSelect,
      onSpeakerChange,
      toggleMeaningBtn,
      onToggleMeaning,
      scrollResultTopBtn,
      onScrollTop,
      scrollResultBottomBtn,
      onScrollBottom,
    } = ctx;

    if (playAllBtn && typeof onPlayAll === "function") {
      playAllBtn.addEventListener("click", () => {
        onPlayAll();
      });
    }

    if (downloadAllBtn && typeof onDownloadAll === "function") {
      downloadAllBtn.addEventListener("click", async () => {
        await onDownloadAll();
      });
    }

    if (reloadVoicesBtn && typeof onReloadVoices === "function") {
      reloadVoicesBtn.addEventListener("click", () => {
        onReloadVoices();
      });
    }

    if (speakerSelect && typeof onSpeakerChange === "function") {
      speakerSelect.addEventListener("change", () => {
        onSpeakerChange();
      });
    }

    if (toggleMeaningBtn && typeof onToggleMeaning === "function") {
      toggleMeaningBtn.addEventListener("click", async () => {
        await onToggleMeaning();
      });
    }

    if (scrollResultTopBtn && typeof onScrollTop === "function") {
      scrollResultTopBtn.addEventListener("click", () => {
        onScrollTop();
      });
    }

    if (scrollResultBottomBtn && typeof onScrollBottom === "function") {
      scrollResultBottomBtn.addEventListener("click", () => {
        onScrollBottom();
      });
    }
  }

  const api = {
    bindVoicePanelEvents,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  globalScope.AppVoiceUi = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
