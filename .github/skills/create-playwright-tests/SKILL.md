---
name: create-playwright-tests
description: Generates Playwright end-to-end test files from Task files, User Story
  acceptance criteria, and the design document. Use when asked to create Playwright
  tests, generate E2E tests, or produce automated browser tests for the application.
---

# Skill — Create Playwright Tests

## What You Do
Read the E2E-TEST task files, User Story acceptance criteria, and the design
document to produce a complete set of Playwright end-to-end test files that
verify the application behaves correctly from the user's perspective.

Each test file maps to one E2E-TEST task from `issues/`. Tests use `data-testid`
selectors defined in the design document, cover the happy path and key error
scenarios, and are structured so they can be executed against a running
application using the Playwright MCP server.

---

## Prerequisites — Read Before Writing Any Test

1. **`workshop-stack.md`** — extract:
   - `e2e_tests_folder` — where test files are saved
   - `e2e_test_framework` — confirm Playwright is configured
   - `baseURL` (from `playwright.config.ts`) — the application base URL
   - Any pre-built auth helper or fixture paths

2. **`playwright.config.ts`** — understand:
   - `testDir` — where tests live
   - `baseURL` — target application URL
   - `projects` — browser targets
   - Reporter configuration

3. **`docs/design/design-doc.md`** — extract:
   - All `data-testid` values for interactive elements
   - User flows (sequence diagrams) for each feature
   - API endpoint paths used by the UI

4. **`docs/requirements/BRD.md`** — validate:
   - Domain entity names (use verbatim in test descriptions)
   - User role names (use verbatim in `test.describe` blocks)
   - Business rules that must be verified by tests

5. **The E2E-TEST task file in `issues/`** for each test being written — extract:
   - Acceptance criteria to cover
   - Parent User Story for context
   - Dependencies (which FRONTEND/BACKEND tasks must be complete first)

---

## Test File Naming and Location

Save all test files to the `e2e_tests_folder` defined in `workshop-stack.md`
(default: `e2e/`).

Name each file using the kebab-case feature name:
```
e2e/{feature-name}.spec.ts
```

Examples:
```
e2e/member-login.spec.ts
e2e/book-catalogue.spec.ts
e2e/loan-management.spec.ts
e2e/reservation.spec.ts
```

One spec file per feature area. Group related user stories as `describe`
blocks within the spec file. Do not create one file per user story — that
produces too many fine-grained files.

If a spec file already exists, append new `test.describe` blocks to it
rather than overwriting the entire file.

---

## Test File Structure

Every test file must follow this exact structure:

```typescript
import { test, expect } from '@playwright/test'

/**
 * Feature: {Feature Name}
 * BRD References: {FR-XXX, FR-YYY}
 * Stories covered: {story-ids}
 */

test.describe('{Role Name} — {Feature Name}', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to the relevant starting URL
    // If authentication is required, use the shared auth helper
    // Do NOT re-implement login logic — import from the auth fixture
  })

  // Happy path
  test('should {verb} {domain object} successfully', async ({ page }) => {
    // Arrange — navigate, set up preconditions
    // Act — interact with UI using data-testid selectors
    // Assert — verify outcome using expect()
  })

  // Error / edge case
  test('should show error when {invalid condition}', async ({ page }) => {
    // ...
  })

})
```

---

## Selector Rules

**Always use `data-testid` selectors** from the design document.
Never use CSS classes, element tags, or positional selectors.

```typescript
// CORRECT
await page.getByTestId('submit-loan-button').click()
await page.getByTestId('book-title-input').fill('The Great Gatsby')
await expect(page.getByTestId('loan-status-badge')).toHaveText('Active')

// WRONG — never do this
await page.click('.btn-primary')
await page.click('button:nth-child(2)')
await page.fill('input[name="title"]')
```

If a `data-testid` is not defined in the design document for an element
that a test needs to interact with, note it as a comment:
```typescript
// TODO: design doc does not define data-testid for {element} — add to design doc
```
Do not invent `data-testid` values not in the design document.

---

## Authentication in Tests

Read `workshop-stack.md` for the pre-built auth helper path.

If the application requires authentication, use the shared fixture:
```typescript
// Import from the pre-built auth fixture — do NOT re-implement login
import { authenticatedPage } from '../e2e/fixtures/auth'

test.use({ storageState: 'e2e/.auth/user.json' })
```

If no auth fixture exists yet, add a `test.beforeEach` that navigates
to the login page and performs login using the seed user credentials
from `workshop-stack.md`.

Never hardcode passwords in test files. Reference environment variables
or the seed data comment:
```typescript
// Seed user: see seed data location defined in workshop-stack.md
await page.getByTestId('email-input').fill(process.env.TEST_USER_EMAIL ?? 'test@example.com')
```

