DIST_NAME = testsuite

SCRIPT_FILES = \
	src/$(DIST_NAME).ts \
	src/Test.ts \
	src/TestResult.ts \
	src/TestSuiteResult.ts

DECLARATION_FILES = \
	dist/$(DIST_NAME).d.ts \
	dist/$(DIST_NAME).d.ts.map

all: build lint test coverage esdoc

build: dist/$(DIST_NAME).js $(DECLARATION_FILES)
.PHONY: build

demo: dist/$(DIST_NAME).js $(DECLARATION_FILES)
	npm run demo
.PHONY: demo

check:
	npm run test
.PHONY: check

test: check
.PHONY: test

coverage:
	npm run coverage
.PHONY: coverage

prettier:
	npx prettier --write src test demo
.PHONY: prettier

lint:
	npx eslint --fix $(SCRIPT_FILES)
.PHONY: lint

esdoc:
	npx esdoc
.PHONY: esdoc

doc: esdoc
.PHONY: doc

dist/$(DIST_NAME).js: $(SCRIPT_FILES)
	npm run build
	mv dist/src/* dist/

clean:
	rm -rf dist .nyc_output
.PHONY: clean
