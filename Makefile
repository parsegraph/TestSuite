DIST_NAME = testsuite

SCRIPT_FILES = \
	src/index.ts \
	src/TestResult.ts \
	src/TestSuiteResult.ts \
	src/Test.ts \
	src/demo.ts \
	test/test.ts

EXTRA_SCRIPTS =

include ./Makefile.microproject
