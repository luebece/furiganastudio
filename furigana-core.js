(function (globalScope) {
  "use strict";

  const RE_KATAKANA = /[\u30A0-\u30FF]/;
  const RE_KANA = /[\u3040-\u30FF]/;
  const RE_KANJI = /[\u4E00-\u9FFF\u3400-\u4DBF\uF900-\uFAFF]/;

  function escapeHtml(text) {
    return String(text || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function katakanaToHiragana(text) {
    return String(text || "").replace(/[\u30A1-\u30F6]/g, (ch) =>
      String.fromCharCode(ch.charCodeAt(0) - 0x60)
    );
  }

  function hiraganaToKatakana(text) {
    return String(text || "").replace(/[\u3041-\u3096]/g, (ch) =>
      String.fromCharCode(ch.charCodeAt(0) + 0x60)
    );
  }

  function isAllKatakana(text) {
    const s = String(text || "");
    return s.length > 0 && [...s].every((ch) => RE_KATAKANA.test(ch) || ch === "ー");
  }

  function hasKanji(text) {
    return RE_KANJI.test(String(text || ""));
  }

  function alignRuby(surface, readingKatakana, escapeHtmlFn = escapeHtml) {
    const rawSurface = String(surface || "");
    const rawReading = String(readingKatakana || "");
    const sChars = [...rawSurface];
    const rChars = [...rawReading];

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
      return escapeHtmlFn(rawSurface);
    }

    return `${escapeHtmlFn(prefix)}<ruby>${escapeHtmlFn(core)}<rt>${escapeHtmlFn(katakanaToHiragana(coreReading))}</rt></ruby>${escapeHtmlFn(suffix)}`;
  }

  const api = {
    alignRuby,
    escapeHtml,
    hasKanji,
    hiraganaToKatakana,
    isAllKatakana,
    katakanaToHiragana,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  globalScope.FuriganaCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
