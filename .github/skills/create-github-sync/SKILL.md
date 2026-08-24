---
name: create-github-sync
description: Syncs the complete local work item hierarchy to GitHub Issues.
  Creates Epics, Features, User Stories, and Tasks with correct labels,
  parent-child tasklist linking, and optional GitHub Project field updates.
---

# Skill — Create GitHub Sync

## What You Do
Read all local work item files and create a matching hierarchy of
GitHub Issues using the GitHub CLI (`gh`). This is a one-way sync:
local files are the source of truth.

```
Local File                         GitHub Issue + Labels
─────────────────────────────────────────────────────────────────
epics/*.md              →          Issue with label: epic
features/*.md           →          Issue with labels: feature
stories/*.md            →          Issue with labels: user-story, {priority}
issues/*.md             →          Issue with labels: task, {taskType}
```

Parent-child relationships are represented via **tasklists** in the
parent issue body:
```
Epic #1 body contains:
  ## Child Features
  - [ ] #2 Feature: User Management
  - [ ] #5 Feature: Reporting

Feature #2 body contains:
  ## Child Stories
  - [ ] #3 User Story: Admin can add users
  - [ ] #4 User Story: Admin can delete users
```

## Prerequisites
Before starting, verify:
- GitHub CLI (`gh`) is installed and authenticated (`gh auth status`)
- `docs/github-sync-config.json` exists and contains valid settings
- All required labels exist in the repository (run `scripts/setup-github-project.sh` first)
- All local work item files have been reviewed and approved
- **If `issueLinks.enabled` is `true` in the config:** the BRD
  (`docs/requirements/BRD.md`) and the design document
  (`docs/design/design-doc.md`) have been **committed and pushed** to
  the remote repository so the markdown links resolve for all users.

Estimates (`effort-estimate-report.html`) and the sprint plan
(`sprint-plan-report.html`) are **not** required for the 1st pass.
If they are absent, skip GitHub Project field updates and defer
them to the 2nd pass.

## Two-Pass Behaviour

This skill runs in two optional passes, auto-detected from the
presence of `docs/github-sync-state.json`:

**1st pass — Create (state file does NOT exist):**
- Create the full Epic → Feature → Story → Task hierarchy with
  correct labels and parent-child tasklist linking.
- If `projectNumber` is set in config, add issues to the GitHub
  Project and populate the Type field.
- Set Effort and Sprint fields only if values are available;
  otherwise leave them blank.
- Save the state file at the end.

**2nd pass — Update (state file EXISTS):**
- Skip re-creating tracked items — never create duplicates.
- For each tracked item, update GitHub Project Effort and Sprint
  fields from the latest local files (only if `projectNumber` is set).
- For any local item not yet in the state file (added since the 1st
  pass), create-and-link it as in the 1st pass.
- Update each entry's `lastUpdated` timestamp in the state file.

Both passes are safe to re-run.

## Config File Format
```json
{
  "organization": "{github-org-or-username}",
  "repository": "{repo-name}",
  "projectNumber": null,
  "issueLinks": {
    "enabled": true,
    "brdUrl": "https://github.com/{org}/{repo}/blob/main/docs/requirements/BRD.md",
    "designDocUrl": "https://github.com/{org}/{repo}/blob/main/docs/design/design-doc.md"
  }
}
```

`projectNumber` is optional. If set to a number, the agent will add
issues to that GitHub Project and populate custom fields (Type, Effort,
Sprint, Priority, Task Type). If `null` or omitted, only issue creation
with labels is performed — no project integration.

`issueLinks` is optional. When present and `enabled: true`, the agent
includes markdown links to the BRD in Epic and Feature issue bodies,
and a link to the design document in User Story issue bodies. If
`issueLinks` is absent or `enabled: false`, no links are included.

## Step 0 — Verify Prerequisites

### 0.1 — Verify GitHub CLI authentication
Run:
```bash
gh auth status
```
If the exit code is non-zero or the output shows "not logged in", stop and instruct the user:
> "⚠️ GitHub CLI is not authenticated. Run `gh auth login` and try again."

