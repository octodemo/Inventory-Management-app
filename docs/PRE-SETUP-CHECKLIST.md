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

- [ ] Create a new repository in ADO / GitLab / Bitbucket
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

## 3. ADO Boards Setup *(optional — skip if not using Azure DevOps)*

> **GitHub-only or local-only users:** Skip this entire section. The ADO MCP server, PAT, and board configuration are only needed if you plan to run `@ado-sync-agent` to push work items to Azure DevOps Boards.

- [ ] ADO project created and accessible
- [ ] Sprints (Iterations) created in ADO:
  - Sprint 1, Sprint 2, Sprint 3 (create at least 3)
  - Path format: `{project}\Sprint 1`, `{project}\Sprint 2` etc.
- [ ] Area path confirmed
- [ ] Personal Access Token (PAT) generated:
  - Scopes required: Work Items (Read & Write)
  - Expiry: set beyond the workshop date
- [ ] ADO MCP server installed and configured in VS Code
- [ ] ADO MCP server tested — verify it can list projects

---

## 4. Config Files

- [ ] Update `workshop-config.json` with:
  - Workshop name, date, facilitator, customer name
  - Team size and sprint hours per developer
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

## 5. Requirement Preparation

- [ ] Customer requirement prepared as plain text
  (paste-ready or saved as a `.txt` file in the repo root)
- [ ] Requirement reviewed — confirm it is:
  - Specific enough to produce a real BRD
  - Not so large it produces 20+ epics
  - Domain-specific with named entities and roles
- [ ] Requirement tested against `@brd-agent` at least once
  in a dry run before the workshop day

---

## 6. Dry Run Verification

Run the full chain at least once end-to-end before the workshop:

- [ ] `@brd-agent` produces a complete BRD
- [ ] `@design-agent` produces a complete design document
- [ ] `@epic-agent` produces 3-7 epics
- [ ] `@feature-agent` produces 2-5 features per epic
- [ ] `@user-story-agent` produces 2-5 stories per feature
- [ ] `@task-agent` produces 3-4 tasks per story
- [ ] `@estimate-agent` produces estimates and HTML report
- [ ] `@sprint-planning-agent` produces sprint plan HTML report
- [ ] *(Optional — ADO only)* `@ado-sync-agent` creates all work items in ADO correctly
- [ ] *(Optional — ADO only)* ADO board shows correct Epic → Feature → Story → Task hierarchy

---

## 7. On The Day — Final Checks

- [ ] VS Code open with the workshop repo loaded
- [ ] GitHub Copilot Chat panel open
- [ ] ADO board open in browser (logged in)
- [ ] Requirement text ready to paste
- [ ] `docs/ado-sync-state.json` deleted if re-running from scratch
- [ ] All files in `issues/` and `docs/requirements/work-items/`
      cleared if re-running from scratch

---

## Recovery Scenarios

**Agent produces unexpected output:**
- Ask it to try again with more specific instructions
- Reference the relevant design doc section explicitly
- If output is partially wrong, edit the file manually and continue

**ADO sync fails:**
- Check `docs/ado-sync-state.json` for failure details
- Verify PAT token has not expired
- Verify iteration paths exist in ADO
- Re-run `@ado-sync-agent` — already-synced items will be skipped

**Sprint planning produces unrealistic plan:**
- Adjust team capacity inputs when prompted
- Re-invoke `@sprint-planning-agent` with corrected numbers
- The HTML report will be overwritten with the new plan
