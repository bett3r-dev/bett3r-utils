import { assert } from "chai";
import * as mod from "./index";

describe("index", function () {
  it("has elements from all the different modules", () => {
    // Stream
    assert.exists(mod.Stream, 'Stream')
    assert.exists(mod.Stream.stream)
    // bett3r-utils
    assert.exists(mod.ensureArray)
    assert.exists(mod.ensureAsync)

  });
});
