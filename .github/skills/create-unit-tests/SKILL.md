---
name: create-unit-tests
description: Generates unit test files for an implemented [BACKEND] task using the
  test framework defined in workshop-stack.md. Use when asked to implement a
  [UNIT-TEST] task, write unit tests, or generate backend tests after a BACKEND
  task is implemented.
---

# Skill — Create Unit Tests

## What You Do
Read a `[UNIT-TEST]` task file and the source files produced by its parent
`[BACKEND]` task, then generate unit test files that verify every endpoint and
business rule listed in the task's acceptance criteria.

You never modify production code. You write only the test files defined here.

---

## Steps

1. Read `workshop-stack.md` in full — derive:
   - `unit_test_framework` — the test framework to use (e.g. Jest, pytest,
     JUnit 5, xUnit, NUnit, RSpec)
   - `unit_tests_folder` — where test files are saved
   - `controllers_folder` / `routes_folder` — where the implementation lives
   - `language` and `framework` — to produce idiomatic test code
   - Any pre-built files that must not be modified
2. Read the specified `[UNIT-TEST]` task file from `issues/` — extract:
   - The parent `[BACKEND]` task ID from the `dependencies` frontmatter field
   - Every acceptance criterion to cover (these map to test cases)
   - The API endpoints, business rules, and error scenarios listed
3. Read the parent `[BACKEND]` task file from `issues/` — extract the full
   API contract (endpoints, request/response shapes, auth requirements)
4. Read the implemented source files in `controllers_folder` and
   `routes_folder` — understand the actual function/method signatures and
   error handling patterns to mock correctly
5. Read `docs/design/design-doc.md` — confirm API contracts, request and
   response shapes, and error response format
6. Generate unit test files following the rules below
7. Save all test files to `unit_tests_folder` from `workshop-stack.md`
8. Update the `[UNIT-TEST]` task file frontmatter: set `status: done`

---

## Test Generation Rules

**Scope:** Unit tests for BACKEND logic only.
Do not write E2E tests, integration tests, or frontend tests.
Do not modify any production source files.

**What to test per endpoint:**
- Happy path — correct input returns the expected response and status code
- Missing or invalid input — returns the correct 4xx error and error shape
- Unauthenticated request — returns 401 for every protected endpoint
- Not found — returns 404 when the requested resource does not exist
- Business rule violations — returns the correct error when a rule
  is violated (e.g. state transition not allowed, capacity exceeded)

**Mocking rules:**
- Mock all data access / ORM / repository calls — never hit a real database
- Mock any external service calls
- Each test must be fully isolated — no shared mutable state between tests
- Use the mocking API native to `unit_test_framework` (e.g. `jest.mock()`,
  `unittest.mock`, `Mockito`, `Moq`, `RSpec mocks`)

**File naming:**
- Mirror the source file name with a test suffix convention for the stack
  (e.g. `loan.controller.test.ts`, `test_loan_router.py`,
  `LoanControllerTest.java`, `LoanControllerTests.cs`)
- Save to `unit_tests_folder`

**Coverage requirement:**
Every acceptance criterion from the `[UNIT-TEST]` task must have at least
one test case. Do not skip criteria.

---

## Stack Adaptation
All test framework syntax, assertion APIs, mock patterns, and file naming
conventions come exclusively from `workshop-stack.md`.
Never hardcode a framework — always derive from `unit_test_framework`.

---

## Principles
- Never modify pre-built files listed in `workshop-stack.md`
- Never write tests that call a real database, file system, or network
- Preserve all domain entity names and lifecycle states verbatim from the BRD
- Do not implement or modify production code — test files only
- Do not add effort estimates or change the task scope
