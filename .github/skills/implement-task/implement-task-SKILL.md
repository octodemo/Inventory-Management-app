---
name: implement-task
description: Implements a task file by generating code targeted to the workshop
  stack configuration. Use when asked to implement a task, or when a developer
  references a task file from issues/ and asks for implementation.
---

# Skill — Implement Task

## What You Do
Read the task file and the workshop stack configuration, then generate
code that implements the task correctly for the defined tech stack.

This skill handles all four task types:
- `[DATABASE]` — data model and seed data
- `[BACKEND]` — API endpoints and business logic
- `[FRONTEND]` — UI components and pages
- `[TEST]` — automated test coverage

---

## Steps

### Step 1 — Read Stack Configuration
Read `workshop-stack.md` in full before writing any code.
Derive from it:
- Language and coding conventions
- Framework and folder structure
- Pre-built files that must never be modified
- Test frameworks and test file locations
- Test user credentials

All code generated must conform exactly to what is defined in
`workshop-stack.md`. Never assume a stack — always derive it.

### Step 2 — Read Task File
Read the task file from `issues/` — identify:
- Task type: DATABASE, BACKEND, FRONTEND, or TEST
- Parent story, feature, and epic
- Description — what needs to be implemented
- Acceptance criteria — what must be true when done
- Dependencies — what must already exist before this task runs

### Step 3 — Read Supporting Context
Based on task type, read these additional files:

**For DATABASE tasks:**
- `docs/design/design-doc.md` — entity fields, types, enums,
  relationships, constraints, and seed data plan
- Existing schema file (path from `workshop-stack.md`)

**For BACKEND tasks:**
- `docs/design/design-doc.md` — API contracts, request and response
  shapes, authentication requirements, and business rules
- Existing schema or model definitions (path from `workshop-stack.md`)

**For FRONTEND tasks:**
- `docs/design/design-doc.md` — component structure, test identifiers,
  and API endpoints to consume
- Parent story file in `docs/work-items/stories/` — acceptance criteria
  and user-facing behaviour

**For TEST tasks:**
- Parent story file — acceptance criteria to cover
- `docs/design/design-doc.md` — test identifiers for element selection
- Test credentials from `workshop-stack.md`

### Step 4 — Generate Code

Generate code following the type-specific scope rules below.
All conventions, folder paths, naming patterns, and coding standards
come from `workshop-stack.md` — not from this skill file.

---

## [DATABASE] Task Rules

**Scope:** Data model and seed data only.
Do not write API logic, UI code, or tests.

**What to produce:**
1. Updated data model or schema with new entities and types added.
   - Follow the schema conventions defined in `workshop-stack.md`
   - Never modify pre-built models listed in `workshop-stack.md`
   - File path from `workshop-stack.md` → `schema_file`
2. Updated seed file with realistic sample records.
   - At least one record per categorical variant defined in the design doc
   - At least 3-5 records per new entity
   - File path from `workshop-stack.md` → `seed_file`

**Before finishing:**
Verify every acceptance criterion in the task file is satisfied
by the generated schema and seed data.

---

## [BACKEND] Task Rules

**Scope:** API endpoints and business logic only.
Do not write schema changes, UI code, or tests.

**What to produce:**
1. API route definitions.
   - Folder path from `workshop-stack.md` → `routes_folder`
2. Business logic handlers or controllers.
   - Folder path from `workshop-stack.md` → `controllers_folder`
   - Enforce every business rule stated in the task description
   - Apply authentication to protected routes as defined in `workshop-stack.md`
3. Register new routes in the app entry point if not already registered.
   - Entry point path from `workshop-stack.md` → `entry_point`

**Before finishing:**
Every endpoint and error scenario in the task acceptance criteria
must be handled explicitly.

---

## [FRONTEND] Task Rules

**Scope:** UI components and pages only.
Do not write API logic, schema changes, or tests.

**What to produce:**
1. Page or component file.
   - Folder paths from `workshop-stack.md` → `pages_folder` or
     `components_folder`
   - Follow component conventions from `workshop-stack.md`
2. API service file if one does not already exist for this domain entity.
   - Folder path from `workshop-stack.md` → `services_folder`
   - API calls must go in the service file — not inline in the component
3. Register the page in the router if it is a new page.

**Test identifiers:**
- Every interactive element must have a test identifier attribute
- The attribute name and values come from the design doc — never invent them
- These must match exactly what is defined in `docs/design/design-doc.md`

**UI states to always handle:**
- Loading state — while data is being fetched
- Error state — if the API call fails
- Empty state — if there is no data to display

**Before finishing:**
Every user-visible behaviour in the task acceptance criteria must be
implemented and visible in the UI.

---

## [TEST] Task Rules

**Scope:** Automated tests only.
Do not write implementation code.

**Determine test type from task content:**
- References a user journey end to end → E2E test
- References API endpoints or business logic → Unit test

**For E2E tests:**
- Folder from `workshop-stack.md` → `e2e_tests_folder`
- Framework from `workshop-stack.md` → `e2e_test_framework`
- Use only test identifier selectors — never CSS classes or element tags
- Use test credentials from `workshop-stack.md`
- Cover the happy path from the story acceptance criteria
- Cover at least one error or validation scenario

**For unit tests:**
- Folder from `workshop-stack.md` → `unit_tests_folder`
- Framework from `workshop-stack.md` → `unit_test_framework`
- Test each endpoint or function defined in the task
- Mock external dependencies — do not use real databases or services
- Cover success and error responses

**Before finishing:**
Every acceptance criterion from the parent story that this test
covers must have at least one test case.

---

## Step 5 — Update Task Status

After generating all code, update the task file frontmatter:
```
status: done
```

---

## Step 6 — Summarise What Was Done

Provide a brief summary after completing implementation:
- Files created or modified
- What was implemented (endpoints, components, or test cases)
- Any assumptions made during implementation

---

## Do Not Do This

- Do NOT modify pre-built files listed in `workshop-stack.md`
  unless the task explicitly requires it
- Do NOT implement anything not described in the task file —
  one task, one scope
- Do NOT invent test identifier values — use only what is in the design doc
- Do NOT make API calls inline in UI components —
  use the services folder defined in `workshop-stack.md`
- Do NOT assume the stack — always derive everything from `workshop-stack.md`
- Do NOT skip reading the stack configuration before writing code

## Validation Checklist

Before finishing, verify:
- [ ] Every acceptance criterion in the task file is satisfied
- [ ] All code follows the conventions in `workshop-stack.md`
- [ ] No pre-built files were modified without explicit task requirement
- [ ] Test identifier values match the design doc exactly
- [ ] Task status updated to `done`
- [ ] No scope beyond what the task describes was implemented
