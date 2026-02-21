const test = require("node:test");
const assert = require("node:assert/strict");
const {
  makeSpeakerRef,
  parseSpeakerRef,
  shouldRetryTts,
  getRetryDelayMs,
} = require("../app-voice-core.js");

test("makeSpeakerRef and parseSpeakerRef roundtrip", () => {
  const ref = makeSpeakerRef("http://127.0.0.1:50021", 3);
  assert.equal(ref, "http://127.0.0.1:50021@@3");
  const parsed = parseSpeakerRef(ref);
  assert.equal(parsed.engineBase, "http://127.0.0.1:50021");
  assert.equal(parsed.speakerId, 3);
});

test("shouldRetryTts only retries retryable statuses and attempts", () => {
  assert.equal(shouldRetryTts({ status: 429 }, 1, 3), true);
  assert.equal(shouldRetryTts({ status: 502 }, 2, 3), true);
  assert.equal(shouldRetryTts({ status: 500 }, 1, 3), false);
  assert.equal(shouldRetryTts({ status: 429 }, 3, 3), false);
});

test("getRetryDelayMs prioritizes retryAfter when present", () => {
  assert.equal(getRetryDelayMs({ retryAfter: 2 }, 1), 2000);
  assert.equal(getRetryDelayMs({}, 2), 2000);
});