### 0.2 — Verify required labels exist
Run:
```bash
gh label list --repo {org}/{repo} --limit 100 --json name --jq '.[].name'
```
Check that all required labels are present:
- Work item types: `epic`, `feature`, `user-story`, `task`
- Task types: `database`, `backend`, `frontend`, `unit-test`, `e2e-test`
- Priorities: `must-have`, `should-have`, `could-have`

If any are missing, stop and instruct the user:
> "⚠️ Missing required labels in the repository. Run:
>   `bash scripts/setup-github-project.sh`
> Then re-run this agent."

### 0.3 — Resolve Issue Link URLs
If `issueLinks` is missing from the config, or `issueLinks.enabled`
is `false`, set `brdUrl = null` and `designDocUrl = null` and skip
to Step 1 — no links will be included in issue bodies.

Otherwise:

1. The URLs are already fully formed in the config:
   - `brdUrl = config.issueLinks.brdUrl`
   - `designDocUrl = config.issueLinks.designDocUrl`
2. **Verify the BRD and design document are committed and pushed.**
   Run a lightweight git check from the workspace root:
   ```bash
   git ls-files --error-unmatch docs/requirements/BRD.md
   git ls-files --error-unmatch docs/design/design-doc.md
   git status --porcelain docs/requirements/BRD.md docs/design/design-doc.md
   ```
   If either file is untracked or has uncommitted changes, **warn
   the user** but continue (GitHub will render broken links, but the
   sync proceeds):
   > "⚠️ The BRD or design document is not committed/pushed. Links
   > in GitHub Issues may 404. Commit and push, or set
   > `issueLinks.enabled: false` in `docs/github-sync-config.json`."
   
   If git is not available, skip the verification and log a warning.
3. Log:
   ```
   🔗 BRD link: {brdUrl}
   🔗 Design doc link: {designDocUrl}
   ```

## Step 1 — Load Sync State and Determine Pass Mode
Read `docs/github-sync-state.json` if it exists.

- **State file missing** → set `mode = "create"` (1st pass).
- **State file present** → set `mode = "update"` (2nd pass).

Sync state format:
```json
{
  "lastSyncedAt": "{ISO datetime}",
  "lastPass": "create | update",
  "epics": {
    "epic-01": {
      "issueNumber": 1,
      "issueUrl": "https://github.com/{org}/{repo}/issues/1",
      "hasEffort": false,
      "hasSprint": false,
      "lastUpdated": "{ISO datetime}"
    }
  },
  "features": {
    "feature-01-01": {
      "issueNumber": 2,
      "issueUrl": "https://github.com/{org}/{repo}/issues/2",
      "hasEffort": false,
      "hasSprint": false,
      "lastUpdated": "{ISO datetime}"
    }
  },
  "stories": {
    "story-01-01-01": {
      "issueNumber": 3,
      "issueUrl": "https://github.com/{org}/{repo}/issues/3",
      "hasEffort": false,
      "hasSprint": false,
      "lastUpdated": "{ISO datetime}"
    }
  },
  "tasks": {
    "01-DATABASE-product-model": {
      "issueNumber": 4,
      "issueUrl": "https://github.com/{org}/{repo}/issues/4",
      "hasEffort": false,
      "hasSprint": false,
      "lastUpdated": "{ISO datetime}"
    }
  },
  "failures": [
    {
      "localId": "feature-02-01",
      "type": "Feature",
      "error": "Parent Epic not found in state",
      "timestamp": "{ISO datetime}"
    }
  ]
}
```

In `create` mode:
- If a local item's ID already appears in the state file with an
  `issueNumber`, skip it — do not create a duplicate.

In `update` mode:
- Skip the create steps for tracked items entirely.
- For each tracked item, update GitHub Project Effort and Sprint
  fields only if `projectNumber` is set and the values have changed.
- For any local item NOT in the state file, create-and-link it
  using the same rules as `create` mode.

## Step 2 — Create Epic Issues

For each Epic file not already in sync state:

1. **List all Epic files:**
   ```bash
   ls docs/work-items/epics/*.md 2>/dev/null || echo ""
   ```
   If no files, skip this step entirely.

