# Workshop Stack Configuration

This file defines the technology stack for the workshop.
It is read by the implement-task skill during code implementation.
Update this file before the workshop to match the customer's stack.

---

## Language

```
language: TypeScript
strict_mode: true
```

---

## Backend

```
runtime: Node.js
framework: Express.js
entry_point: src/backend/index.ts
routes_folder: src/backend/routes/
controllers_folder: src/backend/controllers/
middleware_folder: src/backend/middleware/
auth_middleware: src/backend/middleware/auth.ts
```

### API Conventions
- All API routes are prefixed with `/api/`
- All errors return `{ error: string }` with correct HTTP status
- All protected routes use the existing auth middleware
- Async/await — no raw promises
- No `any` in TypeScript

---

## Database

```
orm: Prisma
schema_file: src/backend/prisma/schema.prisma
seed_file: src/backend/prisma/seed.ts
migrations_folder: src/backend/prisma/migrations/
database: SQLite
```

### Schema Conventions
- Never modify pre-existing models marked `// PRE-BUILT`
- New models must be marked `// NEW`
- All categorical fields use Prisma enums — never plain strings
- Every relation must have both sides defined

---

## Frontend

```
framework: React
bundler: Vite
entry_point: src/frontend/src/main.tsx
pages_folder: src/frontend/src/pages/
components_folder: src/frontend/src/components/
services_folder: src/frontend/src/services/
context_folder: src/frontend/src/context/
```

### Frontend Conventions
- Functional components with hooks only — no class components
- All interactive elements must have `data-testid` attributes
- `data-testid` values must match exactly what is defined in the design doc
- API calls go in the services folder — not inline in components
- Use existing auth context — do not rebuild authentication

---

## Testing

```
unit_test_framework: Jest
unit_tests_folder: src/backend/__tests__/
e2e_test_framework: Playwright
e2e_tests_folder: e2e/
```

### Test Conventions
- Unit tests cover API endpoints and business logic
- E2E tests use `data-testid` selectors from the design doc
- E2E tests cover the happy path and at least one error scenario
- Never test pre-built auth functionality

---

## Pre-Built — Never Rebuild These

The following files are pre-built and must not be modified
unless a task explicitly requires it:

```
src/backend/middleware/auth.ts       JWT auth middleware
src/backend/routes/auth.ts          Auth routes
src/backend/index.ts                Express app entry point
src/frontend/src/main.tsx           React app entry point
src/frontend/src/App.tsx            Router and auth guard
src/frontend/src/components/Navbar.tsx  Navigation shell
```

The User model in `src/backend/prisma/schema.prisma` is pre-built.
Do not modify it. Extend it with relations only if required by the task.

---

## Test User Credentials

```
email:    test@example.com
password: password123
```

Use these credentials in E2E tests — do not create new test users.

---

## Customisation Notes

To adapt this file for a different stack, replace the values above.
Examples:

**Python + FastAPI + SQLAlchemy + Vue:**
```
language: Python
framework: FastAPI
orm: SQLAlchemy
frontend_framework: Vue
e2e_test_framework: Playwright
```

**C# + .NET + Entity Framework + Angular:**
```
language: C#
framework: ASP.NET Core
orm: Entity Framework Core
frontend_framework: Angular
unit_test_framework: xUnit
e2e_test_framework: Playwright
```

The implement-task skill reads this file and adapts its output
to whatever stack is defined here.
