# Workshop Stack Configuration

> **FACILITATOR — fill in the block below before running `design-agent`.**
> Need help? See [docs/STACK-SETUP-GUIDE.md](docs/STACK-SETUP-GUIDE.md) for step-by-step instructions and ready-to-copy examples (Python, Java, C#, and more).

---

```
# ── LANGUAGE ─────────────────────────────────────────────────────────────────
language:             TypeScript

# ── BACKEND ──────────────────────────────────────────────────────────────────
runtime:              Node.js 20
framework:            Express
build_tool:           npm
base_package:         stationery-inventory
entry_point:          src/server.ts
routes_folder:        src/routes/
controllers_folder:   src/services/
middleware_folder:    src/middleware/
auth_middleware:      src/middleware/auth.ts

# ── DATABASE ──────────────────────────────────────────────────────────────────
database:             SQLite
orm:                  Prisma
schema_file:          prisma/schema.prisma
migrations_folder:    prisma/migrations/
seed_file:            prisma/seed.ts
api_error_format:     "{ message: string, status: number, timestamp: string }"

# ── FRONTEND ──────────────────────────────────────────────────────────────────
frontend_framework:   React
bundler:              Vite
pages_folder:         src/frontend/src/pages/
components_folder:    src/frontend/src/components/
services_folder:      src/frontend/src/services/
context_folder:       src/frontend/src/context/

# ── TESTING ───────────────────────────────────────────────────────────────────
unit_test_framework:  Jest
unit_tests_folder:    src/__tests__/
e2e_test_framework:   Playwright
e2e_tests_folder:     e2e/
dev_server_url:       http://localhost:3000

# ── TEST USER CREDENTIALS ─────────────────────────────────────────────────────
# Used by Playwright E2E tests — must match a user in your seed file
test_user_email:      admin@stationery.local
test_user_password:   Admin@1234

# ── WORKSHOP DEMO CONSTRAINTS ─────────────────────────────────────────────────
# Uncomment for live workshop demos to keep task output tight and implementable
# within a time-bounded session. Leave commented out for full project use.
# max_ac_per_task: 2
```