2. **For each Epic file:**
   - Parse the YAML frontmatter → extract `id`, `title`, `source` (FR IDs).
   - Check state: if `epics[id].issueNumber` exists, skip (already created).
   - Build the issue body:
     ```
     {body from file after frontmatter}
     
     ---
     
     **Functional Requirements:** {source}
     
     {if brdUrl is not null:}
     📄 [Business Requirements Document]({brdUrl})
     
     ## Child Features
     <!-- Tasklist populated after Feature creation -->
     ```
   - Create the issue:
     ```bash
     gh issue create \
       --repo {org}/{repo} \
       --title "{title}" \
       --body "{body}" \
       --label "epic"
     ```
   - Capture the issue number from the output (format: `{url}` where url ends with `/issues/{N}`).
     Parse the number from the URL.
   - Build the issue URL: `https://github.com/{org}/{repo}/issues/{N}`
   - Save to state:
     ```json
     state.epics[id] = {
       "issueNumber": N,
       "issueUrl": "{url}",
       "hasEffort": false,
       "hasSprint": false,
       "lastUpdated": "{ISO now}"
     }
     ```
   - Log: `✅ Created Epic #{N}: {title}`

3. **If `projectNumber` is set in config:**
   - For each created Epic, add it to the project:
     ```bash
     gh project item-add {projectNumber} \
       --owner {org} \
       --url {issueUrl}
     ```
   - Set the Type field to "Epic" (requires querying field IDs first — see Step 7).

## Step 3 — Create Feature Issues

For each Feature file not already in sync state:

1. **List all Feature files:**
   ```bash
   ls docs/work-items/features/*.md 2>/dev/null || echo ""
   ```
   If no files, skip this step.

2. **For each Feature file:**
   - Parse frontmatter → extract `id`, `title`, `epic` (parent reference), `source`.
   - Check state: if `features[id].issueNumber` exists, skip.
   - **Look up parent Epic's issue number** from `state.epics[epic].issueNumber`.
     If not found, log to `failures[]`:
     ```json
     {
       "localId": "{id}",
       "type": "Feature",
       "error": "Parent Epic '{epic}' not found in state",
       "timestamp": "{ISO now}"
     }
     ```
     Continue to next Feature.
   - Build the issue body:
     ```
     {body from file}
     
     ---
     
     **Functional Requirements:** {source}
     **Epic:** #{parentEpicIssueNumber}
     
     {if brdUrl is not null:}
     📄 [Business Requirements Document]({brdUrl})
     
     ## Child Stories
     <!-- Tasklist populated after Story creation -->
     ```
   - Create the issue:
     ```bash
     gh issue create \
       --repo {org}/{repo} \
       --title "{title}" \
       --body "{body}" \
       --label "feature"
     ```
   - Capture issue number, build URL, save to state as in Step 2.
   - **Update parent Epic's tasklist:** Read the Epic's current body, append:
     ```
     - [ ] #{featureIssueNumber} {featureTitle}
     ```
     to the `## Child Features` section. Update the Epic:
     ```bash
     gh issue edit {parentEpicIssueNumber} \
       --repo {org}/{repo} \
       --body "{updatedBody}"
     ```
   - Log: `✅ Created Feature #{N}: {title}`

3. **If `projectNumber` is set:**
   - Add to project, set Type = "Feature".

## Step 4 — Create User Story Issues

For each Story file not already in sync state:

1. **List all Story files:**
   ```bash
   ls docs/work-items/stories/*.md 2>/dev/null || echo ""
   ```
   If no files, skip this step.

2. **For each Story file:**
   - Parse frontmatter → extract `id`, `title`, `feature` (parent), `priority`, `source`.
   - Check state: if `stories[id].issueNumber` exists, skip.
   - **Look up parent Feature's issue number** from `state.features[feature].issueNumber`.
     If not found, log to `failures[]` and continue.
   - Build the issue body:
     ```
     {body from file}
     
     ---
     
     **Priority:** {priority}
     **Functional Requirements:** {source}
     **Feature:** #{parentFeatureIssueNumber}
     
     {if designDocUrl is not null:}
     📐 [Technical Design Document]({designDocUrl})
     
     ## Child Tasks
     <!-- Tasklist populated after Task creation -->
     ```
   - Create the issue with labels `user-story` and `{priority}`:
     ```bash
     gh issue create \
       --repo {org}/{repo} \
       --title "{title}" \
       --body "{body}" \
       --label "user-story,{priority}"
     ```
     (where `{priority}` is `must-have`, `should-have`, or `could-have`)
   - Capture issue number, build URL, save to state.
   - **Update parent Feature's tasklist:** Append to `## Child Stories` section:
     ```
     - [ ] #{storyIssueNumber} {storyTitle}
     ```
   - Log: `✅ Created User Story #{N}: {title}`

