---
name: review-task
description: Reviews an implemented task's source files against the task file's
  acceptance criteria and stack standards. Produces a structured review reply
  in chat with pass/fail results and a recommendation. Use when asked to review
  an implemented task or validate code before moving to the next task.
---

# Skill — Review Implemented Task

## What You Do
Read the task file and the implementation source files it produced, then post a
structured review **as a chat reply** that tells the developer exactly what
passed, what failed, and whether the implementation is ready to move on.

The review is conversational — it lives in the chat thread, not on disk. You
never modify production code and you never write a review file.

---

## Steps

1. Read `.github/copilot-instructions.md` — global principles, implementation
   conventions, and pre-built file rules
2. Read `workshop-stack.md` — extract language, framework, folder paths, schema
   file locations, ORM type, test framework, and pre-built file list. All path
   and technology references in the checklist below must use values from this
   file, not hardcoded assumptions.
3. Read the task file from `issues/` — extract acceptance criteria and task type
4. Determine the task type from the title prefix:
   `[DATABASE]` / `[BACKEND]` / `[UNIT-TEST]` / `[FRONTEND]` / `[E2E-TEST]`
5. Identify the source files produced by the task using the folders defined in
   `workshop-stack.md` for that task type, and read each one in full
6. Run the checklist for that task type (see below), substituting paths and
   conventions from `workshop-stack.md` wherever placeholders appear
7. Post the review **as a chat reply** in the format below — do not create a file
8. Set review outcome: **APPROVE** (all pass) or **REQUEST CHANGES** (any fail)

---

## Review Reply Format

Post the review as a chat message using exactly this Markdown structure:

```
## Review — [TASK TYPE] {Task Title}

**Task:** `issues/{task-file-name}`
**Outcome: ✅ APPROVE** — all checks passed, ready to move on.
<!-- OR -->
**Outcome: ❌ REQUEST CHANGES** — {N} check(s) failed (listed below).

---

### Acceptance Criteria

| # | Criterion (from Task) | Result |
|---|------------------------|--------|
| 1 | {AC text from Task}    | ✅ Pass / ❌ Fail — {reason} |
| 2 | {AC text from Task}    | ✅ Pass / ❌ Fail — {reason} |

---

### Standards Checklist

| Check | Result |
|-------|--------|
| {check description} | ✅ Pass / ❌ Fail — {reason} |

---

### Files Reviewed
- `{file path}` — {one-line description of what the file implements}

{If REQUEST CHANGES}
### Required Fixes
1. {Specific actionable fix — reference file and line if possible}
2. ...
```

---

## Checklists by Task Type

### [DATABASE] Tasks

```
ACCEPTANCE CRITERIA
✅/❌  Every AC from the Task is satisfied by the implemented files

SCHEMA  (use the data model location from workshop-stack.md — e.g. schema_file,
         entities_folder, models_folder — whichever field defines where data
         models/entities are stored for this stack)
✅/❌  Every model named in the Task exists in the data model file(s)
✅/❌  All categorical fields use the stack's enumerated type — not plain strings
       (e.g. status, type fields must be enums or equivalent, not free-form strings)
✅/❌  All relations declared on both sides (both model and related model)
✅/❌  Pre-built models listed in workshop-stack.md are unchanged

MIGRATION  (relational databases only — check this section only if
            `migrations_folder` is defined in workshop-stack.md;
            skip entirely for NoSQL / schema-less databases)
✅/❌  A new migration or schema change file exists in the migrations location

SEED DATA  (use the seed data location from workshop-stack.md — e.g. seed_file,
            data.sql, DataSeeder path — whichever field defines the seed entry point)
✅/❌  Seed data is updated with records for every new model
✅/❌  At least 3 records per domain model
✅/❌  Seed covers every status variant (e.g. at least one ACTIVE, one DRAFT)
✅/❌  Pre-built test user seed is unchanged

SCOPE
✅/❌  No backend route or controller files modified
✅/❌  No frontend files modified
```

---

### [BACKEND] Tasks

