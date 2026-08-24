# Workshop Pre-Setup Checklist

Complete all items below before the workshop starts.
Estimated setup time: 30 minutes.

---

## 1. Software Requirements
Verify on the facilitator machine:

- [ ] VS Code installed (latest version)
- [ ] GitHub Copilot extension installed and signed in
- [ ] Git installed and configured

---

## 2. Repository Setup

- [ ] Create or select the GitHub repository for the workshop
- [ ] Clone the repository locally
- [ ] Copy the `.github/` folder (agents and skills) into the repo root
- [ ] Run the workspace initialisation script:
  - Mac/Linux: `bash init-workspace.sh`
  - Windows: `.\init-workspace.ps1`
- [ ] Verify the following folders exist:
  ```
  docs/requirements/
  docs/design/
  docs/work-items/epics/
  docs/work-items/features/
  docs/work-items/stories/
  docs/reports/
  issues/
  ```
- [ ] Commit and push the initial structure

---

## 3. GitHub Platform Setup *(recommended — no Azure DevOps required)*

> Use this section when running the workshop with GitHub Issues,
> GitHub Projects, GitHub Actions, and Copilot agents instead of ADO.

- [ ] GitHub CLI (`gh`) installed and authenticated:
  ```bash
  gh auth status
  ```
- [ ] GitHub Project created for the repository or organisation
- [ ] Project fields created:
  - `Type` — Single select: `Epic`, `Feature`, `User Story`, `Task`
  - `Priority` — Single select: `must-have`, `should-have`, `could-have`
  - `Effort` — Number field
  - `Sprint` — Iteration field
  - `Task Type` — Single select: `DATABASE`, `BACKEND`, `FRONTEND`, `UNIT-TEST`, `E2E-TEST`
- [ ] Repository labels created:
  - `epic`, `feature`, `user-story`, `task`
  - `database`, `backend`, `frontend`, `unit-test`, `e2e-test`
  - `must-have`, `should-have`, `could-have`
- [ ] GitHub Project workflows enabled:
  - Auto-add labeled issues
  - Set new items to Todo
  - Move closed issues to Done
  - Move linked issues to Done when pull requests merge
- [ ] Review the GitHub-native runbook:
  `docs/GHE-COMPLETE-WORKSHOP-FLOW.md`

---

## 4. ADO Boards Setup *(optional — skip if not using Azure DevOps)*

> **Local-only users or teams using other issue trackers:** Skip this entire section. The ADO MCP server, PAT, and board configuration are only needed if you plan to run `ado-sync-agent` to push work items to Azure DevOps Boards.

- [ ] ADO project created and accessible
- [ ] Sprints (Iterations) created in ADO:
  - Sprint 1, Sprint 2, Sprint 3 (create at least 3)
  - Path format: `{project}\Sprint 1`, `{project}\Sprint 2` etc.
- [ ] Area path confirmed
- [ ] Personal Access Token (PAT) generated **or** `az login` completed:
  - PAT scopes required: Work Items (Read & Write)
  - PAT expiry: set beyond the workshop date
- [ ] ADO MCP server installed and configured in VS Code
  (see [ado-mcp-setup.md](ado-mcp-setup.md) for full instructions —
  edit `.vscode/mcp.json`, authenticate, then start the server)
- [ ] ADO MCP server tested — verify it can list projects
  (in Copilot Chat: *"List my Azure DevOps projects"*)

---

## 5. Config Files

- [ ] Fill in `workshop-stack.md` with the customer's tech stack:
  - Language, runtime, framework, folder paths, ORM, test framework
  - Ensure no `{placeholder}` values remain before running `design-agent`
- [ ] *(Optional — ADO only)* Update `docs/ado-sync-config.json`:
  ```json
  {
    "organization": "https://dev.azure.com/{your-org}",
    "project": "{your-project-name}",
    "areaPath": "{your-project-name}\\{optional-area}",
    "iterationRootPath": "{your-project-name}\\Sprint"
  }
  ```

---

## 6. Requirement Preparation

- [ ] Customer requirement prepared as plain text
  (paste-ready or saved as a `.txt` file in the repo root)
- [ ] Requirement reviewed — confirm it is:
  - Specific enough to produce a real BRD
  - Not so large it produces 20+ epics
  - Domain-specific with named entities and roles
- [ ] Requirement tested against `brd-agent` at least once
  in a dry run before the workshop day

---

## 7. Dry Run Verification

Run the full chain at least once end-to-end before the workshop:

- [ ] `brd-agent` produces a complete BRD
- [ ] `design-agent` produces a complete design document
- [ ] `epic-agent` produces 3-7 epics
- [ ] `feature-agent` produces 2-5 features per epic
- [ ] `user-story-agent` produces 2-5 stories per feature
- [ ] `task-agent` produces 3-4 tasks per story
- [ ] GitHub Issues can be created from generated work-item files
- [ ] GitHub sub-issues can represent Epic → Feature → Story → Task hierarchy
- [ ] GitHub Project board shows work by Status, Sprint, Type, and Priority
- [ ] `estimate-agent` produces estimates and HTML report
- [ ] `sprint-planning-agent` produces sprint plan HTML report
- [ ] *(Optional — ADO only)* `ado-sync-agent` creates all work items in ADO correctly
- [ ] *(Optional — ADO only)* ADO board shows correct Epic → Feature → Story → Task hierarchy

---

## 8. On The Day — Final Checks

- [ ] VS Code open with the workshop repo loaded
- [ ] GitHub Copilot Chat panel open
- [ ] GitHub Project board open in browser
- [ ] GitHub Issues page open in browser
- [ ] *(Optional — ADO only)* ADO board open in browser (logged in)
- [ ] Requirement text ready to paste
- [ ] *(Optional — ADO only)* `docs/ado-sync-state.json` deleted if re-running from scratch
- [ ] All files in `issues/` and `docs/work-items/`
      cleared if re-running from scratch

---

## Recovery Scenarios

**Agent produces unexpected output:**
- Ask it to try again with more specific instructions
- Reference the relevant design doc section explicitly
- If output is partially wrong, edit the file manually and continue

**GitHub issue creation or Project setup fails:**
- Run `gh auth status` and re-authenticate if needed
- Confirm the Project exists and the current account has write access
- Confirm required labels and Project fields exist before importing work items
- Re-run only the failed issue or Project update step

**ADO sync fails:**
- Check `docs/ado-sync-state.json` for failure details
- Verify PAT token has not expired
- Verify iteration paths exist in ADO
- Re-run `ado-sync-agent` — already-synced items will be skipped

**Sprint planning produces unrealistic plan:**
- Adjust team capacity inputs when prompted
- Re-invoke `sprint-planning-agent` with corrected numbers
- The HTML report will be overwritten with the new plan