3. **If `projectNumber` is set:**
   - Add to project, set Type = "User Story", Priority = "{priority}".

## Step 5 — Create Task Issues

For each Task file not already in sync state:

1. **List all Task files in implementation order:**
   ```bash
   ls issues/*.md 2>/dev/null | sort
   ```
   Implementation order: DATABASE → BACKEND → UNIT-TEST → FRONTEND → E2E-TEST
   (Task files are named with numeric prefixes, so `sort` naturally orders them.)

   If no files, skip this step.

2. **For each Task file:**
   - Parse frontmatter → extract `id`, `title`, `taskType`, `userStory` (parent), `dependencies`.
   - Check state: if `tasks[id].issueNumber` exists, skip.
   - **Look up parent Story's issue number** from `state.stories[userStory].issueNumber`.
     If not found, log to `failures[]` and continue.
   - Build the issue body:
     ```
     {body from file}
     
     ---
     
     **Task Type:** {taskType}
     **User Story:** #{parentStoryIssueNumber}
     
     {if dependencies array is not empty:}
     **Depends on:**
     {for each dep in dependencies:}
     - #{state.tasks[dep].issueNumber} {dep}
     {end for}
     ```
   - Determine taskType label (lowercase): `database`, `backend`, `unit-test`, `frontend`, or `e2e-test`.
   - Create the issue with labels `task` and `{taskTypeLabel}`:
     ```bash
     gh issue create \
       --repo {org}/{repo} \
       --title "{title}" \
       --body "{body}" \
       --label "task,{taskTypeLabel}"
     ```
   - Capture issue number, build URL, save to state.
   - **Update parent Story's tasklist:** Append to `## Child Tasks` section:
     ```
     - [ ] #{taskIssueNumber} {taskTitle}
     ```
   - Log: `✅ Created Task #{N}: {title}`

3. **If `projectNumber` is set:**
   - Add to project, set Type = "Task", Task Type = "{taskType}".

## Step 6 — GitHub Projects Integration (Optional)

**Skip this entire step if `projectNumber` is `null` or missing from config.**