```
ACCEPTANCE CRITERIA
✅/❌  Every AC from the Task is satisfied by the implemented files

ENDPOINTS
✅/❌  Every endpoint listed in the Task is implemented
✅/❌  HTTP methods and paths match the Task exactly
✅/❌  Request body shapes match the Task
✅/❌  Response shapes match the Task

AUTH  (use auth_middleware path from workshop-stack.md)
✅/❌  Every protected endpoint uses the authentication middleware defined in workshop-stack.md
✅/❌  Unprotected endpoints (if any) are explicitly noted in the Task

ERROR HANDLING
✅/❌  All errors return the error response shape defined in the design doc
✅/❌  Missing resource returns 404, not 500
✅/❌  Validation errors return 400, not 500

LANGUAGE CONVENTIONS  (derived from workshop-stack.md language/framework)
✅/❌  No language anti-patterns (e.g. no `any` in TypeScript, no bare excepts in Python)
✅/❌  Async patterns follow the stack convention (e.g. async/await, coroutines, promises)

SCOPE  (use routes_folder, controllers_folder paths from workshop-stack.md)
✅/❌  Only files in the backend route/controller/service folders modified
✅/❌  No frontend files modified
✅/❌  Data model schema file not modified
```

---

### [FRONTEND] Tasks

```
ACCEPTANCE CRITERIA
✅/❌  Every AC from the Task is satisfied by the implemented files

COMPONENTS  (use pages_folder, components_folder paths from workshop-stack.md)
✅/❌  Every component named in the Task's "What to Build" section exists

TEST IDENTIFIERS
✅/❌  Every test identifier (e.g. data-testid) listed in the Task exists
       on the correct element in the component source
✅/❌  No test identifiers from the Task are missing
✅/❌  Every data-testid value matches the design document exactly

API CALLS
✅/❌  Frontend calls the endpoints listed in the Task's Context section
✅/❌  API calls go through services_folder — never inline in components
✅/❌  Authentication token is passed correctly for protected endpoints

LANGUAGE CONVENTIONS  (derived from workshop-stack.md frontend framework)
✅/❌  No language anti-patterns for the chosen frontend framework
✅/❌  Component style follows the convention defined in workshop-stack.md
       (e.g. functional + hooks for React, Composition API for Vue)

SCOPE  (use pages_folder, components_folder, services_folder from workshop-stack.md)
✅/❌  Only files in the frontend UI folders modified
✅/❌  No backend route, controller, or schema files modified
✅/❌  Pre-built files listed in workshop-stack.md are unchanged
       unless the Task explicitly requires changes
```

---

### [UNIT-TEST] Tasks

```
ACCEPTANCE CRITERIA
✅/❌  Every AC from the parent [BACKEND] Task has at least one test

COVERAGE
✅/❌  Every endpoint has a happy-path test (200/201 response)
✅/❌  Every protected endpoint has a 401 test (no token)
✅/❌  At least one error case per endpoint (e.g. 404 not found, 400 invalid)

TEST QUALITY  (use unit_test_framework from workshop-stack.md)
✅/❌  Data access layer is mocked — no real database calls in unit tests
✅/❌  Tests are isolated — no shared mutable state between tests
✅/❌  No test imports production code that touches the file system or network

SCOPE  (use unit_tests_folder from workshop-stack.md)
✅/❌  Only test files in the unit tests folder modified
✅/❌  No production source files modified
```

---

### [E2E-TEST] Tasks

```
ACCEPTANCE CRITERIA
✅/❌  Every AC from the Task is covered by at least one Playwright test

COVERAGE
✅/❌  Happy path is tested
✅/❌  At least one error scenario is tested
✅/❌  Pre-built auth functionality is not tested

SELECTORS  (use design doc data-testid values)
✅/❌  Tests use only data-testid selectors — no CSS classes, tags, or positional selectors
✅/❌  Every data-testid used in tests exists in the design document

SCOPE  (use e2e_tests_folder from workshop-stack.md)
✅/❌  Test files saved as .spec.ts in the e2e tests folder
✅/❌  No production source files modified
```

---

## How to Handle Ambiguous Cases

- **File required by the Task but not present in source** → mark as
  ❌ Fail — "{file} not found"
- **AC cannot be verified from source alone** (e.g. runtime behaviour) → mark as
  ⚠️ Unverifiable — "requires runtime check — verify manually"
- **Files modified outside the Task's declared scope** → flag under Standards
  Checklist as ❌ Fail — "out-of-scope file modified: {file}"

---

## Quality Checklist Before Posting the Review

```
✅ Review reply uses the exact Markdown format above
✅ Every AC from the Task has a row in the table — none skipped
✅ Outcome is APPROVE only if zero failures
✅ Required Fixes section present if outcome is REQUEST CHANGES
✅ No code changes suggested — review is read-only
✅ Review posted in chat — no file written to disk
```