> **Note:** E2E test files are always TypeScript (`.spec.ts`) regardless of the
> backend language. This is intentional — Playwright TypeScript tests work
> against any backend (Node.js, Java, Python, C#, etc.).

---

## Coverage Requirements

For each E2E-TEST task, write tests that cover:

### Mandatory Coverage
| Scenario | Required |
|----------|----------|
| Happy path — successful completion of the user story | ✅ Always |
| Form validation — required field missing | ✅ If form present |
| Not found / empty state — no records exist | ✅ If list present |
| Unauthorised access — redirect to login | ✅ If auth-protected |
| Error feedback visible to the user | ✅ If API can fail |

### Optional Coverage (add if AC specifies)
- Pagination / infinite scroll behaviour
- Sort and filter interactions
- Concurrent edit conflicts
- Specific business rule enforcement (e.g. cannot borrow if overdue)

---

## Assertion Patterns

Use specific, readable assertions. Do not rely only on `toBeVisible()`.

```typescript
// Verify a record appears in a list
await expect(page.getByTestId('book-list-item').filter({ hasText: 'The Great Gatsby' })).toBeVisible()

// Verify a status field shows the correct value
await expect(page.getByTestId('loan-status-badge')).toHaveText('Active')

// Verify navigation to a new page
await expect(page).toHaveURL(/\/loans\/\d+/)

// Verify an error message
await expect(page.getByTestId('form-error-message')).toContainText('required')

// Verify a count
await expect(page.getByTestId('catalogue-item')).toHaveCount(3)
```

---

## Running Tests via Playwright MCP

When the Playwright MCP server is available, tests can be run directly
from the agent using MCP tool calls. The agent may:

1. **Start the application** (if not already running)
2. **Run a specific test file**: invoke the Playwright MCP
   `playwright_navigate` and interaction tools to validate behaviour interactively
3. **Run the full test suite**: invoke the terminal to run `npx playwright test`
4. **Read the HTML report**: generated at `docs/test-reports/` (per `playwright.config.ts`)

When using Playwright MCP tools for interactive validation:

```
Tool: playwright_navigate   → Navigate to page URL
Tool: playwright_click      → Click an element (prefer getByTestId)
Tool: playwright_fill       → Fill an input field
Tool: playwright_screenshot → Capture screenshot for verification
Tool: playwright_evaluate   → Run JavaScript in page context
```

**Important:** Playwright MCP tool usage is for interactive validation only.
The canonical test output is the `.spec.ts` file — not the MCP session.
Always save the `.spec.ts` file regardless of whether MCP was used to validate.

---

## Playwright MCP Configuration

The Playwright MCP server must be configured in VS Code before use.
See `docs/playwright-mcp-setup.md` for full setup instructions.

The agent reads `docs/playwright-mcp-setup.md` to understand:
- How the MCP server is started
- Available tool names and their parameters
- Browser context configuration
- How to pass `baseURL` to the MCP server

---

## Steps

1. Read all files listed in [Prerequisites](#prerequisites--read-before-writing-any-test).
2. List all E2E-TEST task files in `issues/` — identify which user stories they cover.
3. Group E2E-TEST tasks by feature area to determine which spec files to create.
4. For each spec file:
   a. Extract `data-testid` values from the design document for the feature.
   b. Map each acceptance criterion from the story to one or more test cases.
   c. Write the test file following the [Test File Structure](#test-file-structure).
   d. Apply [Selector Rules](#selector-rules) throughout.
   e. Apply [Coverage Requirements](#coverage-requirements) to ensure completeness.
5. Save each file to `e2e_tests_folder` with the naming convention above.
6. If `package.json` does not already have a `test:e2e` script, add:
   ```json
   "test:e2e": "playwright test"
   ```
7. Report which spec files were created and which E2E-TEST tasks they cover.

---

## Output Summary Format

After saving all test files, report:

```
Playwright tests written:

  e2e/{feature-name}.spec.ts
    Covers: story-{id}, story-{id}
    Tests:  {N} test cases ({happy path count} happy path, {error count} error scenarios)
    BRD:    FR-XXX, FR-YYY

  ...

Run tests:        npx playwright test
View HTML report: npx playwright show-report docs/test-reports
```

---

## What Not To Do

- Do not test pre-built authentication flows unless the E2E-TEST task explicitly requires it
- Do not write unit tests — this skill produces E2E tests only
- Do not use CSS class selectors, tag selectors, or positional selectors
- Do not hardcode `data-testid` values — always read them from the design document
- Do not duplicate test logic already in other spec files — import shared helpers instead
- Do not assert on implementation details (e.g. HTTP status codes in the UI) — assert on user-visible outcomes
- Do not leave `test.only` or `test.skip` in committed files
