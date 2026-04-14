# Workshop Stack Configuration

> **FACILITATOR — fill in the block below before running `@design-agent`.**
> Need help? See [docs/STACK-SETUP-GUIDE.md](docs/STACK-SETUP-GUIDE.md) for step-by-step instructions and ready-to-copy examples (Python, Java, C#, and more).

---

```
# ── LANGUAGE ───────────────────────────────────────────────────────────────────
language:             {e.g. Python | Java | C# | TypeScript | Go | Ruby}
# strict_mode: true                    # OPTIONAL — TypeScript or Kotlin only

# ── BACKEND ────────────────────────────────────────────────────────────────────
runtime:              {e.g. Python 3.11+  |  Java 21  |  .NET 8  |  Node.js  |  Go 1.22}
framework:            {e.g. FastAPI  |  Spring Boot  |  ASP.NET Core  |  Express.js  |  Gin}
entry_point:          {path to the file that starts your app — e.g. src/backend/main.py}
routes_folder:        {path to where your API routes or endpoints are defined}
controllers_folder:   {path to business logic or service classes}
middleware_folder:    {path to middleware or filter classes}
auth_middleware:      {path to the authentication middleware file}

# ── DATABASE ───────────────────────────────────────────────────────────────────
database:             {e.g. PostgreSQL  |  MySQL  |  SQLite  |  SQL Server  |  MongoDB  |  CosmosDB}
orm:                  {e.g. SQLAlchemy  |  JPA / Hibernate  |  EF Core  |  MongoRepository}
entities_folder:      {path to model or entity class files — omit if you use a single schema file}
seed_file:            {path to seed script or data file — required for ALL database types}
# schema_file: {path}          # OPTIONAL — single-file ORMs only (e.g. Prisma schema.prisma)
# migrations_folder: {path}    # OPTIONAL — RELATIONAL DATABASES ONLY (PostgreSQL, MySQL, SQL Server)
                               #            Omit for MongoDB, CosmosDB, DynamoDB, Firestore

# ── FRONTEND ───────────────────────────────────────────────────────────────────
frontend_framework:   {e.g. React  |  Vue  |  Angular  |  Blazor  |  Thymeleaf}
pages_folder:         {path to page-level views or components}
components_folder:    {path to reusable UI components}
services_folder:      {path to API client or service files}
# bundler: {e.g. Vite | Webpack}       # OPTIONAL — omit for server-rendered stacks (Blazor, Thymeleaf)
# context_folder: {path}               # OPTIONAL — shared state (React Context, Vuex, NgRx, etc.)

# ── TESTING ────────────────────────────────────────────────────────────────────
unit_test_framework:  {e.g. pytest  |  JUnit 5  |  xUnit  |  Jest  |  NUnit  |  RSpec}
unit_tests_folder:    {path to unit test files}
e2e_test_framework:   Playwright
e2e_tests_folder:     e2e/
dev_server_url:       {URL your app runs on — e.g. http://localhost:3000}

# ── BUILD & PACKAGE ────────────────────────────────────────────────────────────
# build_tool: {Maven | Gradle | dotnet | pip | poetry}   # Required for Java and C# stacks
# base_package: {com.example.appname}                    # Required for Java and C# stacks

# ── PRE-BUILT FILES — DO NOT MODIFY ────────────────────────────────────────────
# List files the agents must never overwrite (e.g. pre-built auth or config files)
# pre_built:
#   - {file path}    # {what it does}
#   - {file path}    # {what it does}

# ── TEST USER CREDENTIALS ──────────────────────────────────────────────────────
# Used by Playwright E2E tests — must match a user in your seed file
# test_user_email:    {test-user@example.com}
# test_user_password: {testpassword}

# ── WORKSHOP DEMO CONSTRAINTS ────────────────────────────────────────────────────
# Uncomment for live workshop demos to keep task output tight and implementable
# within a time-bounded session. Leave commented out for full project use.
# max_ac_per_task: 2   # Cap acceptance criteria per task at this number.
                       # Priority order when trimming: happy path → auth → top business rule.
```