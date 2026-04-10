---
name: create-scaffold
description: Generates the initial project folder structure, entry point files,
  and dependency manifest for any tech stack defined in workshop-stack.md. Use
  when asked to scaffold the project, generate the initial structure, or set up
  the project before implementation begins.
---

# Skill — Create Scaffold

## What You Do
Read `workshop-stack.md` and generate a minimal but complete project
scaffold — the folder structure, entry point files, dependency manifest,
and configuration files — so that `implement-agent` can immediately
start writing feature code without any manual setup.

The scaffold contains only the skeleton. No business logic, no domain
entities, no feature routes. Those are added by `implement-agent`.

---

## Steps

### Step 1 — Read Stack Configuration
Read `workshop-stack.md` in full. Extract:
- `language` and `runtime` — determines file extensions and idioms
- `framework` — determines scaffold structure and boilerplate
- `build_tool` — determines dependency manifest file
- `base_package` — required for Java and C# to set namespace
- All folder paths: `entry_point`, `routes_folder`, `controllers_folder`,
  `middleware_folder`, `entities_folder` / `schema_file`, `migrations_folder`,
  `seed_file`, `pages_folder`, `components_folder`, `services_folder`,
  `unit_tests_folder`, `e2e_tests_folder`
- `Pre-Built` section — list of files the facilitator has already provided;
  never overwrite these

### Step 2 — Check What Already Exists
Before creating anything, check which paths from `workshop-stack.md`
already exist in the workspace. Only create what is missing.
Never overwrite a file that already exists — this skill is additive only.

### Step 3 — Generate the Scaffold

Produce **only** the files listed below. Do not add business logic,
domain entities, or feature-specific routes.

#### 3a — Dependency Manifest
One file at the project root, format determined by `build_tool`:

| Build Tool | File | Content |
|------------|------|---------|
| npm / Node.js | `package.json` | name, version, empty scripts block, no dependencies |
| pip | `requirements.txt` | framework and test framework packages only |
| poetry | `pyproject.toml` | [tool.poetry] block with framework dependencies |
| Maven | `pom.xml` | minimal pom with framework parent and compiler plugin |
| Gradle | `build.gradle` or `build.gradle.kts` | minimal dependencies block |
| dotnet | `{AppName}.csproj` | minimal SDK project file |

#### 3b — Backend Entry Point
One file at `entry_point` from `workshop-stack.md`.
Content: minimal application setup — server start, middleware registration
placeholder, no routes. Follow the framework's canonical minimal example.

Examples by framework:
- **Express.js**: `const app = express(); app.listen(3000)`
- **FastAPI**: `app = FastAPI(); uvicorn.run(app)`
- **Spring Boot**: `@SpringBootApplication public class Application`
- **ASP.NET Core**: `var builder = WebApplication.CreateBuilder(args); app.Run()`

#### 3c — Folder Structure
Create these empty folders (with a `.gitkeep` file if the folder has no
generated files yet):
- `routes_folder`
- `controllers_folder`
- `middleware_folder`
- `entities_folder` or directory containing `schema_file` (whichever applies)
- `migrations_folder` (only if defined — relational databases only)
- `unit_tests_folder`

#### 3d — Frontend Entry Point
One file at `pages_folder` and one at `components_folder` (empty index
or barrel file). One file at `services_folder` (empty module).
If `bundler` is defined, generate the bundler config file
(`vite.config.ts`, `webpack.config.js`, etc.) with minimal settings.

#### 3e — Seed File Stub
Create an empty or minimal `seed_file` with a comment indicating where
seed data records should be added by `implement-agent`.

#### 3f — Playwright Config
If `e2e_tests_folder` is defined and `playwright.config.ts` does not
already exist, generate a minimal `playwright.config.ts` at the project
root:
```typescript
import { defineConfig } from '@playwright/test'
export default defineConfig({
  testDir: './{e2e_tests_folder}',
  use: { baseURL: '{dev_server_url}' },
  reporter: [['html', { outputFolder: 'docs/test-reports' }]]
})
```
Substitute `e2e_tests_folder` and `dev_server_url` from `workshop-stack.md`.

### Step 4 — Generate a README stub
Create `README.md` at the project root with:
- Project name (from BRD if available, otherwise from `workshop-stack.md`)
- Stack summary (language, framework, database, test frameworks)
- How to install dependencies (derived from `build_tool`)
- How to run the development server (derived from `entry_point`)
- How to run unit tests (derived from `unit_test_framework`)
- How to run E2E tests (`npx playwright test`)

### Step 5 — Update workshop-stack.md Pre-Built Section
After generating the scaffold, update the `Pre-Built — Never Rebuild These`
section of `workshop-stack.md` to list every file just created, so that
`implement-agent` and `review-agent` know not to overwrite them.

---

## Do Not Do This

- Do NOT generate domain entities, feature routes, or business logic
- Do NOT overwrite files listed in the `Pre-Built` section of `workshop-stack.md`
- Do NOT overwrite any file that already exists in the workspace
- Do NOT install packages or run build commands — generate files only
- Do NOT add test user credentials — those go in `workshop-stack.md` manually

---

## Output Summary

After generating all files, provide:
- A tree view of every file created
- The command to install dependencies (e.g. `npm install`, `pip install -r requirements.txt`, `mvn install`)
- The command to start the development server
- Confirmation that `workshop-stack.md` Pre-Built section is updated
