import Test from "./Test";

export default class TestResult {
  _status: string;
  _result: string | Error;
  _test: Test;

  constructor(testStatus: string, testResult: string, test: Test) {
    this._status = testStatus;
    this._result = testResult;
    this._test = test;
  }

  testStatus() {
    return this._status;
  }

  testResult() {
    return this._result;
  }

  test() {
    return this._test;
  }
}
