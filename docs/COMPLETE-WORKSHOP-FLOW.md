# Complete Agentic SDLC Workshop Flow

**Version:** 2.0 (Non-GHE with Agile Work Breakdown)  
**Last Updated:** April 3, 2026

---

## Overview

This workshop demonstrates an end-to-end AI-assisted software development lifecycle, from business requirements to tested working code. The workflow uses GitHub Copilot agents at every phase, supports both local-only and Azure DevOps integration, and follows Agile best practices with Epic → Feature → User Story → Task hierarchy.

---

## Phase 1: Requirements & Design

### Step 1: Create BRD (Business Requirements Document)

**Agent:** `@brd-agent`

```
PM: @brd-agent analyze requirement

Input: Requirement Issue or text description
Output: docs/requirements/BRD.md

Content:
- Executive Summary
- Business Context
- Functional Requirements (FR-001, FR-002, etc.)
- Non-Functional Requirements
- Out of Scope
- Success Criteria
```

**Duration:** 5-10 minutes

---

### Step 2: Create Design Document

**Agent:** `@design-agent`

```
Architect: @design-agent create design from BRD

Input: docs/requirements/BRD.md (primary source)
Output: 
  - docs/design/design-doc.md (architecture, API contracts, components)
  - src/backend/prisma/schema.prisma (updated with domain models)

Content:
- Architecture Overview (Mermaid diagram)
- Data Model (ER diagram, Prisma schema)
- API Endpoints (REST contracts)
- Component Structure (React hierarchy)
- Key User Flows (Sequence diagrams)
- Seed Data Plan
```

**Duration:** 10-15 minutes

---

## Phase 2: Work Breakdown (Top-Down Creation)

### Step 3: Create Epics

**Agent:** `@epic-agent`

```
PM: @epic-agent create epics from design doc

Input: docs/design/design-doc.md
Output: docs/requirements/work-items/01-epic-{name}.md

Metadata:
---
id: epic-01-room-management
title: Room Management System
type: epic
status: planned
features: []  # Populated by feature-agent
---

Content:
- Epic description
- Business objective
- Acceptance criteria
- Definition of done

Note: No effort estimates at this stage
```

**Duration:** 5 minutes

---

### Step 4: Create Features (under Epics)

**Agent:** `@feature-agent`

```
PM: @feature-agent create features for epic-01

Input: design-doc.md, epic files
Output: docs/requirements/work-items/02-feature-{name}.md

Metadata:
---
id: feature-01-room-catalog
title: Room Catalog
type: feature
epic: epic-01-room-management
status: planned
userStories: []  # Populated by user-story-agent
---

Content:
- Feature description
- Parent epic reference
- Acceptance criteria
- Definition of done

Note: No effort estimates at this stage
```

**Duration:** 5 minutes

---

### Step 5: Create User Stories (under Features)

**Agent:** `@user-story-agent`

```
PM: @user-story-agent create stories for feature-01

Input: BRD.md, design-doc.md, feature files
Output: docs/requirements/work-items/03-user-story-{name}.md

Metadata:
---
id: story-01-browse-rooms
title: As a user, I can browse available rooms
type: user-story
feature: feature-01-room-catalog
status: ready
priority: must-have  # or should-have, could-have
dependencies: []
tasks: []  # Populated by task-agent
---

Content:
- User story statement (As a... I can... so that...)
- Business context
- Acceptance criteria
- Definition of done
- Technical notes

Note: Priority set by agent based on BRD analysis
      No effort estimates at this stage
```

**Duration:** 10 minutes

---

### Step 6: Create Tasks (under User Stories)

**Agent:** `@task-agent`

```
PM: @task-agent create tasks for story-01

Input: design-doc.md, user story files
Output: issues/{order}-{type}-{name}.md

Example files:
  - issues/01-DATABASE-room-model.md
  - issues/02-BACKEND-room-api.md
  - issues/03-FRONTEND-room-list.md
  - issues/04-TEST-room-e2e.md

Metadata:
---
id: task-01-database
title: [DATABASE] Room Model
type: task
userStory: story-01-browse-rooms
status: ready
dependencies: []
---

Content:
- Task description
- Acceptance criteria (technical)
- Definition of done

Note: Tasks created but NOT estimated yet
```

**Duration:** 10 minutes

**Result:** Complete work hierarchy created (Epic → Feature → Story → Task), no estimates

---

## Phase 3: Effort Estimation (Bottom-Up)

### Step 7: Estimate All Work

**Agent:** `@estimate-agent`

