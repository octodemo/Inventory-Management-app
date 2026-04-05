# Workshop Facilitator Guide
# Agentic SDLC Workshop — AI-Assisted Software Development Lifecycle

**Version:** 1.0
**Audience:** Workshop Facilitator
**Duration:** 2.5 – 3 hours

---

## Before You Begin

Read the Pre-Setup Checklist and complete all items.
Run the full chain as a dry run at least once before the workshop day.
Know the customer's requirement well — you will be narrating the
agent's reasoning to the audience as it runs.

---

## Workshop Flow Overview

```
Phase 1: Requirements        ~20 min   @brd-agent
Phase 2: Design              ~20 min   @design-agent
Phase 3: Work Breakdown      ~25 min   @epic, @feature, @user-story, @task agents
Phase 4: Estimation          ~15 min   @estimate-agent
Phase 5: Sprint Planning     ~15 min   @sprint-planning-agent
Phase 6: ADO Sync            ~10 min   @ado-sync-agent
Buffer + Q&A                 ~15 min
─────────────────────────────────────
Total                        ~2h 00min (buffer brings to 2h 30min)
```

---

## Phase 1: Requirements — @brd-agent
**Duration: 20 minutes**

### What to Say Before Invoking
> "We are going to start exactly where every software project starts —
> with a business requirement. Instead of a BA spending days writing
> this up, we are going to ask a Copilot agent to do it in minutes.
> Watch what it reads, what it extracts, and how it structures the output."

### How to Invoke
Open GitHub Copilot Chat in VS Code and type:
```
@brd-agent [paste the customer requirement here]
```

### While It Runs — Narrate This
- Point out that the agent reads the requirement before writing anything
- Highlight that it preserves domain entity names verbatim
- Point out the FR numbering — these IDs will trace through every
  subsequent document
- Draw attention to the Assumptions section — this is where AI
  honesty is visible

### After It Completes
Open `docs/requirements/BRD.md` in VS Code preview mode.
Walk the audience through:
- Section 2 (User Roles) — are the role names from the requirement?
- Section 5 (Functional Requirements) — count the FRs, show the
  acceptance criteria
- Section 7 (Assumptions) — discuss one assumption with the audience

### Key Talking Point
> "Notice the agent did not rename anything. If the requirement said
> Practitioner, the BRD says Practitioner — not Doctor, not User.
> This precision matters because every downstream artifact traces
> back to this document."

### Recovery
If the BRD output looks generic or renamed entities:
> "Let me ask it to be more specific."
Re-invoke with: `@brd-agent re-read the requirement and preserve
the exact entity names: [list them]`

---

## Phase 2: Design — @design-agent
**Duration: 20 minutes**

### What to Say Before Invoking
> "Now we hand off to a Solution Architect agent. It has read nothing
> yet — it will read the BRD we just produced and derive the entire
> technical design from it. Architecture, data model, API contracts,
> component structure, user flows."

### How to Invoke
```
@design-agent create the design document from the BRD
```

### While It Runs — Narrate This
- Point out it reads the BRD first — traceability starts here
- Highlight the Mermaid diagrams generating automatically
- Point to the API contracts table — method, path, auth requirement
- Draw attention to the data-testid values — "these will be used
  by the test agent later"

### After It Completes
Open `docs/design/design-doc.md` in VS Code preview mode.
Walk through:
- Architecture diagram — name the tiers
- ER diagram — show the entities match the BRD
- One API endpoint — trace it back to a BRD FR

### Key Talking Point
> "Every decision here is traceable. The Appointment entity exists
> because FR-005 required it. The POST /api/appointments endpoint
> exists because FR-006 required it. There is no guesswork."

### Recovery
If diagrams do not render:
Open the Command Palette → `Markdown: Open Preview` — Mermaid
diagrams render in VS Code preview, not in the raw file.

---

## Phase 3: Work Breakdown — Four Agents
**Duration: 25 minutes total (~6 min per agent)**

### What to Say Before This Phase
> "In a traditional project, a PM would now spend days decomposing
> this into epics, features, stories, and tasks. We are going to
> do the entire Agile work breakdown in under 30 minutes using
> four agents in sequence. Watch the hierarchy build top-down."

