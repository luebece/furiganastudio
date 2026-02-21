const test = require("node:test");
const assert = require("node:assert/strict");
const { bindLive2dStageEvents } = require("../app-live2d-stage-ui.js");

function createMockStage() {
  const handlers = {};
  return {
    handlers,
    addEventListener(type, cb) {
      handlers[type] = cb;
    },
  };
}

test("bindLive2dStageEvents registers pointer handlers", () => {
  const stage = createMockStage();
  const ok = bindLive2dStageEvents({
    stage,
    onPointerMove: () => {},
    onPointerUp: () => {},
    onWheel: () => {},
  });
  assert.equal(ok, true);
  assert.equal(typeof stage.handlers.pointermove, "function");
  assert.equal(typeof stage.handlers.pointerup, "function");
  assert.equal(typeof stage.handlers.wheel, "function");
});
