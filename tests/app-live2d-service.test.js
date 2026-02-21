const test = require("node:test");
const assert = require("node:assert/strict");
const {
  parseStoredViewTransforms,
  serializeViewTransforms,
} = require("../app-live2d-service.js");
const { normalizeViewTransform } = require("../app-live2d-core.js");

test("parseStoredViewTransforms parses and normalizes", () => {
  const raw = JSON.stringify({
    a: { x: "3", y: "bad", zoom: 9 },
  });
  const out = parseStoredViewTransforms(raw, normalizeViewTransform, 0.5, 1.5);
  assert.equal(out.get("a").x, 3);
  assert.equal(out.get("a").y, 0);
  assert.equal(out.get("a").zoom, 1.5);
});

test("serializeViewTransforms serializes map", () => {
  const map = new Map();
  map.set("m", { x: 1, y: 2, zoom: 3 });
  const out = serializeViewTransforms(map, normalizeViewTransform, 0.5, 1.5);
  assert.deepEqual(out, {
    m: { x: 1, y: 2, zoom: 1.5 },
  });
});