---

### 3a. @epic-agent (~6 min)

**Invoke:**
```
@epic-agent create epics from the design document
```

**Narrate:**
- "It is reading both the BRD and the design doc simultaneously"
- "Epics represent business capabilities — not technical layers"
- Open one epic file and show the frontmatter metadata
- Point out `features: []` — "this will be populated by the next agent"

---

### 3b. @feature-agent (~6 min)

**Invoke:**
```
@feature-agent create features for all epics
```

**Narrate:**
- "Each feature is a deliverable slice of its parent epic"
- "Notice it is updating the epic files to record their children"
- Open a feature file — show the parent epic link
- Show the updated epic frontmatter with features listed

---

### 3c. @user-story-agent (~7 min)

**Invoke:**
```
@user-story-agent create user stories for all features
```

**Narrate:**
- "User stories are written from the user's perspective — not
  the developer's. Watch the role names."
- Open a story file — read the Given/When/Then criteria aloud
- Point out the MoSCoW priority — "the agent assigned this based
  on the BRD, not randomly"
- Show the Technical Notes section — "this bridges business intent
  to implementation"

### Key Talking Point
> "Every story uses the role names from the BRD. Every acceptance
> criterion is testable. This is not generated filler — this is
> structured, traceable specification."

---

### 3d. @task-agent (~6 min)

**Invoke:**
```
@task-agent create tasks for all user stories
```

**Narrate:**
- "Every story produces four tasks — DATABASE, BACKEND, FRONTEND,
  TEST — in that order. This is the implementation sequence."
- Open the `issues/` folder — show the numbered files
- Show one BACKEND task — read the acceptance criteria
- Point out the `dependencies` field — "BACKEND depends on DATABASE"

### Key Talking Point
> "The work breakdown is now complete. We have gone from a single
> requirement to a fully decomposed, traceable, dependency-aware
> task list in under 30 minutes. A traditional team would spend
> 2-3 days doing this manually."

---

## Phase 4: Estimation — @estimate-agent
**Duration: 15 minutes**

### What to Say Before Invoking
> "Now we estimate. The agent is going to read every single task,
> reason about its complexity, assign a size, and roll estimates
> up through the entire hierarchy. Then it will produce a report
> we can show to any stakeholder."

### How to Invoke
```
@estimate-agent analyse all work and produce the estimate report
```

### While It Runs — Narrate This
- "It is reading the design doc first to understand overall complexity"
- "Then it reads each task individually — acceptance criteria count,
  dependencies, business rules"
- "Watch it assign t-shirt sizes before converting to hours —
  that is the reasoning step"

### After It Completes
Open `docs/reports/effort-estimate-report.html` in a browser.
Walk through:
- Executive Summary — total effort, days, complexity rating
- Effort by Task Type bar chart — "notice FRONTEND takes the most
  time — that reflects reality"
- Complexity Reasoning table — read one reasoning statement aloud
- Full Work Item Breakdown — collapse and expand a few epics

### Key Talking Point
> "Every estimate has a reason. This is not a random number — the
> agent shows its working. A stakeholder can challenge any line
> and the reasoning is right there."

### Recovery
If the report does not open:
Right-click `effort-estimate-report.html` → Open with → Browser
The file is self-contained — no server needed.

---

## Phase 5: Sprint Planning — @sprint-planning-agent
**Duration: 15 minutes**

### What to Say Before Invoking
> "We have the work. We have the estimates. Now we plan the sprints.
> The agent is going to read everything silently, then ask us three
> questions about our team. Watch."

### How to Invoke
```
@sprint-planning-agent create the sprint plan
```

### The Conversation Moment
When the agent asks its three capacity questions, involve the audience:
> "Let's ask the room — how many backend developers should we assume?
> How many hours per sprint?"

This is the most interactive moment in the workshop. Use it.

Typical answers to suggest if the room is unsure:
- 2 backend developers, 1 frontend, 1 database
- 40 hours per sprint per developer
- 3 sprints planned

