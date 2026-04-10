# Workshop Stack Configuration

> **FACILITATOR ACTION REQUIRED — Update this file before Step 2 (Design) in `docs/COMPLETE-WORKSHOP-FLOW.md`.**
> This file is read automatically by the design-agent, task-agent, and implement-agent.
> If you do not update it before running the design-agent, the generated design document,
> task file paths, and implementation code will not match your target tech stack.
> Fill in your customer's language, framework, folder structure, and ORM before starting.

This file defines the technology stack for the workshop.
It is read by the implement-task skill during code implementation.
Update this file before the workshop to match the customer's stack.

---

## Language

```
language: {your language — e.g. TypeScript, Python, Java, C#, Go, Ruby}
strict_mode: {true | false — omit if not applicable to the chosen language}
```

---

## Backend

```
runtime: {your runtime — e.g. Node.js, Python 3.11+, Java 21, .NET 8, Go 1.22}
framework: {your framework — e.g. Express.js, FastAPI, Spring Boot, ASP.NET Core}
entry_point: {path to the application entry point file}
routes_folder: {path to route/controller definitions}
controllers_folder: {path to business logic handlers or service classes}
middleware_folder: {path to middleware or filter classes}
auth_middleware: {path to the authentication middleware or filter file}
```

### API Conventions
- All API routes are prefixed with `/api/`
- All protected routes use the authentication middleware defined above
- All errors return the shape defined by `api_error_format` (see Universal Optional Fields)
- Async/concurrency model follows the convention of the chosen language and framework
  (e.g. async/await for Node.js and Python, CompletableFuture for Java, async/await for C#)
- Avoid language-specific anti-patterns (e.g. no `any` in TypeScript, no bare `except` in Python,
  no raw SQL strings without parameterisation in any language)

---

## Database

```
database: {your database — e.g. PostgreSQL, MySQL, SQLite, SQL Server, MongoDB, CosmosDB}
orm: {your ORM or data access pattern — e.g. SQLAlchemy, JPA, EF Core, ActiveRecord, MongoRepository}
schema_file: {path to schema file — for single-file ORMs only; omit for per-class or NoSQL}
entities_folder: {path to entity/model classes — for per-class ORMs; omit for single-file ORMs}
seed_file: {path to seed script, SQL file, or seed data class — required for all databases}
migrations_folder: {path to migrations directory — RELATIONAL DATABASES ONLY; omit for NoSQL/schema-less databases}
```

### Schema Conventions
- Never modify pre-existing models marked `// PRE-BUILT`
- New models must be marked `// NEW`
- All categorical fields use the ORM's enumerated type — never plain strings
- Every relation must have both sides defined

### Migrations
- **Relational databases** (PostgreSQL, MySQL, SQLite, SQL Server, Oracle):
  always generate a migration file when the data model changes
- **NoSQL / schema-less databases** (MongoDB, Cosmos DB, DynamoDB, Firestore):
  no migration files — omit `migrations_folder`; document model changes in comments only

### Seed Data
- Required for ALL database types — relational and NoSQL alike
- Format depends on the database: SQL INSERT statements, JSON documents,
  seed scripts, or a seeder class — as defined in `seed_file`

---

## Frontend

```
framework: {your frontend framework — e.g. React, Vue, Angular, Blazor, Thymeleaf}
bundler: {your bundler if applicable — e.g. Vite, Webpack, esbuild; omit for server-rendered stacks}
entry_point: {path to the frontend entry point file}
pages_folder: {path to page-level components or views}
components_folder: {path to reusable UI components}
services_folder: {path to API service/client files}
context_folder: {path to shared state or context files — omit if not applicable}
```

### Frontend Conventions
- Follow the component model of the chosen framework
  (e.g. functional components + hooks for React, Composition API for Vue,
  component classes for Angular, code-behind for Blazor)
- All interactive elements must have `data-testid` attributes
- `data-testid` values must match exactly what is defined in the design doc
- API calls go in the services folder — not inline in components
- Use existing auth context or session — do not rebuild authentication

---

## Testing

```
unit_test_framework: {your unit test framework — e.g. Jest, pytest, JUnit 5, xUnit, NUnit, RSpec}
unit_tests_folder: {path to unit test files}
e2e_test_framework: Playwright
e2e_tests_folder: e2e/
```

### Test Conventions
- Unit tests cover API endpoints and business logic
- E2E tests use `data-testid` selectors from the design doc
- E2E tests cover the happy path and at least one error scenario
- Never test pre-built auth functionality
- E2E test files are always TypeScript (.spec.ts) regardless of backend language

---

## Universal Optional Fields

These fields are read by the implement-agent, design-agent, and
review-agent. Add only those relevant to your stack.

```
# Server URL used by Playwright when playwright.config.ts does not exist
dev_server_url: http://localhost:3000

# API error response shape — overrides the stack default in design-doc
# api_error_format: "{ error: string }"

# Build tool — required for Java and C# stacks
# build_tool: Maven | Gradle | dotnet | pip | poetry

# Base package namespace — required for Java and C# stacks
# base_package: com.example.appname

# Per-class entity folder — required when entities are individual files
# (JPA, EF Core, SQLAlchemy models)
# entities_folder: src/main/java/com/example/app/entity/

# Migrations location — override if different from ORM default
# migrations_folder: src/main/resources/db/migration/
```

---

## Pre-Built — Never Rebuild These

List the files in your scaffold that must not be modified unless
a task explicitly requires it. Update this list before the workshop.

```
{file path}      {description}
{file path}      {description}
```

---

## Test User Credentials

Update these to match your scaffold's pre-seeded test user.

```
email:    {test-user-email}
password: {test-user-password}
```

Use these credentials in E2E tests — do not create new test users.

---

## Customisation Notes

To adapt this file for a different stack, replace the placeholder values
in the sections above with the values for your stack.
The implement-agent, design-agent, task-agent, and review-agent all read
this file and adapt their output to whatever stack is defined here.
Use the field names that make sense for your stack — agents read the
intent of each field, not just the name.

---

## Reference Examples — Complete Stack Configurations

> **These are EXAMPLES only — do not edit this section.**
> Copy the relevant block into the sections above and fill in your
> project-specific paths. Replace `com.example.appname`, `AppName`,
> and similar placeholders with your actual package or namespace.

---

### Example 1 — Python + FastAPI + SQLAlchemy + React
```
language: Python
runtime: Python 3.11+
framework: FastAPI
entry_point: src/backend/main.py
routes_folder: src/backend/routers/
controllers_folder: src/backend/services/
middleware_folder: src/backend/middleware/
auth_middleware: src/backend/middleware/auth.py
orm: SQLAlchemy
entities_folder: src/backend/models/
migrations_folder: src/backend/alembic/versions/
seed_file: src/backend/seed.py
api_error_format: "{ detail: string }"
build_tool: pip
dev_server_url: http://localhost:8000
unit_test_framework: pytest
unit_tests_folder: src/backend/tests/
e2e_test_framework: Playwright
e2e_tests_folder: e2e/
frontend_framework: React
bundler: Vite
pages_folder: src/frontend/src/pages/
components_folder: src/frontend/src/components/
services_folder: src/frontend/src/services/
```

---

### Example 2 — Java + Spring Boot + JPA/Hibernate + Angular
```
language: Java
runtime: Java 21
framework: Spring Boot
build_tool: Maven
base_package: com.example.appname
entry_point: src/main/java/com/example/appname/Application.java
routes_folder: src/main/java/com/example/appname/controller/
controllers_folder: src/main/java/com/example/appname/service/
middleware_folder: src/main/java/com/example/appname/security/
auth_middleware: src/main/java/com/example/appname/security/JwtFilter.java
orm: JPA / Hibernate
entities_folder: src/main/java/com/example/appname/entity/
migrations_folder: src/main/resources/db/migration/
seed_file: src/main/resources/data.sql
api_error_format: "{ message: string, status: int, timestamp: string }"
dev_server_url: http://localhost:8080
unit_test_framework: JUnit 5
unit_tests_folder: src/test/java/com/example/appname/
e2e_test_framework: Playwright
e2e_tests_folder: e2e/
frontend_framework: Angular
pages_folder: src/frontend/src/app/pages/
components_folder: src/frontend/src/app/components/
services_folder: src/frontend/src/app/services/
```

---

### Example 3 — C# + ASP.NET Core + Entity Framework Core + Vue
```
language: C#
runtime: .NET 8
framework: ASP.NET Core
build_tool: dotnet
base_package: AppName
entry_point: src/Backend/Program.cs
routes_folder: src/Backend/Controllers/
controllers_folder: src/Backend/Services/
middleware_folder: src/Backend/Middleware/
auth_middleware: src/Backend/Middleware/JwtMiddleware.cs
orm: Entity Framework Core
entities_folder: src/Backend/Models/
migrations_folder: src/Backend/Migrations/
seed_file: src/Backend/Data/DataSeeder.cs
api_error_format: "{ title: string, status: int, traceId: string }"
dev_server_url: http://localhost:5000
unit_test_framework: xUnit
unit_tests_folder: src/Backend.Tests/
e2e_test_framework: Playwright
e2e_tests_folder: e2e/
frontend_framework: Vue
bundler: Vite
pages_folder: src/frontend/src/views/
components_folder: src/frontend/src/components/
services_folder: src/frontend/src/services/
```
