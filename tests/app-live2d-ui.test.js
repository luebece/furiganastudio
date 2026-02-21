const test = require("node:test");
const assert = require("node:assert/strict");
const { bindLive2dControlEvents } = require("../app-live2d-ui.js");

function createMockElement() {
  const handlers = {};
  return {
    files: [],
    addEventListener(type, cb) {
      handlers[type] = cb;
    },
    click() {
      if (handlers.click) {
        handlers.click({});
      }
    },
    async trigger(type) {
      if (handlers[type]) {
        await handlers[type]({});
      }
    },
  };
}

test("bindLive2dControlEvents wires model and upload handlers", async () => {
  const live2dModelSelect = createMockElement();
  const uploadLive2dBtn = createMockElement();
  const live2dUploadInput = createMockElement();
  live2dUploadInput.files = [{ name: "a" }];
  let called = 0;
  bindLive2dControlEvents({
    live2dModelSelect,
    onModelChange: async () => { called += 1; },
    uploadLive2dBtn,
    live2dUploadInput,
    onUploadFolder: async (files) => { called += files.length * 10; },
  });
  await live2dModelSelect.trigger("change");
  uploadLive2dBtn.click();
  await live2dUploadInput.trigger("change");
  assert.equal(called, 11);
});