### After It Completes
Open `docs/reports/sprint-plan-report.html` in a browser.
Walk through:
- Delivery confidence indicator at the top
- Capacity Overview table — show utilisation percentages
- Sprint 1 card — read the sprint goal, show the stories
- Recommendations section — read one recommendation aloud

### Key Talking Point
> "The agent did not just fill sprints arbitrarily. It respected
> priority — must-haves first. It respected dependencies — nothing
> is scheduled before what it depends on. And it was honest about
> capacity — nothing is overcommitted without flagging it."

### Recovery
If the agent asks for capacity but the audience is unsure:
Suggest: `2 backend developers, 1 frontend, 1 database, 40 hours
per sprint, 3 sprints` — this produces a realistic plan for most
medium-sized requirements.

---

## Phase 6: ADO Sync — @ado-sync-agent
**Duration: 10 minutes**

### What to Say Before Invoking
> "Everything we have built lives in local files right now. In an
> enterprise, your team tracks work in Azure DevOps. Watch the agent
> push the entire hierarchy — epics, features, stories, tasks,
> estimates, sprint assignments — into ADO in one operation."

### How to Invoke
```
@ado-sync-agent push all work items to Azure DevOps
```

### While It Runs — Narrate This
- "It reads the config file first — organisation, project, area path"
- "It creates epics first, then features, then stories, then tasks"
- "Each item is linked to its parent — the hierarchy is preserved"
- "If anything fails, it logs it and continues — it does not abort"

### After It Completes
Switch to the browser with ADO Boards open.
Refresh the board and show:
- Backlog view with the full Epic → Feature → Story → Task hierarchy
- One story with its Remaining Work field populated
- Sprint assignment on stories
- Tags showing task type (DATABASE, BACKEND, FRONTEND, TEST)

### Key Talking Point
> "The team can now start their first sprint. Everything is in ADO.
> Estimates are set. Sprints are assigned. Dependencies are visible.
> What would have taken a week of meetings and manual data entry
> happened in two and a half hours."

### Recovery
If ADO sync fails:
> "The agent logs failures and continues. Let's look at what it
> created successfully — and I will show you the sync state file
> that prevents duplicates if we re-run."
Show `docs/ado-sync-state.json` — this is itself a compelling artefact.

---

## Closing — Q&A and Retrospective
**Duration: 15 minutes**

### Suggested Closing Statement
> "What you have seen today is not a demo of a specific tool —
> it is a pattern. Every agent we used follows the same principles:
> read the authoritative source, preserve the domain language,
> produce a traceable output, hand off to the next agent.
> Your team can extend this framework, replace any agent,
> add new phases, or adapt it to your own tooling.
> This is the starting point — not the ceiling."

### Suggested Q&A Prompts
If the room is quiet, offer these:
- "Which phase surprised you most?"
- "Where in your current process would this save the most time?"
- "What would you want to add or change for your team's workflow?"

### What to Leave With the Customer
- The framework repo with all agents and skills
- The generated HTML reports (effort estimate + sprint plan)
- The ADO board with all work items created
- The Pre-Setup Checklist for their own use
- This facilitator guide (optional — if they want to run it themselves)

---

## Timing Cheat Sheet

| Phase | Agent | Target Time | Hard Stop |
|-------|-------|-------------|-----------|
| Requirements | @brd-agent | 20 min | 25 min |
| Design | @design-agent | 20 min | 25 min |
| Epics | @epic-agent | 6 min | 8 min |
| Features | @feature-agent | 6 min | 8 min |
| Stories | @user-story-agent | 7 min | 10 min |
| Tasks | @task-agent | 6 min | 8 min |
| Estimation | @estimate-agent | 15 min | 20 min |
| Sprint Planning | @sprint-planning-agent | 15 min | 20 min |
| ADO Sync | @ado-sync-agent | 10 min | 15 min |
| Q&A | — | 15 min | 20 min |

If you are running behind, the phases most safe to abbreviate are:
1. Feature agent — invoke and move on, do not walk through files
2. Task agent — show one file only, not all of them
3. ADO sync — show the board after, do not narrate every item created
