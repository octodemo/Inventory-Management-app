---
name: create-tasks
description: Creates Task work items from User Story files and the design document.
  Use when asked to create tasks or break user stories into implementation tasks.
---

# Skill — Create Tasks

## What You Do
Read the User Story files and design document and produce a set of Task
files that break each story into typed, executable units of implementation
work. Tasks sit at the lowest level of the work breakdown hierarchy:

```
Epic → Feature → User Story → Task
```

A Task is a single unit of work assigned to one developer role. Every
task has a type that determines both the implementation order and the
developer responsible for it.

## Task Types
Every task must be exactly one of these five types:

| Type | Prefix | Responsible For | Implemented By |
|------|--------|-----------------|----------------|
| DATABASE | [DATABASE] | Data model changes, seed data, and migrations (relational only) | implement-agent |
| BACKEND | [BACKEND] | API endpoints, business logic, data access | implement-agent |
| UNIT-TEST | [UNIT-TEST] | Unit tests for the BACKEND layer — isolated, no real database | unit-test-agent |
| FRONTEND | [FRONTEND] | UI components, pages, client-side logic | implement-agent |
| E2E-TEST | [E2E-TEST] | Playwright end-to-end tests — browser-level user journey tests only | playwright-agent |

**Implementation order is always:**
```
[DATABASE] → [BACKEND] → [UNIT-TEST] → [FRONTEND] → [E2E-TEST]
```
This order is non-negotiable. BACKEND depends on the data model.
UNIT-TEST validates the BACKEND in isolation before the UI is built.
FRONTEND depends on the verified API. E2E-TEST validates the full stack.

## Steps
1. Read all User Story files in `docs/work-items/stories/`.
2. Read `workshop-stack.md` — extract folder paths, file naming conventions,
   and framework patterns. Use these when writing acceptance criteria and
   descriptions so that file paths, folder references, and naming conventions
   in each task match the actual project structure exactly.
   (e.g. use `schema_file`, `routes_folder`, `pages_folder`, `e2e_tests_folder`
   from `workshop-stack.md` rather than inventing paths.)
   Also check for `max_ac_per_task` — if set, you must cap the Acceptance
   Criteria list of every generated task file at that number. When trimming,
   prioritise in this order: (1) happy path, (2) authentication/authorisation,
   (3) the single most critical business rule. Drop remaining error scenarios.
3. Read `docs/design/design-doc.md` — for each story, identify:
   - Which domain entities and fields are involved (→ DATABASE tasks)
   - Which API endpoints are needed (→ BACKEND tasks)
   - Which API endpoints need unit test coverage (→ UNIT-TEST tasks, 1:1 with BACKEND)
   - Which UI components and pages are needed (→ FRONTEND tasks)
   - Which acceptance criteria need automated test coverage (→ E2E-TEST tasks)
3. For each story, produce one task per type needed. Most stories
   produce exactly 5 tasks (one per type). Simple stories may produce
   4 (no DATABASE task if no model changes needed).
4. Number tasks globally across all stories in implementation order:
   all DATABASE tasks first, then BACKEND, then UNIT-TEST, then FRONTEND, then E2E-TEST.
5. For each task, produce one markdown file in the format below.
6. **Save files to `issues/`:**
   - Name each file:
     `{NN}-{TYPE}-{kebab-case-title}.md`
     (e.g. `01-DATABASE-appointment-model.md`)
   - Global sequence number NN is zero-padded to two digits.
   - TYPE is uppercase: DATABASE, BACKEND, UNIT-TEST, FRONTEND, E2E-TEST.
   - If the folder does not exist, create it.
   - If files already exist from a previous run, overwrite them.
7. **Update each parent User Story file:**
   - Open the story file and populate the `tasks: []` frontmatter
     field with the IDs of the tasks created for that story.
     (e.g. `tasks: [01-DATABASE-appointment-model,
                     05-BACKEND-appointment-api,
                     10-UNIT-TEST-appointment-api,
                     15-FRONTEND-appointment-booking-form,
                     20-E2E-TEST-book-appointment]`)

## Task File Format