For each issue created in Steps 2-5 (that doesn't already have `hasEffort: true` and `hasSprint: true`):

1. **Add issue to project** (if not already added in Steps 2-5):
   ```bash
   gh project item-add {projectNumber} \
     --owner {org} \
     --url {issueUrl}
   ```
   Capture the returned project item ID (needed for field updates).

2. **Retrieve project field IDs** (do this once at the start of Step 6):
   ```bash
   gh project field-list {projectNumber} --owner {org} --format json
   ```
   Parse the JSON to get field IDs for: `Type`, `Priority`, `Task Type`, `Effort`, `Sprint`.

3. **Set Type field** for all work items:
   - Epic → "Epic"
   - Feature → "Feature"
   - User Story → "User Story"
   - Task → "Task"
   
   ```bash
   gh project item-edit \
     --id {projectItemId} \
     --project-id {projectNumber} \
     --field-id {typeFieldId} \
     --single-select-option-id {optionId for Type value}
   ```

4. **Set Priority field** for User Stories only:
   ```bash
   gh project item-edit \
     --id {projectItemId} \
     --project-id {projectNumber} \
     --field-id {priorityFieldId} \
     --single-select-option-id {optionId for priority value}
   ```

5. **Set Task Type field** for Tasks only:
   ```bash
   gh project item-edit \
     --id {projectItemId} \
     --project-id {projectNumber} \
     --field-id {taskTypeFieldId} \
     --single-select-option-id {optionId for taskType value}
   ```

## Step 7 — Update Effort & Sprint Fields (Pass 2 Only)

**Skip this step entirely if `mode = "create"` (1st pass).**

**Skip this step entirely if `projectNumber` is `null`.**

For each item in the state file (`epics`, `features`, `stories`, `tasks`):

1. **Read the local file's frontmatter** → get `estimatedEffort` (if present).
2. **If `estimatedEffort` is present AND `hasEffort: false` in state:**
   - Retrieve the project item ID for this issue (query via `gh project item-list`).
   - Update the Effort field:
     ```bash
     gh project item-edit \
       --id {projectItemId} \
       --project-id {projectNumber} \
       --field-id {effortFieldId} \
       --number {estimatedEffort}
     ```
   - Set `hasEffort: true` in state.

3. **If sprint plan exists** (check for `docs/reports/sprint-plan-report.html`):
   - Parse the HTML report to extract sprint assignments for User Stories.
   - For each Story with a sprint assignment AND `hasSprint: false` in state:
     - Update the Sprint field:
       ```bash
       gh project item-edit \
         --id {projectItemId} \
         --project-id {projectNumber} \
         --field-id {sprintFieldId} \
         --iteration-id {iterationId for sprint}
       ```
     - Set `hasSprint: true` in state.

## Step 8 — Save State & Report

1. **Write the updated state** to `docs/github-sync-state.json`:
   ```json
   {
     "lastSyncedAt": "{ISO now}",
     "lastPass": "{mode}",
     "epics": { ... },
     "features": { ... },
     "stories": { ... },
     "tasks": { ... },
     "failures": [ ... ]
   }
   ```

2. **Print a summary table:**
   ```
   ╔════════════════════════════════════════╗
   ║   GitHub Issues Sync Summary          ║
   ╠════════════════════════════════════════╣
   ║ Epics:    1 created, 0 updated        ║
   ║ Features: 2 created, 0 updated        ║
   ║ Stories:  4 created, 0 updated        ║
   ║ Tasks:   12 created, 0 updated        ║
   ║ Failures: 0                           ║
   ╚════════════════════════════════════════╝
   ```

3. **If failures exist**, list them with actionable guidance:
   ```
   ⚠️ Failures (3):
   1. Feature 'feature-02-01': Parent Epic 'epic-02' not found in state
      → Create the parent Epic first, then re-run this agent.
   2. Task '05-BACKEND-api': Parent Story 'story-03' not found
      → Create the parent Story first, then re-run this agent.
   ```

4. **Log the GitHub Issues URL:**
   ```
   🔗 View issues: https://github.com/{org}/{repo}/issues
   {if projectNumber is set:}
   🔗 View project: https://github.com/orgs/{org}/projects/{projectNumber}
   ```

## Field Mappings Reference

### Work Item Type → Labels
| Local Type   | GitHub Labels                          |
|--------------|----------------------------------------|
| Epic         | `epic`                                 |
| Feature      | `feature`                              |
| User Story   | `user-story`, `{priority}`             |
| Task         | `task`, `{taskTypeLabel}`              |

### Priority → Label
| Frontmatter  | GitHub Label  |
|--------------|---------------|
| must-have    | `must-have`   |
| should-have  | `should-have` |
| could-have   | `could-have`  |

### Task Type → Label
| Frontmatter  | GitHub Label   |
|--------------|----------------|
| DATABASE     | `database`     |
| BACKEND      | `backend`      |
| UNIT-TEST    | `unit-test`    |
| FRONTEND     | `frontend`     |
| E2E-TEST     | `e2e-test`     |

### Local Field → GitHub Project Field
| Local Frontmatter | GitHub Project Field | Type           |
|-------------------|----------------------|----------------|
| type              | Type                 | SINGLE_SELECT  |
| priority          | Priority             | SINGLE_SELECT  |
| taskType          | Task Type            | SINGLE_SELECT  |
| estimatedEffort   | Effort               | NUMBER         |
| (from sprint plan)| Sprint               | ITERATION      |

## What NOT to Do
- Never create duplicate issues — always check state first.
- Never create child issues before their parent exists in state.
- Never modify issue titles or bodies after creation (except to append
  tasklist entries to parent issues).
- Never use GitHub API directly — always use `gh` CLI commands.
- Never assume label or project field IDs — always query them first.
- Never fail the entire sync if one item fails — log to `failures[]`
  and continue with remaining items.
