---
name: review-pull-request
description: Reviews a coding-agent Pull Request against the originating GitHub Issue's
  acceptance criteria. Posts a structured review comment listing passed checks,
  failures, and a merge recommendation. Use when asked to review a PR, check a
  PR against acceptance criteria, or validate agent output before merging.
---

# Skill — Review Agent PR

## What You Do
Read the originating Issue and the PR diff, then post a structured review
comment that tells the human reviewer exactly what passed, what failed, and
whether the PR is safe to merge.

You never modify code. You read and report only.

---

## Steps

1. Read `.github/copilot-instructions.md` — coding standards and pre-built files
2. Read `workshop-stack.md` — extract the tech stack, folder paths, schema file locations,
   ORM type, test framework, and pre-built file list. All path and technology references
   in the checklist below must use values from this file, not hardcoded assumptions.
3. Read the originating issue file from `issues/` folder — extract acceptance criteria and issue type
4. Read the git diff or PR changes — check every changed file against the Issue requirements
5. Determine the issue type from the title: [DATABASE], [BACKEND], [FRONTEND], or unit-test
6. Run the checklist for that issue type (see below), substituting paths and conventions
   from `workshop-stack.md` wherever placeholders appear
7. Save the review to `docs/reviews/review-{issue-name}.md` in the format below
8. Set review outcome: **APPROVE** (all pass) or **REQUEST CHANGES** (any fail)

---

## Review Document Format

Save this as `docs/reviews/review-{issue-name}.md`:

```
## Copilot Review — [ISSUE TYPE] {Issue Title}

**Outcome: ✅ APPROVE** — all checks passed, safe to merge.
<!-- OR -->
**Outcome: ❌ REQUEST CHANGES** — {N} check(s) failed (listed below).

---

### Acceptance Criteria

| # | Criterion (from Issue) | Result |
|---|------------------------|--------|
| 1 | {AC text from Issue}   | ✅ Pass / ❌ Fail — {reason} |
| 2 | {AC text from Issue}   | ✅ Pass / ❌ Fail — {reason} |

---

### Standards Checklist

| Check | Result |
|-------|--------|
| {check description} | ✅ Pass / ❌ Fail — {reason} |

---

### Files Changed
- `{file path}` — {one-line description of what changed}

{If REQUEST CHANGES}
### Required Fixes
1. {Specific actionable fix — reference file and line if possible}
2. ...
```

---

## Checklists by Issue Type

### [DATABASE] Issues

```
ACCEPTANCE CRITERIA
✅/❌  Every AC from the Issue is satisfied by the diff

SCHEMA  (use schema_file path from workshop-stack.md)
✅/❌  Every model named in the Issue exists in the data model schema file
✅/❌  All categorical fields use the stack's enumerated type — not plain strings
       (e.g. status, type fields must be enums or equivalent, not free-form strings)
✅/❌  All relations declared on both sides (both model and related model)
✅/❌  Pre-built models listed in workshop-stack.md are unchanged

MIGRATION  (use migrations_folder path from workshop-stack.md)
✅/❌  A new migration or schema change file exists in the migrations folder

SEED DATA  (use seed_file path from workshop-stack.md)
✅/❌  Seed data file is updated with records for every new model
✅/❌  At least 3 records per domain model
✅/❌  Seed covers every status variant (e.g. at least one ACTIVE, one DRAFT)
✅/❌  Pre-built test user seed is unchanged

SCOPE
✅/❌  No backend route or controller files modified
✅/❌  No frontend files modified
```

---

### [BACKEND] Issues

```
ACCEPTANCE CRITERIA
✅/❌  Every AC from the Issue is satisfied by the diff

ENDPOINTS
✅/❌  Every endpoint listed in the Issue is implemented
✅/❌  HTTP methods and paths match the Issue exactly
✅/❌  Request body shapes match the Issue
✅/❌  Response shapes match the Issue

AUTH  (use auth_middleware path from workshop-stack.md)
✅/❌  Every protected endpoint uses the authentication middleware defined in workshop-stack.md
✅/❌  Unprotected endpoints (if any) are explicitly noted in the Issue

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

### [FRONTEND] Issues

```
ACCEPTANCE CRITERIA
✅/❌  Every AC from the Issue is satisfied by the diff

COMPONENTS  (use pages_folder, components_folder paths from workshop-stack.md)
✅/❌  Every component named in "What to Build" section exists in the diff

TEST IDENTIFIERS
✅/❌  Every test identifier (e.g. data-testid) listed in the Issue exists
       on the correct element in the component source
✅/❌  No test identifiers from the Issue are missing

API CALLS
✅/❌  Frontend calls the endpoints listed in the Issue's Context section
✅/❌  Authentication token is passed correctly for protected endpoints

LANGUAGE CONVENTIONS  (derived from workshop-stack.md frontend framework)
✅/❌  No language anti-patterns for the chosen frontend framework
✅/❌  Component style follows the convention defined in workshop-stack.md
       (e.g. functional + hooks for React, Composition API for Vue)

SCOPE  (use pages_folder, components_folder, services_folder from workshop-stack.md)
✅/❌  Only files in the frontend UI folders modified
✅/❌  No backend route, controller, or schema files modified
✅/❌  Pre-built files listed in workshop-stack.md are unchanged
       unless the Issue explicitly requires changes
```

---

### Unit Test PRs (from unit-test-agent)

```
ACCEPTANCE CRITERIA
✅/❌  Every AC from the [BACKEND] Issue has at least one test

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

## How to Handle Ambiguous Diffs

- **File not in diff but required by Issue** → mark as ❌ Fail — "{file} not found in PR"
- **AC cannot be verified from diff alone** (e.g. runtime behaviour) → mark as
  ⚠️ Unverifiable — "requires runtime check — verify manually"
- **Extra files changed beyond Issue scope** → flag under Standards Checklist as
  ❌ Fail — "out-of-scope file modified: {file}"

---

## Quality Checklist Before Posting Review

```
✅ Review comment uses the exact format above
✅ Every AC from the Issue has a row in the table — none skipped
✅ Outcome is APPROVE only if zero failures
✅ Required Fixes section present if outcome is REQUEST CHANGES
✅ No code changes suggested — review is read-only
✅ Review posted as a PR review (not just a comment) so GitHub tracks it
```
