const test = require("node:test");
const assert = require("node:assert/strict");
const { bindVoicePanelEvents } = require("../app-voice-ui.js");

function createMockElement() {
  const handlers = {};
  return {
    addEventListener(type, cb) {
      handlers[type] = cb;
    },
    async trigger(type) {
      if (handlers[type]) {
        await handlers[type]({});
      }
    },
  };
}

test("bindVoicePanelEvents wires callbacks", async () => {
  const playAllBtn = createMockElement();
  const downloadAllBtn = createMockElement();
  let called = 0;
  bindVoicePanelEvents({
    playAllBtn,
    onPlayAll: () => { called += 1; },
    downloadAllBtn,
    onDownloadAll: async () => { called += 10; },
  });
  await playAllBtn.trigger("click");
  await downloadAllBtn.trigger("click");
  assert.equal(called, 11);
});
