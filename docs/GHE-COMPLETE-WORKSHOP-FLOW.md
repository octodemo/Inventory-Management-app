# Complete Agentic SDLC Workshop Flow — GitHub Platform Edition

**Version:** 1.1 (GitHub Issues + GitHub Projects + GitHub Actions)  
**Last Updated:** August 2026  
**Based on:** [COMPLETE-WORKSHOP-FLOW.md](./COMPLETE-WORKSHOP-FLOW.md)

---

## Overview

This workshop demonstrates an end-to-end AI-assisted software development lifecycle using the **GitHub platform natively** — GitHub Issues, GitHub Projects, GitHub Actions, and GitHub Copilot agents at every phase.

**Key difference from the base flow:** Work items (Epics, Features, Stories, Tasks) are created directly as **GitHub Issues** with labels, linked into a **GitHub Project board**, and managed using **GitHub-native tooling** throughout.

---

## Prerequisites

### For All Modes
- VS Code (latest)
- GitHub Copilot extension (signed in)
- [GitHub CLI (`gh`)](https://cli.github.com/) installed and authenticated (`gh auth login`)
- Runtime environment appropriate for the chosen tech stack
- Git

### GitHub Platform Setup (do this once before the workshop)
1. Create a **GitHub Project** (table or board layout) in your org/repo
2. Add custom fields to the Project:
   - `Type` → Single select: `Epic`, `Feature`, `User Story`, `Task`
   - `Priority` → Single select: `must-have`, `should-have`, `could-have`
   - `Effort` → Number field (hours)
   - `Sprint` → Iteration field (2-week sprints)
   - `Task Type` → Single select: `DATABASE`, `BACKEND`, `FRONTEND`, `UNIT-TEST`, `E2E-TEST`
3. Create the following **labels** in the repository:
   - `epic`, `feature`, `user-story`, `task`
   - `database`, `backend`, `frontend`, `unit-test`, `e2e-test`
   - `must-have`, `should-have`, `could-have`

---

## Phase 1: Requirements

### Step 1: Create BRD (Business Requirements Document)

**Agent:** `brd-agent`

```
PM: select brd-agent in Agent dropdown in VS Code and paste your requirement text and press enter

What will BRD agent do:
It will take Input: Requirement Issue or text description
It will generate Output: docs/requirements/BRD.md
```

**Duration:** 5-10 minutes

> 💡 **GitHub Tip:** After `BRD.md` is committed, create a pinned GitHub Issue titled
> `[BRD] {Project Name}` with a link to `docs/requirements/BRD.md` so stakeholders
> can track and comment on requirements directly in GitHub.

---

## Phase 2: Design

> **Before running this step:** Fill in `workshop-stack.md` (repo root) with the customer's
> tech stack — language, framework, folder paths, ORM, and test framework.
> The design-agent reads it to produce stack-aware output.

### Step 2: Create Design Document

**Agent:** `design-agent`

```
Architect: select design-agent in Agent dropdown in VS Code and type "create design from BRD" and press enter.

What Design agent will do:
It will take Input: docs/requirements/BRD.md (primary source)
It will generate Output:
  - docs/design/design-doc.md (architecture, API contracts, data models, components)
  - Data model definitions appropriate to the target tech stack

After running the design-agent, your design-doc.md will have these six sections:
- Architecture Overview (Mermaid diagram)
- Data Model (ER diagram, schema definitions)
- API Endpoints (REST contracts)
- Component Structure (UI component hierarchy)
- Key User Flows (Sequence diagrams)
- Seed Data Plan
```

**Duration:** 10-15 minutes

> 💡 **GitHub Tip:** Commit and push `docs/design/design-doc.md` immediately after generation.
> GitHub renders Mermaid diagrams natively in Markdown — stakeholders can view the
> architecture diagram directly in the browser without any extra tooling.

---

## Phase 3: Work Breakdown (Top-Down Creation)

### Step 3: Create Epics

**Agent:** `epic-agent`

```
PM: epic-agent create epics from design doc

Input: docs/design/design-doc.md
Output: docs/work-items/epics/epic-{nn}-{name}.md
```

**Duration:** 5 minutes

#### ➡️ Push Epics to GitHub Issues

After `epic-agent` finishes, run:

```bash
for file in docs/work-items/epics/epic-*.md; do
  title=$(grep '^title:' "$file" | sed 's/title: //')
  gh issue create \
    --title "$title" \
    --label "epic" \
    --body-file "$file"
done
```

Then add all epic issues to your GitHub Project:
```bash
gh project item-add <project-number> --owner <org> --url <issue-url>
```

---

### Step 4: Create Features (under Epics)

**Agent:** `feature-agent`

```
PM: feature-agent create features for epic-01

Input: design-doc.md, epic files
Output: docs/work-items/features/feature-{nn}-{name}.md
```

**Duration:** 5 minutes

#### ➡️ Push Features to GitHub Issues

```bash
for file in docs/work-items/features/feature-*.md; do
  title=$(grep '^title:' "$file" | sed 's/title: //')
  gh issue create \
    --title "$title" \
    --label "feature" \
    --body-file "$file"
done
```

> 💡 Link each Feature issue to its parent Epic using
> [sub-issues](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/adding-sub-issues):
> ```bash
> gh issue edit <feature-issue-number> --add-sub-issue-of <epic-issue-number>
> ```

---

### Step 5: Create User Stories (under Features)

**Agent:** `user-story-agent`

```
PM: user-story-agent create stories for feature-01

Input: BRD.md, design-doc.md, feature files
Output: docs/work-items/stories/story-{nn}-{name}.md
```

**Duration:** 10 minutes

#### ➡️ Push User Stories to GitHub Issues

```bash
for file in docs/work-items/stories/story-*.md; do
  title=$(grep '^title:' "$file" | sed 's/title: //')
  priority=$(grep '^priority:' "$file" | sed 's/priority: //')
  gh issue create \
    --title "$title" \
    --label "user-story,$priority" \
    --body-file "$file"
done
```

---

### Step 6: Create Tasks (under User Stories)

**Agent:** `task-agent`

```
PM: task-agent create tasks for story-01

Input: design-doc.md, user story files
Output: issues/{order}-{type}-{name}.md

Example files:
  - issues/01-DATABASE-{entity}-model.md
  - issues/02-BACKEND-{entity}-api.md
  - issues/03-UNIT-TEST-{entity}-api.md
  - issues/04-FRONTEND-{entity}-list.md
  - issues/05-E2E-TEST-{entity}.md
```

**Duration:** 10 minutes

#### ➡️ Push Tasks to GitHub Issues

```bash
for file in issues/*.md; do
  title=$(grep '^title:' "$file" | sed 's/title: //')
  type=$(echo "$title" | grep -oP '\[\K[^\]]+' | tr '[:upper:]' '[:lower:]')
  gh issue create \
    --title "$title" \
    --label "task,$type" \
    --body-file "$file"
done
```

> 💡 Link each Task to its parent User Story as a sub-issue in GitHub.

**Result:** Complete work hierarchy in GitHub Issues (Epic → Feature → Story → Task), visible on your GitHub Project board.

---

## Phase 4: Effort Estimation (Bottom-Up)

### Step 7: Estimate All Work

**Agent:** `estimate-agent`

```
PM or Architect: estimate-agent analyze all work

Process:
1. Scans all task files in issues/ folder
2. Assigns effort estimate using heuristics:

   [DATABASE]: 15min – 45min
   [BACKEND]:  30min – 2h
   [FRONTEND]: 30min – 2h
   [UNIT-TEST]: 15min – 30min
   [E2E-TEST]:  15min – 30min

3. Updates each task file with:
   estimatedEffort: 30min

4. Rolls up estimates bottom-up:
   Story → Feature → Epic

5. Generates: docs/reports/effort-estimate-report.html
```

**Duration:** 5 minutes

#### ➡️ Sync Estimates to GitHub Project

After estimation, update the `Effort` field on each task issue in the GitHub Project:

```bash
# Example: set Effort field on a task issue
gh project item-edit \
  --project-id <project-id> \
  --id <item-id> \
  --field-id <effort-field-id> \
  --number <effort-in-hours>
```

---

## Phase 5: Sprint Planning (Capacity-Driven)

### Step 8: Create Sprint Plans

**Agent:** `sprint-planning-agent`

```
PM: sprint-planning-agent create sprint plan

Interactive Questions:
  Q: How many Database developers?   A: 2
  Q: How many Backend/API developers? A: 3
  Q: How many Frontend/UI developers? A: 2
  Q: Hours per sprint per developer?  A: 40h

Output: docs/reports/sprint-plan-report.html
```

**Duration:** 5-10 minutes

#### ➡️ Assign Sprints in GitHub Project

Based on the sprint plan report, assign issues to **Iteration** fields in your GitHub Project:

```bash
# Assign an issue to Sprint 1 iteration
gh project item-edit \
  --project-id <project-id> \
  --id <item-id> \
  --field-id <sprint-iteration-field-id> \
  --iteration-id <sprint-1-iteration-id>
```

> 💡 Use the **GitHub Project board view** (grouped by Sprint iteration) to visually
> review capacity and drag-and-drop stories between sprints.

**Result:** GitHub Project board shows sprint-assigned issues with effort, priority, and status.

---

## Phase 6: Scaffold

### Step 9: Generate Project Scaffold

**Agent:** `scaffold-agent`

> **Run after sprint planning and before implementation.**
> Ensure all `{placeholder}` values in `workshop-stack.md` are filled in.

```
Developer: scaffold-agent generate the project scaffold

Input:  workshop-stack.md
Output: src/ structure, package.json/pom.xml/requirements.txt,
        playwright.config.ts, README.md
```

**Duration:** 5 minutes

#### ➡️ GitHub Actions: CI Setup

After scaffold, add a basic CI workflow so every PR is validated:

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm test
```

---

## Phase 7: Implementation

### Step 10: Implement Tasks

**Agent:** `implement-agent`

Implement in dependency order: DATABASE → BACKEND → UNIT-TEST → FRONTEND → E2E-TEST

```
Developer: implement-agent implement issues/01-DATABASE-{name}.md

Input:
  - issues/{task}.md
  - docs/design/design-doc.md
  - docs/requirements/BRD.md
  - workshop-stack.md

Output: src/{appropriate-folder}/{filename}
```

#### ➡️ GitHub Flow for Each Task

For each task issue, follow this branch-per-issue workflow:

```bash
# 1. Create a branch linked to the issue
gh issue develop <issue-number> --checkout
# Branch name: <issue-number>-task-title

# 2. Implement with implement-agent in VS Code

# 3. Commit and push
git add .
git commit -m "closes #<issue-number>: [DATABASE] Item model"
git push

# 4. Open a Pull Request
gh pr create \
  --title "[DATABASE] Item model (#<issue-number>)" \
  --body "Closes #<issue-number>" \
  --label "database"
```

> 💡 Using `Closes #<issue-number>` in the PR body automatically closes the linked
> issue and moves it to **Done** on the GitHub Project board when the PR is merged.

**On-demand — unit tests after each BACKEND task:**
```
Developer: unit-test-agent generate unit tests for issues/{task}.md
```

**On-demand — code review:**
```
Developer or Lead: review-agent review issues/{task}.md
```

**Duration:** Variable (20-30 min per task)

---

### Step 10b: Start and View the Running Application

> **🎯 This is the customer demo moment.** Run this after all FRONTEND tasks are merged
> so the customer can see the working application in a browser before E2E tests begin.

**Install dependencies and seed data:**

```bash
# Install dependencies
npm install          # Node.js
# pip install -r requirements.txt   (Python)
# dotnet restore                    (.NET)

# Seed the database (if a seed file was generated by scaffold-agent)
npm run seed
# python seed.py   (Python)
# dotnet run --seed   (.NET)
```

**Start the development server:**

```bash
npm run dev
# python app.py        (Python / Flask)
# dotnet run           (.NET)
# mvn spring-boot:run  (Java / Spring)
```

> The app will be available at the `dev_server_url` defined in `workshop-stack.md`
> (also the `baseURL` in `playwright.config.ts`). Default: `http://localhost:3000`

**Open in the browser:**

```bash
# macOS
open http://localhost:3000

# Windows
start http://localhost:3000

# Linux
xdg-open http://localhost:3000
```

> 💡 **Facilitator tip:** Screen-share or take a screenshot of the running app here.
> It confirms the full stack is wired end-to-end and makes the demo tangible for
> stakeholders before automated tests run.

**Duration:** 2-5 minutes

**Result:** ✅ Customer sees the working application running in the browser.

---

## Phase 8: GitHub Issues & Project — Full Sync Summary

This replaces the ADO phase entirely. All work items are native GitHub Issues.

### GitHub Project Board Layout

| View | Purpose |
|---|---|
| **Board (by Status)** | Kanban: Todo → In Progress → In Review → Done |
| **Table (by Sprint)** | Sprint planning and capacity overview |
| **Table (by Type)** | Filter by Epic / Feature / Story / Task |
| **Roadmap** | Timeline view of epics and features |

### Issue Hierarchy (via Sub-issues)

```
Epic Issue
  └── Feature Issue (sub-issue of Epic)
        └── User Story Issue (sub-issue of Feature)
              └── Task Issue (sub-issue of User Story)
```

### Automation (built-in GitHub Project workflows)

Enable these in your Project → Settings → Workflows:
- ✅ **Auto-add items** — when issue is labeled `task`, add to project
- ✅ **Item closed** → set Status to `Done`
- ✅ **Pull request merged** → set linked issue Status to `Done`
- ✅ **Item added** → set Status to `Todo`

---

## Phase 9: E2E Testing with Playwright

### Step 11: Generate and Run Playwright Tests

**Agent:** `playwright-agent`

> **Requirements:**
> - Application running at `baseURL` from `playwright.config.ts` (started in Step 10b)
> - Playwright installed: `npm ci` / `pip install pytest-playwright`

**Step 11a: Generate test files**

```
QA Engineer: playwright-agent create tests for all E2E-TEST tasks

Input:
  - issues/*.md (E2E-TEST task files)
  - docs/design/design-doc.md
  - docs/requirements/BRD.md
  - workshop-stack.md
  - playwright.config.ts

Output: e2e/{feature-name}.spec.ts
```

**Step 11b: Run tests**

```bash
# Run all E2E tests
npx playwright test

# Run in headed mode (see the browser during tests)
npx playwright test --headed

# View HTML report
npx playwright show-report docs/test-reports
```

#### ➡️ GitHub Actions: E2E in CI

```yaml
# .github/workflows/e2e.yml
name: E2E Tests
on: [pull_request]
jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: docs/test-reports/
```

> 💡 The Playwright HTML report is uploaded as a GitHub Actions artifact — accessible
> directly from the PR's Checks tab without any external hosting.

**Duration:** 5-10 minutes

---

## Key Agents Summary

| Agent | Purpose | Input | Output | Duration |
|---|---|---|---|---|
| **brd-agent** | Create BRD | Requirement text | BRD.md | 5-10 min |
| **design-agent** | Technical design | BRD | design-doc.md | 10-15 min |
| **epic-agent** | Create epics | Design doc | Epic files → GitHub Issues | 5 min |
| **feature-agent** | Create features | Design + epics | Feature files → GitHub Issues | 5 min |
| **user-story-agent** | Create stories | BRD + features | Story files → GitHub Issues | 10 min |
| **task-agent** | Create tasks | Design + stories | Task files → GitHub Issues | 10 min |
| **estimate-agent** | Estimate effort | All tasks | Estimates + HTML report + GitHub Project `Effort` field | 5 min |
| **sprint-planning-agent** | Create sprints | Estimates + capacity | Sprint plan HTML + GitHub Project `Sprint` iteration | 5-10 min |
| **scaffold-agent** | Project scaffold | workshop-stack.md | `src/` structure + CI workflow stub | 5 min |
| **implement-agent** | Generate code | Task files, design doc, workshop-stack.md | `src/` implementation + PR per task | Per task |
| **unit-test-agent** *(on-demand)* | Unit tests | BACKEND task files | Unit test files | Per task |
| **review-agent** *(on-demand)* | Code review | Task file + implemented code | Pass/fail review in chat | Per task |
| **playwright-agent** | E2E test generation + execution | E2E-TEST tasks, design doc | `e2e/*.spec.ts` + GitHub Actions artifact | 5-10 min |

---

## Workshop Timeline

### 2-3 Hour Workshop

**Phases 1–2: Requirements & Design** (30 minutes)
- BRD creation (10 min)
- Design document (15 min)
- Commit & push docs (5 min)

**Phase 3: Work Breakdown + GitHub Issues** (35 minutes)
- Epic/Feature/Story/Task creation (~6 min per level)
- `gh issue create` + GitHub Project setup (5 min)

**Phase 4–5: Estimation & Sprint Planning** (20 minutes)
- Effort estimation (5 min)
- Sprint planning (10 min)
- Sync to GitHub Project iterations (5 min)

**Phase 6: Scaffold + CI Setup** (10 minutes)
- Scaffold (5 min)
- GitHub Actions CI workflow (5 min)

**Phase 7: Implementation + Demo** (variable)
- DATABASE tasks (20 min)
- BACKEND tasks (30 min)
- FRONTEND tasks (30 min)
- PR per task with `Closes #issue`
- **Start app + show customer the running application (5 min)**

**Phase 8: E2E Testing** (10 minutes)

**Demo & Retrospective** (10 minutes)

---

## Key Outputs

### Documents Generated
1. `docs/requirements/BRD.md` — Business requirements
2. `docs/design/design-doc.md` — Technical design (Mermaid rendered on GitHub)
3. `docs/work-items/` — Epic/Feature/Story local files
4. `issues/` — Task local files
5. `docs/reports/effort-estimate-report.html` — Effort analysis
6. `docs/reports/sprint-plan-report.html` — Sprint roadmap

### GitHub Platform Artefacts
- GitHub Issues (Epics, Features, Stories, Tasks) with labels + sub-issue hierarchy
- GitHub Project board with Sprint iterations, Effort field, Status automation
- Pull Requests per task, linked to issues (`Closes #N`)
- GitHub Actions CI workflow
- Playwright HTML report as GitHub Actions artifact

### Code Generated
- Data model schema
- API layer (routes, controllers, services)
- UI layer (pages, components)
- `e2e/` — End-to-end test scripts

### Deliverables
- ✅ Complete work hierarchy in GitHub Issues (Epic → Feature → Story → Task)
- ✅ GitHub Project board with sprint planning and capacity
- ✅ Effort estimate report (HTML)
- ✅ Sprint plan report (HTML)
- ✅ Working application running at `dev_server_url` (visible to customer)
- ✅ CI/CD with GitHub Actions
- ✅ Passing E2E tests as GitHub Actions artifact

---

## Benefits of GitHub-Native Approach

- ✅ **Zero external dependencies** — no ADO account, no MCP server, no PAT setup
- ✅ **Issues live next to code** — Copilot can cross-reference issues and PRs natively
- ✅ **`Closes #N` auto-closes issues** on PR merge and updates the Project board
- ✅ **Mermaid diagrams rendered natively** in GitHub Markdown
- ✅ **GitHub Actions CI** validates every PR automatically
- ✅ **Playwright reports** accessible as Actions artifacts from the PR Checks tab
- ✅ **Free for public repos**, included in GitHub Team/Enterprise plans

---

## Next Steps

1. **Set up GitHub Project** — create board with custom fields (Type, Priority, Effort, Sprint)
2. **Create labels** — `epic`, `feature`, `user-story`, `task`, `must-have`, etc.
3. **Run the Workshop** — follow the phase-by-phase flow above
4. **Enable Project Automations** — auto-close issues on PR merge
5. **Review Reports** — examine HTML reports with stakeholders
6. **Customize** — adjust estimation heuristics in `.github/skills/create-estimates/SKILL.md`

---

**Questions or Issues?**
Refer to the base [COMPLETE-WORKSHOP-FLOW.md](./COMPLETE-WORKSHOP-FLOW.md) or consult the facilitator guide.
