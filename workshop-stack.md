# Workshop Stack Configuration

> **FACILITATOR — fill in the block below before running `design-agent`.**
> Need help? See [docs/STACK-SETUP-GUIDE.md](docs/STACK-SETUP-GUIDE.md) for step-by-step instructions and ready-to-copy examples (Python, Java, C#, and more).

---

```
# ── LANGUAGE ─────────────────────────────────────────────────────────────────
language:             C#

# ── BACKEND ──────────────────────────────────────────────────────────────────
runtime:              .NET 8
framework:            ASP.NET Core
build_tool:           dotnet
base_package:         StationeryInventory
entry_point:          src/Backend/Program.cs
routes_folder:        src/Backend/Controllers/
controllers_folder:   src/Backend/Services/
middleware_folder:    src/Backend/Middleware/
auth_middleware:      src/Backend/Middleware/JwtMiddleware.cs

# ── DATABASE ──────────────────────────────────────────────────────────────────
database:             SQL Server
orm:                  Entity Framework Core
entities_folder:      src/Backend/Models/
migrations_folder:    src/Backend/Migrations/
seed_file:            src/Backend/Data/DataSeeder.cs
api_error_format:     "{ title: string, status: int, traceId: string }"

# ── FRONTEND ──────────────────────────────────────────────────────────────────
frontend_framework:   React
bundler:              Vite
pages_folder:         src/frontend/src/pages/
components_folder:    src/frontend/src/components/
services_folder:      src/frontend/src/services/
context_folder:       src/frontend/src/context/

# ── TESTING ───────────────────────────────────────────────────────────────────
unit_test_framework:  xUnit
unit_tests_folder:    src/Backend.Tests/
e2e_test_framework:   Playwright
e2e_tests_folder:     e2e/
dev_server_url:       http://localhost:5000

# ── TEST USER CREDENTIALS ─────────────────────────────────────────────────────
# Used by Playwright E2E tests — must match a user in your seed file
test_user_email:      admin@stationery.local
test_user_password:   Admin@1234

# ── WORKSHOP DEMO CONSTRAINTS ─────────────────────────────────────────────────
# Uncomment for live workshop demos to keep task output tight and implementable
# within a time-bounded session. Leave commented out for full project use.
# max_ac_per_task: 2
```