```markdown
---
id: {NN}-{TYPE}-{kebab-title}
title: [{TYPE}] {Task Title}
type: task
taskType: {DATABASE | BACKEND | UNIT-TEST | FRONTEND | E2E-TEST}
userStory: story-{id}
feature: feature-{id}
epic: epic-{NN}
status: ready
dependencies: [{id of task this depends on, if any}]
---

# [{TYPE}] {Task Title}

## Description
Two to four sentences describing exactly what this task implements.
Reference the relevant design doc section (e.g. API endpoint, entity,
component) and the user story it serves.
Use domain language from the BRD throughout.

## Acceptance Criteria
- [ ] {Specific, technically verifiable criterion 1}
- [ ] {Specific, technically verifiable criterion 2}
- [ ] {Specific, technically verifiable criterion 3}

## Definition of Done
- All acceptance criteria above are verified
- Code is reviewed and meets team standards
- No regressions introduced in related areas
```

## How to Define Tasks Per Type

### [DATABASE] Tasks
Scope: Changes to the data model and seed data only.
For relational databases, also includes a migration file.
For NoSQL/schema-less databases, no migration is required.

Include in description:
- The entity or entities being added or modified
- The fields, their types, and any constraints
- The enumerated types for categorical fields
- The relationships to other entities (with cardinality)
- The seed data records needed (reference the design doc seed plan)
- Whether a migration file is required (yes for relational, no for NoSQL)

Acceptance criteria should verify:
- Entity can be persisted and retrieved
- Relationships resolve correctly
- Seed data is present and correct
- All enumerated state values are defined
- Migration file is present (relational databases only)

Do NOT include API logic, UI, or test automation.

### [BACKEND] Tasks
Scope: API endpoints and business logic only.

Include in description:
- The specific API endpoints being implemented
  (method, path, request shape, response shape)
- The business rules being enforced (reference BRD FR)
- The authentication and authorisation requirements
- Error responses and their HTTP status codes

Acceptance criteria should verify:
- Each endpoint returns the correct response for valid input
- Each endpoint returns the correct error for invalid input
- Authentication is enforced where required
- Business rules are enforced (e.g. state transitions, capacity limits)

Do NOT include UI or test automation.

### [UNIT-TEST] Tasks
Scope: **Unit tests for the BACKEND layer only** — isolated from the database and UI.
These tasks are implemented by `unit-test-agent`, NOT `implement-agent`.
There is exactly one UNIT-TEST task per BACKEND task.

Include in description:
- The BACKEND task this covers (reference by task ID)
- The API endpoints whose logic will be unit tested
- The business rules and error scenarios to cover
- The mocking strategy (data access layer is mocked — no real database)

Acceptance criteria should verify:
- Happy path: each endpoint returns the correct status and response shape
- Invalid input: each endpoint returns the correct 4xx error
- Unauthenticated request: each protected endpoint returns 401
- Business rule violations: correct error returned when a rule is broken
- All data access calls are mocked — no real database is hit
- Test file saved to `unit_tests_folder` defined in `workshop-stack.md`

Do NOT include UI logic, E2E test scenarios, or implementation code.

### [FRONTEND] Tasks
Scope: UI components and pages only.

Include in description:
- The page or component being built
- The API endpoints it consumes (from the design doc)
- The user interactions it supports
- The test identifiers (e.g. data-testid values) from the design doc —
  these must match exactly

Acceptance criteria should verify:
- Component renders correctly with valid data
- User interactions trigger the correct behaviour
- Error states are handled and displayed
- All test identifiers are present on interactive elements

Do NOT include API logic or test automation.

### [E2E-TEST] Tasks
Scope: **Playwright end-to-end tests only** — browser-level user journey tests.
These tasks are implemented by `playwright-agent`, NOT `implement-agent`.

> **Do not confuse with UNIT-TEST tasks.** UNIT-TEST tasks cover the BACKEND API in
> isolation. E2E-TEST tasks cover the full stack through the browser.

Include in description:
- The user story acceptance criteria being covered
- The user journey being tested end to end in the browser
- The `data-testid` selectors used to locate elements (from the design doc)
- The expected outcomes being asserted

Acceptance criteria should verify:
- Happy path scenario passes end to end in the browser
- Key error scenarios are covered
- Tests use only the `data-testid` values defined in the design doc
- Test file is saved to `e2e_tests_folder` defined in `workshop-stack.md`

