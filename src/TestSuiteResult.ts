import TestResult from "./TestResult";

export default class TestSuiteResult {
  _testsStarted: number;
  _testsSuccessful: number;
  _testsFailed: number;
  _testsCrashed: number;
  _aggregateResult: HTMLElement;
  _resultList: HTMLElement;
  _container: HTMLElement;

  constructor() {
    this._testsStarted = 0;
    this._testsSuccessful = 0;
    this._testsFailed = 0;
    this._testsCrashed = 0;

    this._aggregateResult = document.createElement("h2");
    this._container = null;
    this._resultList = document.createElement("ul");
  }

  connect(container: HTMLElement) {
    this.disconnect();

    this._container = container;
    this._container.appendChild(this._aggregateResult);
    this._container.appendChild(this._resultList);
  }

  disconnect() {
    if (!this._container) {
      return;
    }
    this._container.removeChild(this._aggregateResult);
    this._container.removeChild(this._resultList);
    this._container = null;
  }

  resultList() {
    return this._resultList;
  }

  aggregateResult() {
    return this._aggregateResult;
  }

  testStarted() {
    ++this._testsStarted;
  }

  testsStarted() {
    return this._testsStarted;
  }

  testsSuccessful() {
    return this._testsSuccessful;
  }

  testsFailed() {
    return this._testsFailed;
  }

  testsCrashed() {
    return this._testsCrashed;
  }

  testFinished(result: TestResult) {
    switch (result.testStatus()) {
      case "Successful":
        return ++this._testsSuccessful;
      case "Failed":
        return ++this._testsFailed;
      case "Crashed":
        return ++this._testsCrashed;
      default:
        throw new Error("Unrecognized status: " + result.testStatus());
    }
  }

  isSuccessful() {
    return (
      this._testsStarted > 0 &&
      this._testsFailed == 0 &&
      this._testsCrashed == 0
    );
  }

  toString() {
    if (this.isSuccessful()) {
      return "All " + this.testsStarted() + " tests ran successfully.";
    } else {
      return (
        this.testsSuccessful() +
        " of " +
        this.testsStarted() +
        " tests ran successfully. " +
        this.testsFailed() +
        " failed, " +
        this.testsCrashed() +
        " crashed"
      );
    }
  }
}
