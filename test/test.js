var assert = require("assert");
import TestSuite from "../dist/parsegraph-testsuite";

describe("TestSuite", function () {
  describe("#constructor()", function () {
    it("works", ()=>{
      assert.ok(new TestSuite('Default', true));
    });
    it("also works", ()=>{
      assert.ok(new TestSuite('Default', true));
    });
  });
});
