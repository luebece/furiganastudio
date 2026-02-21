const test = require("node:test");
const assert = require("node:assert/strict");
const {
  katakanaToHiragana,
  hiraganaToKatakana,
  isAllKatakana,
  hasKanji,
  alignRuby,
} = require("../furigana-core.js");

test("katakanaToHiragana converts katakana", () => {
  assert.equal(katakanaToHiragana("ガッコウ"), "がっこう");
});

test("hiraganaToKatakana converts hiragana", () => {
  assert.equal(hiraganaToKatakana("がっこう"), "ガッコウ");
});

test("isAllKatakana checks katakana-only text", () => {
  assert.equal(isAllKatakana("ガッコウー"), true);
  assert.equal(isAllKatakana("学校"), false);
});

test("hasKanji detects kanji", () => {
  assert.equal(hasKanji("学校"), true);
  assert.equal(hasKanji("がっこう"), false);
});

test("alignRuby creates ruby tags for kanji core", () => {
  const html = alignRuby("食べる", "タベル");
  assert.equal(html, "<ruby>食<rt>た</rt></ruby>べる");
});

test("alignRuby escapes html when no kanji core", () => {
  const html = alignRuby("<テスト>", "テスト");
  assert.equal(html, "&lt;テスト&gt;");
});
