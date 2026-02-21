const test = require("node:test");
const assert = require("node:assert/strict");
const {
  clampZoom,
  normalizeViewTransform,
} = require("../app-live2d-core.js");

test("clampZoom keeps value in range", () => {
  assert.equal(clampZoom(2, 0.5, 1.5), 1.5);
  assert.equal(clampZoom(0.1, 0.5, 1.5), 0.5);
  assert.equal(clampZoom(1.2, 0.5, 1.5), 1.2);
});

test("normalizeViewTransform normalizes malformed input", () => {
  const out = normalizeViewTransform({ x: "10", y: "abc", zoom: 9 }, 0.5, 1.5);
  assert.deepEqual(out, { x: 10, y: 0, zoom: 1.5 });
});