```
PM or Architect: @estimate-agent analyze all work

Process:
1. Scans all task files in issues/ folder
2. For each task, analyzes:
   - Acceptance criteria count
   - File scope (single file vs multiple)
   - Technical complexity
   - Task type ([DATABASE], [BACKEND], [FRONTEND], [TEST])

3. Assigns effort estimate using heuristics:
   
   [DATABASE] tasks:
   - Simple model (1-3 fields) → 15min
   - Standard model (4-8 fields) → 30min
   - Complex model (relations, enums) → 45min
   
   [BACKEND] tasks:
   - Simple CRUD endpoint → 30min
   - Endpoint with validation → 45min
   - Complex business logic → 1h-2h
   
   [FRONTEND] tasks:
   - Simple component → 30min
   - Page with list → 45min
   - Complex form/interaction → 1h-2h
   
   [TEST] tasks:
   - Basic E2E test → 15min
   - Complex user journey → 30min

4. Updates each task file with estimate:
   estimatedEffort: 30min

5. Rolls up estimates (bottom-up):
   - Story effort = sum of task efforts
   - Feature effort = sum of story efforts
   - Epic effort = sum of feature efforts

6. Generates HTML report:
   docs/reports/effort-estimate-report.html

Output HTML Report Contains:
- Executive summary (total epics, features, stories, tasks, effort)
- Effort breakdown by type ([DATABASE], [BACKEND], [FRONTEND], [TEST])
- Detailed hierarchy showing all work items with efforts
- Visual presentation for stakeholder review
```

**Duration:** 5 minutes (automated)

**Result:** All work estimated, beautiful HTML report generated

---

## Phase 4: Sprint Planning (Capacity-Driven)

### Step 8: Create Sprint Plans

**Agent:** `@sprint-planning-agent`

```
PM: @sprint-planning-agent create sprint plan

Interactive Questions (agent asks):
  Q: How many Database developers?
  A: 2
  
  Q: How many Backend/API developers?
  A: 3
  
  Q: How many Frontend/UI developers?
  A: 2
  
  Q: Hours per sprint per developer?
  A: 40h

Process:
1. Calculates total capacity per role:
   - Database: 2 devs × 40h = 80h per sprint
   - Backend: 3 devs × 40h = 120h per sprint
   - Frontend: 2 devs × 40h = 80h per sprint

2. Reads effort estimates from estimate-agent output
   Example:
   - Total [DATABASE] work: 12h
   - Total [BACKEND] work: 20h
   - Total [FRONTEND] work: 18h

3. Groups user stories into sprints based on:
   - Team capacity per role
   - Dependencies (DATABASE → BACKEND → FRONTEND constraint)
   - Priority (must-have → should-have → could-have)
   - Dependency chains (stories with no blockers first)

4. Calculates utilization:
   Sprint 1 Database: 12h / 80h = 15% utilization
   Sprint 1 Backend: 20h / 120h = 17% utilization
   Sprint 1 Frontend: 18h / 80h = 22% utilization

5. Generates HTML report:
   docs/reports/sprint-plan-report.html

Output HTML Report Contains:
- Sprint breakdown (which stories in which sprint)
- Capacity vs committed work per role per sprint
- Utilization percentages
- Dependencies and blockers visualization
- Sprint goals
- Visual capacity charts
- Recommendations (underutilized, balanced, overcommitted)
```

**Duration:** 5-10 minutes

**Result:** Complete sprint roadmap with capacity planning

---

## Phase 5: Optional Azure DevOps Integration

### Step 9 (Optional): Push to Azure DevOps

**Agent:** `@ado-sync-agent`

```
If ADO integration enabled in workshop-config.json:

PM: @ado-sync-agent push to Azure DevOps

Requirements:
- Azure DevOps account
- ADO project created
- PAT token configured
- ADO MCP server installed

Process:
1. Reads workshop-config.json (ADO settings)
2. Creates work item hierarchy in ADO:
   - Epics → ADO Epic work items
   - Features → ADO Feature work items
   - User Stories → ADO User Story work items
   - Tasks → ADO Task work items

3. Sets fields:
   - Title, Description, Acceptance Criteria
   - Effort estimate → "Remaining Work" field
   - Priority → ADO priority field
   - Status → State field

4. Creates relationships:
   - Parent-child links (Epic → Feature → Story → Task)
   - Predecessor links for dependencies

5. Creates tracking file:
   docs/ado-sync-state.json
   (prevents duplicate creation on re-run)

Modes:
- "ado": All work items only in ADO, no local files
- "hybrid": Local markdown files + synced to ADO (recommended)
```

**Duration:** 5 minutes

**Result:** Work items visible in Azure DevOps Boards (optional)

---

## Phase 6: Implementation

### Step 10: Developers Work on Tasks

