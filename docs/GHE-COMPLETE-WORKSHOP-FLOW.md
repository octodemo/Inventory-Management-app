# Complete Agentic SDLC Workshop Flow — GitHub Platform Edition

**Version:** 1.1 (GitHub Issues + GitHub Projects + GitHub Actions)  
**Last Updated:** August 2026  
**Based on:** [COMPLETE-WORKSHOP-FLOW.md](./COMPLETE-WORKSHOP-FLOW.md)

---

## Overview

This workshop demonstrates an end-to-end AI-assisted software development lifecycle using the **GitHub platform natively** — GitHub Issues, GitHub Projects, GitHub Actions, and GitHub Copilot agents.

**Key difference from the base flow:** Work items (Epics, Features, Stories, Tasks) are created directly as **GitHub Issues** with labels, linked into a **GitHub Project board**, and managed using **GitHub Projects** for sprint planning and capacity tracking.

**All GitHub push operations are handled by a single agent: `github-sync-agent`.** You no longer need to run `gh` CLI scripts manually — the agent is idempotent and safe to re-run.

---

## Prerequisites

### For All Modes
- VS Code (latest)
- GitHub Copilot extension (signed in)
- [GitHub CLI (`gh`)](https://cli.github.com/) installed and authenticated (`gh auth login`)
- Runtime environment appropriate for the chosen tech stack
- Git

### GitHub Platform Setup (do this once before the workshop)

1. Create a **GitHub Project** (table or board layout) in your org/repo.
2. Note your **Project number** (visible in the Project URL: `github.com/orgs/<org>/projects/<number>`).
3. Add custom fields to the Project:
   - `Type` → Single select: `Epic`, `Feature`, `User Story`, `Task`
   - `Priority` → Single select: `must-have`, `should-have`, `could-have`
   - `Effort` → Number field (hours)
   - `Sprint` → Iteration field (2-week sprints)
   - `Task Type` → Single select: `DATABASE`, `BACKEND`, `FRONTEND`, `UNIT-TEST`, `E2E-TEST`
4. Labels are created **automatically** by `github-sync-agent` on first run (idempotent). No manual label creation needed.

> 💡 To find your **Project ID** and **field IDs** for Effort and Sprint, run:
> ```bash
> gh project field-list <project-number> --owner <org> --format json
> ```

---

## Phase 1: Requirements

### Step 1: Create BRD (Business Requirements Document)

**Agent:** `brd-agent`

```
PM: select brd-agent in Agent dropdown in VS Code and paste your requirement text and press enter

What will BRD agent do:
  Input:  Requirement Issue or text description
  Output: docs/requirements/BRD.md
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
  Input:  docs/requirements/BRD.md
  Output: docs/design/design-doc.md
          (Architecture Overview · Data Model · API Endpoints ·
           Component Structure · Key User Flows · Seed Data Plan)
```

**Duration:** 10-15 minutes

> 💡 **GitHub Tip:** Commit and push `docs/design/design-doc.md` immediately after generation.
> GitHub renders Mermaid diagrams natively in Markdown — stakeholders can view the
> architecture diagram directly in the browser without any extra tooling.

---

## Phase 3: Work Breakdown (Top-Down Creation)

> **How GitHub sync works in this phase:**
> After each agent generates its local files, you call **`github-sync-agent`** once to push
> that level to GitHub Issues, wire up the sub-issue hierarchy, and add items to your Project board.
> The agent reads `docs/github-sync-state.json` to stay idempotent — re-running it is always safe.

---

### Step 3: Create Epics

**Agent:** `epic-agent`

```
PM: epic-agent create epics from design doc

  Input:  docs/design/design-doc.md
  Output: docs/work-items/epics/epic-{nn}-{name}.md
```

**Duration:** 5 minutes

#### ➡️ Push Epics to GitHub Issues

```
PM: github-sync-agent push epics to GitHub Issues

What github-sync-agent will do:
  1. Bootstrap all required labels (epic, feature, user-story, task,
     database, backend, frontend, unit-test, e2e-test,
     must-have, should-have, could-have) — safe to run multiple times.
  2. For each docs/work-items/epics/epic-*.md file:
     - Check docs/github-sync-state.json — skip if already pushed.
     - Run: gh issue create --title <title> --label epic --body-file <file>
     - Add the new issue to your GitHub Project board.
     - Record the issue number in docs/github-sync-state.json.
  3. Report: "N epics created, M skipped (already existed)."
```

---

### Step 4: Create Features (under Epics)

**Agent:** `feature-agent`

```
PM: feature-agent create features for epic-01

  Input:  docs/design/design-doc.md, docs/work-items/epics/
  Output: docs/work-items/features/feature-{nn}-{name}.md
          (front-matter includes: epic: epic-{nn})
```

**Duration:** 5 minutes

#### ➡️ Push Features to GitHub Issues

```
PM: github-sync-agent push features to GitHub Issues

What github-sync-agent will do:
  1. For each docs/work-items/features/feature-*.md file:
     - Check docs/github-sync-state.json — skip if already pushed.
     - Run: gh issue create --title <title> --label feature --body-file <file>
     - Read the epic: field from front-matter, look up the Epic issue
       number in docs/github-sync-state.json.
     - Run: gh issue edit <feature-number> --add-sub-issue-of <epic-number>
     - Add the new issue to your GitHub Project board.
     - Record in docs/github-sync-state.json.
  2. Report: "N features created, M skipped."
```

> 💡 Sub-issue linking works automatically because `feature-agent` writes
> `epic: epic-{nn}` into each feature file's front-matter.

---

### Step 5: Create User Stories (under Features)

**Agent:** `user-story-agent`

```
PM: user-story-agent create stories for feature-01

  Input:  docs/requirements/BRD.md, docs/design/design-doc.md,
          docs/work-items/features/
  Output: docs/work-items/stories/story-{nn}-{name}.md
          (front-matter includes: feature: feature-{nn}, epic: epic-{nn},
           priority: must-have | should-have | could-have)
```

**Duration:** 10 minutes

#### ➡️ Push User Stories to GitHub Issues

```
PM: github-sync-agent push user stories to GitHub Issues

What github-sync-agent will do:
  1. For each docs/work-items/stories/story-*.md file:
     - Check docs/github-sync-state.json — skip if already pushed.
     - Run: gh issue create --title <title>
              --label user-story,<priority> --body-file <file>
     - Read the feature: field from front-matter, look up the Feature
       issue number in docs/github-sync-state.json.
     - Run: gh issue edit <story-number> --add-sub-issue-of <feature-number>
     - Add to GitHub Project board.
     - Record in docs/github-sync-state.json.
  2. Report: "N stories created, M skipped."
```

---

### Step 6: Create Tasks (under User Stories)

**Agent:** `task-agent`

```
PM: task-agent create tasks for story-01

  Input:  docs/design/design-doc.md, docs/work-items/stories/
  Output: issues/{order}-{type}-{name}.md

  Example files:
    issues/01-DATABASE-{entity}-model.md
    issues/02-BACKEND-{entity}-api.md
    issues/03-UNIT-TEST-{entity}-api.md
    issues/04-FRONTEND-{entity}-list.md
    issues/05-E2E-TEST-{entity}.md

  Each file's front-matter includes:
    story:   story-{nn}
    feature: feature-{nn}
    epic:    epic-{nn}
```

**Duration:** 10 minutes

#### ➡️ Push Tasks to GitHub Issues

```
PM: github-sync-agent push tasks to GitHub Issues

What github-sync-agent will do:
  1. For each issues/*.md file:
     - Check docs/github-sync-state.json — skip if already pushed.
     - Derive the type label from the [TYPE] prefix in the title
       (e.g. [DATABASE] → database).
     - Run: gh issue create --title <title>
              --label task,<type> --body-file <file>
     - Read the story: field from front-matter, look up the Story
       issue number in docs/github-sync-state.json.
     - Run: gh issue edit <task-number> --add-sub-issue-of <story-number>
     - Add to GitHub Project board.
     - Record in docs/github-sync-state.json.
  2. Report: "N tasks created, M skipped."
```

**Result:** Complete work hierarchy in GitHub Issues (Epic → Feature → Story → Task),
visible on your GitHub Project board with sub-issue nesting intact.

---

## Phase 4: Effort Estimation (Bottom-Up)

### Step 7: Estimate All Work

**Agent:** `estimate-agent`

```
PM or Architect: estimate-agent analyze all work

Process:
  1. Scans all task files in issues/
  2. Assigns effort using heuristics:
       [DATABASE]:  15min – 45min
       [BACKEND]:   30min – 2h
       [FRONTEND]:  30min – 2h
       [UNIT-TEST]: 15min – 30min
       [E2E-TEST]:  15min – 30min
  3. Updates each task file: estimatedEffort: <value>
  4. Rolls up: Task → Story → Feature → Epic
  5. Generates: docs/reports/effort-estimate-report.html
  6. Generates: docs/sprint-assignments.json
     (maps each work-item stem to sprint number + GitHub iteration ID)
```

**Duration:** 5 minutes

#### ➡️ Sync Estimates to GitHub Project

```
PM: github-sync-agent sync estimates to GitHub Project

What github-sync-agent will do:
  1. For each issues/*.md file with an estimatedEffort: field:
     - Convert the value to decimal hours (e.g. 30min → 0.5, 1.5h → 1.5).
     - Look up the item ID in the GitHub Project via gh project item-list.
     - Run: gh project item-edit --field-id <effort-field-id>
              --number <effort-in-hours>
  2. Report: "Effort synced for N task issues."
```

> 💡 Find your `EFFORT_FIELD_ID` once with:
> ```bash
> gh project field-list <project-number> --owner <org> --format json
> ```

---

## Phase 5: Sprint Planning (Capacity-Driven)

### Step 8: Create Sprint Plans

**Agent:** `sprint-planning-agent`

```
PM: sprint-planning-agent create sprint plan

Interactive Questions:
  Q: How many Database developers?    A: 2
  Q: How many Backend/API developers? A: 3
  Q: How many Frontend/UI developers? A: 2
  Q: Hours per sprint per developer?  A: 40h

Output:
  docs/reports/sprint-plan-report.html
  docs/sprint-assignments.json
    { "story-01": { "sprint": 1, "iteration_id": "<gh-iteration-id>" }, ... }
```

**Duration:** 5-10 minutes

#### ➡️ Assign Sprints in GitHub Project

```
PM: github-sync-agent sync sprints to GitHub Project

What github-sync-agent will do:
  1. Read docs/sprint-assignments.json.
  2. For each entry:
     - Look up the issue number from docs/github-sync-state.json.
     - Look up the item ID in the GitHub Project.
     - Run: gh project item-edit --field-id <sprint-field-id>
              --iteration-id <iteration-id>
  3. Report: "Sprint assigned for N items."
```

> 💡 Use the **GitHub Project board view** (grouped by Sprint iteration) to visually
> review capacity and drag-and-drop stories between sprints before committing.

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
  Output: src/ structure, package.json / pom.xml / requirements.txt,
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

For each task, `github-sync-agent` handles the branch, commit, and PR:

```
Developer: github-sync-agent create branch and PR for issue <issue-number>

What github-sync-agent will do:
  1. Run: gh issue develop <issue-number> --checkout
     (creates and checks out a branch named <issue-number>-<slug>)
  2. Prompt you to run implement-agent in VS Code.
  3. After you confirm implementation is done:
     git add .
     git commit -m "closes #<issue-number>: <title>"
     git push
  4. Run: gh pr create
          --title "<title> (#<issue-number>)"
          --body  "Closes #<issue-number>"
          --label "<type-label>"
```

> 💡 `Closes #<issue-number>` in the PR body automatically closes the issue
> and moves it to **Done** on the GitHub Project board when the PR is merged.

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

## Phase 8: GitHub Issues & Project — Full Sync Summary

All work items are native GitHub Issues managed entirely by `github-sync-agent`.

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
  └── Feature Issue  (sub-issue of Epic   — linked via epic: front-matter)
        └── User Story Issue  (sub-issue of Feature — linked via feature: front-matter)
              └── Task Issue  (sub-issue of User Story — linked via story: front-matter)
```

### State File — `docs/github-sync-state.json`

`github-sync-agent` maintains this file automatically. It maps every local file stem
to its GitHub Issue number, making every sync operation idempotent.

```json
{
  "epics":    { "epic-01": 42 },
  "features": { "feature-01-01": 44 },
  "stories":  { "story-01-01-01": 45 },
  "tasks":    { "01-DATABASE-item-model": 46 }
}
```

### Enable Project Automations (one-time, ~2 minutes)

Go to your GitHub Project → **Settings → Workflows** and enable:
- ✅ **Auto-add items** — when issue is labeled `task`, add to project
- ✅ **Item closed** → set Status to `Done`
- ✅ **Pull request merged** → set linked issue Status to `Done`
- ✅ **Item added** → set Status to `Todo`

---

## Phase 9: E2E Testing with Playwright

### Step 11: Generate and Run Playwright Tests

**Agent:** `playwright-agent`

> Run after FRONTEND tasks are implemented and the application is running locally.

**Step 11a: Generate test files**

```
QA Engineer: playwright-agent create tests for all E2E-TEST tasks

  Input:
    - issues/*.md  (E2E-TEST task files)
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

# Run in headed mode (useful for live demos)
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
| **brd-agent** | Create BRD | Requirement text | `BRD.md` | 5-10 min |
| **design-agent** | Technical design | BRD | `design-doc.md` | 10-15 min |
| **epic-agent** | Create epics | Design doc | Epic `.md` files | 5 min |
| **feature-agent** | Create features | Design + epics | Feature `.md` files | 5 min |
| **user-story-agent** | Create stories | BRD + features | Story `.md` files | 10 min |
| **task-agent** | Create tasks | Design + stories | Task `.md` files in `issues/` | 10 min |
| **github-sync-agent** | Push all work items to GitHub | Local `.md` files + `docs/github-sync-state.json` | GitHub Issues + sub-issue links + Project items + Effort + Sprint + PRs | Per phase (~2 min) |
| **estimate-agent** | Estimate effort | All tasks | Estimates in task files + `effort-estimate-report.html` | 5 min |
| **sprint-planning-agent** | Create sprints | Estimates + capacity | `sprint-plan-report.html` + `docs/sprint-assignments.json` | 5-10 min |
| **scaffold-agent** | Project scaffold | `workshop-stack.md` | `src/` structure + CI workflow stub | 5 min |
| **implement-agent** | Generate code | Task files, design doc, `workshop-stack.md` | `src/` implementation | Per task |
| **unit-test-agent** *(on-demand)* | Unit tests | BACKEND task files | Unit test files | Per task |
| **review-agent** *(on-demand)* | Code review | Task file + implemented code | Pass/fail review in chat | Per task |
| **playwright-agent** | E2E test generation | E2E-TEST tasks, design doc | `e2e/*.spec.ts` + Actions artifact | 5-10 min |

---

## Workshop Timeline

### 2-3 Hour Workshop

**Phases 1–2: Requirements & Design** (30 minutes)
- BRD creation (10 min)
- Design document (15 min)
- Commit & push docs (5 min)

**Phase 3: Work Breakdown + GitHub Issues** (35 minutes)
- Epic/Feature/Story/Task creation (~6 min per level)
- `github-sync-agent` push after each level (2 min per level)

**Phase 4–5: Estimation & Sprint Planning** (20 minutes)
- Effort estimation (5 min)
- Sprint planning (10 min)
- `github-sync-agent` sync estimates + sprints (5 min)

**Phase 6: Scaffold + CI Setup** (10 minutes)
- Scaffold (5 min)
- GitHub Actions CI workflow (5 min)

**Phase 7: Implementation** (variable)
- DATABASE tasks (20 min)
- BACKEND tasks (30 min)
- FRONTEND tasks (30 min)
- `github-sync-agent` branch + PR per task

**Phase 8: E2E Testing** (10 minutes)

**Demo & Retrospective** (10 minutes)

---

## Key Outputs

### Documents Generated
1. `docs/requirements/BRD.md` — Business requirements
2. `docs/design/design-doc.md` — Technical design (Mermaid rendered on GitHub)
3. `docs/work-items/` — Epic/Feature/Story local files
4. `issues/` — Task local files
5. `docs/github-sync-state.json` — Issue number registry (maintained by `github-sync-agent`)
6. `docs/sprint-assignments.json` — Sprint mapping (produced by `sprint-planning-agent`)
7. `docs/reports/effort-estimate-report.html` — Effort analysis
8. `docs/reports/sprint-plan-report.html` — Sprint roadmap

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
- ✅ Working application (full-stack)
- ✅ CI/CD with GitHub Actions
- ✅ Passing E2E tests as GitHub Actions artifact

---

## Benefits of GitHub-Native Approach

- ✅ **Zero external dependencies** — no ADO account, no MCP server, no PAT setup
- ✅ **Single agent for all GitHub operations** — `github-sync-agent` replaces all manual `gh` CLI scripts
- ✅ **Idempotent syncs** — re-run `github-sync-agent` at any time; it never creates duplicates
- ✅ **Sub-issue hierarchy auto-wired** — parent references are in file front-matter; no manual linking
- ✅ **Issues live next to code** — Copilot can cross-reference issues and PRs natively
- ✅ **`Closes #N` auto-closes issues** on PR merge and updates the Project board
- ✅ **Mermaid diagrams rendered natively** in GitHub Markdown
- ✅ **GitHub Actions CI** validates every PR automatically
- ✅ **Playwright reports** accessible as Actions artifacts from the PR Checks tab
- ✅ **Free for public repos**, included in GitHub Team/Enterprise plans

---

## Next Steps

1. **Set up GitHub Project** — create board with custom fields (Type, Priority, Effort, Sprint)
2. **Note your Project number** — needed by `github-sync-agent` (visible in the Project URL)
3. **Run the Workshop** — follow the phase-by-phase flow above
4. **Enable Project Automations** — auto-close issues on PR merge (Phase 8 setup)
5. **Review Reports** — examine HTML reports with stakeholders
6. **Customize** — adjust estimation heuristics in `.github/skills/create-estimates/SKILL.md`

---

**Questions or Issues?**
Refer to the base [COMPLETE-WORKSHOP-FLOW.md](./COMPLETE-WORKSHOP-FLOW.md) or consult the facilitator guide.
