import TestSuiteResult from './TestSuiteResult';
import TestResult from './TestResult';
import TestSuite from './testsuite';

export default class Test {
  _name:string;
  _runner:object[];

  constructor(name:string, runner:Function|TestSuite, runnerThisArg?:any) {
    this._name = name;
    this._runner = [runner, runnerThisArg];
  }

  name() {
    return this._name;
  };

  isTestSuite() {
    return typeof this._runner[0] === 'object';
  };

  testSuite() {
    return this._runner[0];
  };

  isTest() {
    return typeof this._runner[0] === 'function';
  };

  run(listener:Function, listenerThisArg?:any, resultDom?:HTMLElement, suiteResult?:TestSuiteResult):TestResult {
    if (!suiteResult) {
      suiteResult = new TestSuiteResult();
    }
    let testResult:any;
    let testStatus:string;
    if (this.isTestSuite()) {
      try {
        // The runner is another test or test suite.
        testResult = (this._runner[0] as TestSuite).run(
            listener,
            listenerThisArg,
            resultDom,
            suiteResult,
        );

        if (testResult.isSuccessful()) {
          testStatus = 'Successful';
          testResult = testResult;
        } else {
          testStatus = 'Failed';
          testResult = testResult;
          console.log('Suite failed with result: ', testResult);
        }
      } catch (ex) {
        testStatus = 'Crashed';
        testResult = ex;
      }
    } else if (this.isTest()) {
      // The runner is a function.
      testStatus = 'Started';
      try {
        testResult = (this._runner[0] as Function).call(
            this._runner[1],
            resultDom,
            suiteResult,
        );
        if (testResult !== undefined) {
          testStatus = 'Failed';
          console.log('Test failed with result: ', testResult);
        } else {
          testStatus = 'Successful';
        }
      } catch (ex) {
        testResult = ex;
        testStatus = 'Crashed';
      }
    } else {
      testResult =
        'Test must either be an object or a function, but given ' +
        typeof this._runner[0];
      testStatus = 'Crashed';
    }

    return new TestResult(testStatus, testResult, this);
  };
}