**Agent:** `@work-queue-agent` + `@implement-agent`

**Step 10a: Discover Work**

```
Developer: @work-queue-agent what should I work on?

Agent behavior:
1. Reads workshop-config.json to determine:
   - Work item source (local files or ADO)
   - Team structure (full-stack or specialized)
   - Current developer role (if specialized)

2. Shows prioritized task list:
   - Tasks ready to implement (dependencies satisfied)
   - Filtered by developer role (if specialized team)
   - Grouped by sprint and user story
   - Shows effort estimate and dependencies

Example output:
┌─────────────────────────────────────────────────┐
│ Sprint 1 Progress                                │
├─────────────────────────────────────────────────┤
│ Day 2 of 10 | 13 story points committed         │
│ Progress: ▓▓░░░░░░░░ 15%                        │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ Your Work Queue (Database Engineer)              │
├─────────────────────────────────────────────────┤
│ ✅ #001 [DATABASE] Room Model (30min)          │
│    Story: Browse Rooms                           │
│    Status: Ready | Priority: must-have          │
│    📊 Blocks: #002, #003, #004                  │
└─────────────────────────────────────────────────┘

Recommendation: Start with #001 - unblocks entire team
```

**Step 10b: Implement Task**

```
Developer: @implement-agent implement task-01
   OR
Developer: @implement-agent implement issues/01-DATABASE-room-model.md

Process:
1. Fetches task details:
   - From local markdown file (if mode=local)
   - From ADO via MCP (if mode=ado)
   - From both, validate sync (if mode=hybrid)

2. Detects task type from tag:
   [DATABASE], [BACKEND], [FRONTEND], [TEST]

3. Loads appropriate context:
   [DATABASE]:
   - design-doc.md (schema requirements)
   - existing schema.prisma
   - BRD.md (business rules)
   
   [BACKEND]:
   - design-doc.md (API contracts)
   - schema.prisma (read-only, for Prisma client)
   - BRD.md (business rules)
   
   [FRONTEND]:
   - design-doc.md (component specs, data-testids)
   - API contracts from design doc
   
   [TEST]:
   - user story acceptance criteria
   - component data-testids from design doc

4. Generates code with scope restrictions:
   [DATABASE]: Only modifies schema.prisma, seed.ts, migrations/
   [BACKEND]: Only modifies routes/, controllers/, services/
   [FRONTEND]: Only modifies pages/, components/, services/
   [TEST]: Only modifies e2e/

5. Updates status:
   - Local: Updates markdown frontmatter (status: ready → done)
   - ADO: Updates work item state via MCP
   - Hybrid: Updates both

6. Commits code:
   git add {modified files}
   git commit -m "feat: implement Task #123 [DATABASE] Room model"
   git push

Repeat for all tasks in dependency order
```

**Duration:** 60-90 minutes (main workshop activity)

---

## Phase 7: Testing & Review

### Step 11: Run Tests

```
QA Engineer: @implement-agent implement test tasks
  - Generates Playwright E2E tests based on user story
  - Uses data-testid selectors from design doc
  
Then run tests:
  npx playwright test --ui
```

**Optional: Code Review**

```
@review-agent review implementation for story-01
  - Validates against story acceptance criteria
  - Checks definition of done is met
  - Saves review to docs/reviews/story-01-review.md
```

**Duration:** 20-30 minutes

---

## Configuration Modes

### Mode 1: Local Files Only (Default, Non-ADO)

```json
// workshop-config.json
{
  "workItemSource": "local",
  "teamStructure": {
    "mode": "full-stack"
  }
}
```

**Characteristics:**
- All work items as markdown files
- No external dependencies
- Fast setup (5 minutes)
- Perfect for workshop/demo
- No ADO subscription needed

---

### Mode 2: Azure DevOps Integration

```json
// workshop-config.json
{
  "workItemSource": "ado",
  "adoIntegration": {
    "enabled": true,
    "organization": "myorg",
    "project": "MyProject",
    "pat": "{PAT_TOKEN}"
  },
  "teamStructure": {
    "mode": "specialized",
    "roles": {
      "database": ["Alice"],
      "backend": ["Bob"],
      "frontend": ["Carol"]
    }
  }
}
```

**Characteristics:**
- All work items in Azure DevOps
- Uses ADO MCP tools
- Enterprise tracking and reporting
- Requires ADO setup (30 minutes)
- Real-world Agile boards

---

### Mode 3: Hybrid (Recommended for Enterprise)

```json
{
  "workItemSource": "hybrid",
  "adoIntegration": {
    "enabled": true,
    "syncStrategy": "two-way"
  }
}
```