Do NOT include implementation logic.
Do NOT describe unit test coverage — that is a separate UNIT-TEST task.

## Dependency Rules
- Every BACKEND task depends on its corresponding DATABASE task.
- Every UNIT-TEST task depends on its corresponding BACKEND task (1:1 relationship).
- Every FRONTEND task depends on its corresponding UNIT-TEST task.
- Every E2E-TEST task depends on its corresponding FRONTEND task.
- Cross-story dependencies: if story B requires data created by
  story A, the DATABASE task of B depends on the DATABASE task of A.
- Record dependencies in the `dependencies` frontmatter field using
  the task ID.

## Global Numbering
Tasks are numbered globally in implementation order:
1. All DATABASE tasks across all stories (01, 02, 03...)
2. All BACKEND tasks across all stories (continuing the sequence)
3. All UNIT-TEST tasks across all stories (continuing the sequence)
4. All FRONTEND tasks across all stories (continuing)
5. All E2E-TEST tasks across all stories (continuing)

This ensures the natural implementation order is visible in the
file system sort order.

## Naming Conventions
- Task titles in the file name describe the subject concisely.
  (e.g. `appointment-model`, `appointment-api`, `booking-form`)
- The type prefix in the title uses square brackets: `[DATABASE]`.
- Use domain entity names — not generic names like `model` or `page`.

## What NOT to Include
- Do NOT add effort estimates — estimation is handled by estimate-agent.
- Do NOT prescribe specific technologies, ORMs, frameworks, or libraries.
- Do NOT describe how to implement — describe what to implement.
- Do NOT create tasks for work not traceable to a user story.
- Do NOT omit the UNIT-TEST task — every BACKEND task must have a corresponding UNIT-TEST task.
- Do NOT omit the E2E-TEST task — every story needs automated Playwright test coverage.

## Validation Checklist
Before saving, verify:
- [ ] Every story has at least 4 tasks (BACKEND + UNIT-TEST + FRONTEND + E2E-TEST minimum)
- [ ] Every BACKEND task has exactly one corresponding UNIT-TEST task
- [ ] Every story has exactly one E2E-TEST task
- [ ] Task types are correct and match their content
- [ ] Global numbering is sequential and follows type order
- [ ] Dependencies are correctly recorded in frontmatter
- [ ] Every parent story file has its `tasks` field updated
- [ ] Domain language is used throughout — no generic names
- [ ] No effort estimates appear anywhere in the files
- [ ] File naming convention is correct

## Example

For `story-03-02-01-book-appointment-slot.md`:

**Tasks produced:**
```
01-DATABASE-appointment-model.md
05-BACKEND-appointment-api.md
10-UNIT-TEST-appointment-api.md
15-FRONTEND-appointment-booking-form.md
20-E2E-TEST-book-appointment.md
```

**Example file — `05-BACKEND-appointment-api.md`:**
```markdown
---
id: 05-BACKEND-appointment-api
title: [BACKEND] Appointment API
type: task
taskType: BACKEND
userStory: story-03-02-01
feature: feature-03-02
epic: epic-03
status: ready
dependencies: [01-DATABASE-appointment-model]
---

# [BACKEND] Appointment API

## Description
Implement the API endpoints for creating and retrieving Appointments
as defined in the design document. The POST endpoint creates an
Appointment in SCHEDULED state. The GET endpoint returns the
Appointment details for a given ID. Both endpoints require
authentication. The POST endpoint enforces the business rule that
the requested slot must be available at the time of booking (FR-006).

## Acceptance Criteria
- [ ] POST /api/appointments creates an Appointment with status
      SCHEDULED and returns 201 with the appointment record
- [ ] POST /api/appointments returns 409 if the requested slot
      is no longer available
- [ ] POST /api/appointments returns 401 if the request is
      not authenticated
- [ ] GET /api/appointments/:id returns the Appointment record
      for the authenticated Patient who owns it
- [ ] GET /api/appointments/:id returns 404 if the Appointment
      does not exist or does not belong to the requesting Patient

## Definition of Done
- All acceptance criteria above are verified
- Code is reviewed and meets team standards
- No regressions introduced in related areas
```
