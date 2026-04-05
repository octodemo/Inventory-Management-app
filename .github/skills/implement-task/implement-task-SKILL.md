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

## Steps

### Step 1 — Read Stack Configuration
Read `workshop-stack.md` in full before writing any code.
This file defines:
- Language, frameworks, and folder structure
- Naming conventions and coding standards
- Pre-built files that must never be modified
- Test frameworks and test file locations

All code generated must conform to the stack defined in this file.

### Step 2 — Read Task File
Read the task file from `issues/` — identify:
- Task type: DATABASE, BACKEND, FRONTEND, or TEST
- Parent story, feature, and epic
- Description — what needs to be implemented
- Acceptance criteria — what must be true when done
- Dependencies — what must already exist

### Step 3 — Read Supporting Context
Based on task type, read these additional files:

**For DATABASE tasks:**
- `docs/design/design-doc.md` — entity fields, enums, relationships,
  seed data plan
- Existing schema file (from `workshop-stack.md` → `schema_file`)

**For BACKEND tasks:**
- `docs/design/design-doc.md` — API contracts, request/response shapes,
  business rules
- Existing schema file — to understand available models
- Auth middleware path (from `workshop-stack.md` → `auth_middleware`)

**For FRONTEND tasks:**
- `docs/design/design-doc.md` — component structure, data-testid values,
  API endpoints to consume
- Parent story file in `docs/work-items/stories/` — acceptance criteria
  and user-facing behaviour

**For TEST tasks:**
- Parent story file — acceptance criteria to cover
- `docs/design/design-doc.md` — data-testid values for element selection
- Test credentials from `workshop-stack.md` → Test User Credentials

### Step 4 — Generate Code

Generate code following the type-specific rules below.
Always follow the conventions defined in `workshop-stack.md`.

---

## [DATABASE] Task Rules

**Scope:** Schema changes and seed data only.
Do not write API logic, UI, or tests.

**What to produce:**
1. Updated schema file with new models and enums added.
   - Mark all new additions with `// NEW`
   - Never modify models marked `// PRE-BUILT`
   - All categorical fields use enum types — never plain strings
   - All relations must have both sides defined
2. Updated seed file with realistic sample records.
   - At least one record per enum variant
   - At least 3-5 records per new entity
   - Cover all status/condition/category combinations

**Acceptance criteria check:**
Before finishing, verify every acceptance criterion in the task file
is satisfied by the generated schema and seed data.

**Output files:**
- Schema file (path from `workshop-stack.md` → `schema_file`)
- Seed file (path from `workshop-stack.md` → `seed_file`)

---

## [BACKEND] Task Rules

**Scope:** API routes, controllers, and business logic only.
Do not write schema changes, UI, or tests.

**What to produce:**
1. Route file registering the endpoints.
   - File location from `workshop-stack.md` → `routes_folder`
   - Route prefix from `workshop-stack.md` → API Conventions
2. Controller file with business logic.
   - File location from `workshop-stack.md` → `controllers_folder`
   - One function per endpoint
   - Business rules from the task description enforced explicitly
   - Auth middleware applied to protected routes
3. Register the new route in the app entry point if not already registered.

**API conventions — always follow these:**
- All errors return `{ error: string }` with correct HTTP status
- 400 for validation errors
- 401 for unauthenticated requests
- 403 for unauthorised requests
- 404 for not found
- 409 for conflict (duplicate, constraint violation)
- 201 for successful creation
- 200 for successful retrieval or update
- 204 for successful deletion

**Acceptance criteria check:**
Every endpoint and error scenario in the task acceptance criteria
must be handled explicitly in the controller.

**Output files:**
- Route file in `routes_folder`
- Controller file in `controllers_folder`
- Updated app entry point if route registration needed

---

## [FRONTEND] Task Rules

**Scope:** UI components and pages only.
Do not write API logic, schema changes, or tests.

**What to produce:**
1. Page or component file.
   - Pages go in `pages_folder`, components in `components_folder`
   - Functional components with hooks only
   - API calls go in a service file in `services_folder` —
     never inline in the component
2. Service file for API calls if one does not already exist
   for this domain entity.
3. Register the page in the router if it is a new page.

**Frontend conventions — always follow these:**
- Every interactive element must have a `data-testid` attribute
- `data-testid` values must match exactly what is in the design doc —
  do not invent new values
- Use the existing auth context for the current user — do not rebuild auth
- Handle loading states — show a loading indicator while fetching
- Handle error states — show an error message if the API call fails
- Handle empty states — show a meaningful message if there is no data

**Acceptance criteria check:**
Every user-visible behaviour in the task acceptance criteria must be
implemented and visible in the UI.

**Output files:**
- Page or component file
- Service file (if new)
- Updated router file (if new page)

---

## [TEST] Task Rules

**Scope:** Automated tests only.
Do not write implementation code.

**Determine test type from task content:**
- If task title contains `[TEST]` and references user journeys → E2E test
- If task title references API endpoints or business logic → Unit test

**For E2E tests:**
- File location from `workshop-stack.md` → `e2e_tests_folder`
- Use only `data-testid` selectors — never CSS classes or element tags
- Use test credentials from `workshop-stack.md` → Test User Credentials
- Cover the happy path from the story acceptance criteria
- Cover at least one error scenario
- Use the E2E framework defined in `workshop-stack.md` →
  `e2e_test_framework`

**For unit tests:**
- File location from `workshop-stack.md` → `unit_tests_folder`
- Test each API endpoint defined in the task
- Mock database calls — do not use a real database in unit tests
- Cover success responses and error responses
- Use the unit test framework from `workshop-stack.md` →
  `unit_test_framework`

**Acceptance criteria check:**
Every acceptance criterion from the parent story that this test covers
must have at least one test case.

**Output files:**
- Test file in the appropriate test folder

---

## Step 5 — Update Task Status

After generating all code, update the task file frontmatter:
```
status: done
```

---

## Step 6 — Summarise What Was Done

After completing implementation, provide a brief summary:
- Files created or modified
- Endpoints implemented (for BACKEND tasks)
- Components created (for FRONTEND tasks)
- Test cases written (for TEST tasks)
- Any assumptions made during implementation

---

## Do Not Do This

- Do NOT modify pre-built files listed in `workshop-stack.md`
  unless the task explicitly requires it
- Do NOT rebuild authentication — use the existing auth middleware
- Do NOT use `any` in TypeScript — follow strict mode
- Do NOT make API calls inline in React components —
  use the services folder
- Do NOT invent `data-testid` values — use only what is in the design doc
- Do NOT implement scope beyond what the task describes —
  one task, one scope
- Do NOT skip the stack configuration file — always read it first
- Do NOT assume the stack — always derive it from `workshop-stack.md`

## Validation Checklist

Before finishing, verify:
- [ ] Every acceptance criterion in the task file is satisfied
- [ ] All code follows the conventions in `workshop-stack.md`
- [ ] No pre-built files were modified without explicit task requirement
- [ ] `data-testid` values match the design doc exactly
- [ ] Task status updated to `done`
- [ ] No scope beyond what the task describes was implemented
