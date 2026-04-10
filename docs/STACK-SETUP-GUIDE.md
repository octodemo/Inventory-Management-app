# Stack Setup Guide

Use this guide to fill in `workshop-stack.md` before starting the workshop.

---

## What Is workshop-stack.md?

It is a single configuration file that tells all the agents what tech stack you are
using — your language, framework, database, frontend, and test setup.
You fill it in once, before Step 2 (Design), and the agents read it automatically
from that point forward.

**Any language, framework, database, and frontend combination is supported.**
The agents adapt entirely to whatever you configure.

---

## How to Fill It In

**Step 1 — Open `workshop-stack.md`** in the editor.
You will see one configuration block with `{placeholder}` values.

**Step 2 — Does your stack match one of the examples below?**

✅ **YES — it matches (or is close to) one of the examples here**
1. Find the closest example in this guide
2. Copy its entire code block (everything between the ` ``` ` lines)
3. Go back to `workshop-stack.md`
4. Select everything inside the code block (between the ` ``` ` markers)
5. Paste your copied block — replacing the placeholders
6. Update any path values to match your actual project folder structure

🔧 **NO — my stack is different**
1. Stay in `workshop-stack.md`
2. Edit each `{placeholder}` value directly
3. Lines starting with `#` are optional — uncomment and fill in if they apply, or delete them
4. The `{e.g. ...}` hints show you what kind of value goes in each field

---

## Quick Reference — What Each Field Means

| Field | What to put there |
|---|---|
| `language` | The programming language — e.g. Python, Java, C#, TypeScript |
| `runtime` | The runtime version — e.g. Python 3.11+, Java 21, .NET 8 |
| `framework` | The backend web framework — e.g. FastAPI, Spring Boot, ASP.NET Core |
| `entry_point` | The file that starts your backend app |
| `routes_folder` | Where your API endpoints / controllers are defined |
| `controllers_folder` | Where your business logic or service classes live |
| `middleware_folder` | Where middleware or filter classes live |
| `auth_middleware` | The specific file that handles authentication checks |
| `database` | The database engine — e.g. PostgreSQL, MongoDB |
| `orm` | The ORM or data access tool — e.g. SQLAlchemy, EF Core |
| `entities_folder` | Where your model/entity class files are (one file per model) |
| `schema_file` | Schema file path — only for ORMs that use a single file (e.g. Prisma) |
| `migrations_folder` | Where migration files are stored — **relational databases only** |
| `seed_file` | Script or file that populates the database with initial data |
| `frontend_framework` | Frontend framework — e.g. React, Vue, Angular |
| `pages_folder` | Where page-level views or route components live |
| `components_folder` | Where reusable UI component files live |
| `services_folder` | Where API client / service files live |
| `unit_test_framework` | Unit test framework — e.g. pytest, JUnit 5, xUnit |
| `unit_tests_folder` | Where unit test files are stored |
| `dev_server_url` | The URL your app runs on locally — e.g. `http://localhost:3000` |

---

## Example 1 — Python + FastAPI + SQLAlchemy + React

```
language: Python
runtime: Python 3.11+
framework: FastAPI
entry_point: src/backend/main.py
routes_folder: src/backend/routers/
controllers_folder: src/backend/services/
middleware_folder: src/backend/middleware/
auth_middleware: src/backend/middleware/auth.py
database: PostgreSQL
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

## Example 2 — Java + Spring Boot + JPA/Hibernate + Angular

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
database: PostgreSQL
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

## Example 3 — C# + ASP.NET Core + Entity Framework Core + Vue

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
database: SQL Server
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

---

## My stack is not listed — what do I do?

Fill in the `workshop-stack.md` placeholders directly. The examples above are
common starting points — not a closed list. The agents support any stack.

Use the Quick Reference table above if you are unsure what a field means.
If a field genuinely does not apply to your stack (e.g. `migrations_folder`
for a NoSQL database), delete that line or leave it commented out.
