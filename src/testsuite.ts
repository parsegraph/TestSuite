import Test from "./Test";
import TestSuiteResult from "./TestSuiteResult";
import TestResult from "./TestResult";

let allTests: TestSuite = null;
export function getAllTests() {
  if (!allTests) {
    allTests = new TestSuite("parsegraph", true);
  }
  return allTests;
}

export default class TestSuite {
  _name: string;
  _tests: Test[];

  constructor(name: string, dontAutoadd?: boolean) {
    if (name === undefined) {
      this._name = "Test";
    } else {
      this._name = name;
    }

    this._tests = [];

    if (!dontAutoadd && getAllTests()) {
      getAllTests().addTest(this);
    }
  }

  name() {
    return this._name;
  }

  toString() {
    return (
      'TestSuite "' + this.name() + '" with ' + this._tests.length + " tests"
    );
  }

  addTest(
    testName: string | TestSuite,
    runner?: Function | TestSuite,
    runnerThisArg?: any
  ): Test {
    if (typeof testName === "object") {
      return this.addTest((testName as TestSuite).name(), testName);
    }
    if (typeof testName === "function") {
      return this.addTest(
        this.name() + " " + (this._tests.length + 1),
        testName,
        runner
      );
    }
    const test = new Test(testName, runner, runnerThisArg);
    this._tests.push(test);
    return test;
  }

  run(
    listener: Function,
    listenerThisArg?: any,
    _?: HTMLElement,
    testResults?: TestSuiteResult
  ) {
    const notify = function (...args: any) {
      if (listener) {
        listener.apply(listenerThisArg, args);
      }
    };

    if (!testResults) {
      testResults = new TestSuiteResult();
    }

    // Run the given listener for each test object.
    this._tests.forEach(function (test) {
      if (test.isTestSuite()) {
        const resultLine = document.createElement("li");
        resultLine.appendChild(document.createTextNode(test.name()));
        testResults.resultList().appendChild(resultLine);

        notify("TestStarted", test);
        testResults.testStarted();

        // Run the test.
        const result = test.run(
          listener,
          listenerThisArg,
          resultLine,
          testResults
        );

        if (result.testStatus() == "Crashed") {
          resultLine.appendChild(document.createElement("br"));
          resultLine.appendChild(
            document.createTextNode(result.testResult().toString())
          );
          resultLine.appendChild(document.createElement("br"));
          resultLine.appendChild(document.createElement("pre"));

          const err = result.testResult() as Error;
          console.log(err.stack);
          resultLine.lastElementChild.innerHTML = err.stack.replace(
            /[\r\n]+/g,
            "<br/>"
          );
          return;
        }

        // resultLine.appendChild(result.testResult().resultList());
        if (result.testStatus() === "Successful") {
          resultLine.style.display = "none";
        }

        testResults.testFinished(result);
        notify("TestFinished", result);

        resultLine.className = result.testStatus();
        resultLine.insertBefore(
          document.createTextNode(": " + result.testResult()),
          resultLine.firstChild.nextSibling
        );
      } else if (test.isTest()) {
        const resultLine = document.createElement("li");
        resultLine.appendChild(document.createTextNode(test.name()));
        testResults.resultList().appendChild(resultLine);

        notify("TestStarted", test);
        testResults.testStarted();

        // Run the test.
        const result = test.run(
          listener,
          listenerThisArg,
          resultLine,
          testResults
        );

        testResults.testFinished(result);
        notify("TestFinished", result);

        resultLine.className = result.testStatus();
        if (result.testStatus() === "Crashed") {
          resultLine.appendChild(document.createElement("br"));
          resultLine.appendChild(
            document.createTextNode(result.testResult().toString())
          );
          resultLine.appendChild(document.createElement("br"));
          resultLine.appendChild(document.createElement("pre"));
          const err = result.testResult() as Error;
          resultLine.lastElementChild.innerHTML = err.stack.replace(
            /[\r\n]+/g,
            "<br/>"
          );
        } else if (result.testStatus() !== "Successful") {
          resultLine.appendChild(document.createElement("br"));
          resultLine.appendChild(
            document.createTextNode(result.testResult().toString())
          );
        }

        if (result.testStatus() === "Successful") {
          resultLine.style.display = "none";
        }
      }
    }, this);

    testResults.aggregateResult().innerHTML = testResults.toString();

    return testResults;
  }
}

export { Test, TestSuiteResult, TestResult };