**Characteristics:**
- Local markdown files for speed and offline work
- Synced to ADO for tracking and management
- Best of both worlds
- Slight complexity in setup

---

## Key Agents Summary

| Agent | Purpose | Input | Output | Duration |
|-------|---------|-------|--------|----------|
| **brd-agent** | Create BRD | Requirement text | BRD.md | 5-10 min |
| **design-agent** | Technical design | BRD | design-doc.md + schema | 10-15 min |
| **epic-agent** | Create epics | Design doc | Epic files | 5 min |
| **feature-agent** | Create features | Design + epics | Feature files | 5 min |
| **user-story-agent** | Create stories | BRD + features | Story files | 10 min |
| **task-agent** | Create tasks | Design + stories | Task files | 10 min |
| **estimate-agent** | Estimate effort | All tasks | Estimates + HTML report | 5 min |
| **sprint-planning-agent** | Create sprints | Estimates + capacity | Sprint plan HTML | 5-10 min |
| **ado-sync-agent** | Sync to ADO | Local files | ADO work items | 5 min |
| **work-queue-agent** | Show work | Sprint plan | Prioritized task list | On-demand |
| **implement-agent** | Generate code | Task details | Code implementation | Per task |

---

## Workshop Timeline

### 2-3 Hour Workshop

**Phase 1-2: Requirements & Work Breakdown** (30 minutes)
- BRD creation (10 min)
- Design document (15 min)
- Epic/Feature/Story/Task creation (5 min per level)

**Phase 3-4: Estimation & Planning** (15 minutes)
- Effort estimation (5 min)
- Sprint planning (10 min)

**Phase 5: Review Reports** (5 minutes)
- Review effort estimate report
- Review sprint plan report
- Stakeholder alignment

**Phase 6-7: Implementation & Testing** (90 minutes)
- Database tasks (20 min)
- Backend tasks (30 min)
- Frontend tasks (30 min)
- Test generation and execution (10 min)

**Demo & Retrospective** (10 minutes)

---

## Key Outputs

### Documents Generated
1. `docs/requirements/BRD.md` - Business requirements
2. `docs/design/design-doc.md` - Technical design
3. `docs/requirements/work-items/` - Epic/Feature/Story files
4. `issues/` - Task files
5. `docs/reports/effort-estimate-report.html` - Effort analysis
6. `docs/reports/sprint-plan-report.html` - Sprint roadmap
7. `docs/reviews/` - Code reviews (optional)

### Code Generated
- `src/backend/prisma/schema.prisma` - Data models
- `src/backend/routes/` - API endpoints
- `src/backend/controllers/` - Business logic
- `src/frontend/src/pages/` - React pages
- `src/frontend/src/components/` - React components
- `e2e/` - Playwright tests

### Deliverables
- ✅ Complete work hierarchy (Epic → Feature → Story → Task)
- ✅ Effort estimate report (stakeholder-ready HTML)
- ✅ Sprint plan report (capacity-based, visual)
- ✅ Working application (full-stack)
- ✅ Passing E2E tests
- ✅ Optional: Azure DevOps integration

---

## Benefits of This Approach

### Educational Value
- ✅ Shows complete Agile workflow (not just coding)
- ✅ Demonstrates Epic → Feature → Story → Task decomposition
- ✅ Teaches capacity-based sprint planning
- ✅ Illustrates dependency management
- ✅ Shows AI assistance at every SDLC phase

### Enterprise Readiness
- ✅ Supports specialized developer roles
- ✅ Integrates with Azure DevOps (optional)
- ✅ Generates stakeholder-friendly reports
- ✅ Follows industry best practices
- ✅ Scales to real team structures

### Workshop Flexibility
- ✅ Works without external dependencies (local mode)
- ✅ Optional ADO integration for advanced scenarios
- ✅ Configurable team structures
- ✅ Adjustable effort estimation heuristics
- ✅ Multiple sprint scenarios

---

## Prerequisites

### For All Modes
- VS Code (latest)
- GitHub Copilot extension (signed in)
- Node.js 18 or higher
- Git

### For ADO Integration (Optional)
- Azure DevOps account
- ADO project created
- Personal Access Token (PAT)
- Azure DevOps MCP server configured

---

## Next Steps

1. **Run the Workshop**: Follow the phase-by-phase flow above
2. **Review Reports**: Examine HTML reports with stakeholders
3. **Customize**: Adjust estimation heuristics and capacity in `workshop-config.json`
4. **Scale Up**: Add more epics, features, and stories for larger projects
5. **Integrate ADO**: Enable Azure DevOps integration for enterprise tracking

---

**Questions or Issues?**
Refer to workshop documentation or consult the facilitator guide.
