const test = require("node:test");
const assert = require("node:assert/strict");
const {
  buildSpeakerOptions,
  requestVoiceBlobWithRetry,
} = require("../app-voice-service.js");
const voiceCore = require("../app-voice-core.js");

test("buildSpeakerOptions normalizes speaker list", () => {
  const speakers = [{
    name: "A",
    speaker_uuid: "uuid-a",
    _engine: "voicevox",
    _engineBase: "http://127.0.0.1:50021",
    styles: [{ id: 1, name: "normal" }],
  }];
  const out = buildSpeakerOptions(speakers, voiceCore);
  assert.equal(out.options.length, 1);
  assert.equal(out.options[0].id, "http://127.0.0.1:50021@@1");
  assert.equal(out.meta.get("http://127.0.0.1:50021@@1").speakerName, "A");
});

test("requestVoiceBlobWithRetry retries and succeeds", async () => {
  let calls = 0;
  const runtime = {
    fetchWithTimeout: async () => {
      calls += 1;
      if (calls === 1) {
        const error = new Error("fail");
        error.status = 502;
        throw error;
      }
      return {
        ok: true,
        blob: async () => "ok-blob",
      };
    },
    parseJsonSafe: async () => null,
    parseErrorDetail: (x) => String(x),
  };
  const out = await requestVoiceBlobWithRetry({
    text: "test",
    speakerRef: "0@@1",
    runtime,
    voiceCore,
    sleep: async () => {},
    maxTries: 2,
  });
  assert.equal(out, "ok-blob");
  assert.equal(calls, 2);
});
