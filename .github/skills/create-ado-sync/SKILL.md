---
name: create-ado-sync
description: Syncs the complete local work item hierarchy to Azure DevOps Boards.
  Creates Epics, Features, User Stories, and Tasks with parent-child links,
  effort estimates, and sprint assignments.
---

# Skill — Create ADO Sync

## What You Do
Read all local work item files and create a matching hierarchy in
Azure DevOps Boards using the ADO MCP server. This is a one-way
sync: local files are the source of truth.

```
Local File                         ADO Work Item Type
─────────────────────────────────────────────────────
epics/*.md              →          Epic
features/*.md           →          Feature
stories/*.md            →          User Story / Product Backlog Item / Requirement
issues/*.md             →          Task
```

> The exact work item type used for stories depends on the ADO project's
> process template and is resolved automatically at sync time (see Step 0).

## Prerequisites
Before starting, verify:
- ADO MCP server is connected and responding
- `docs/ado-sync-config.json` exists and contains valid settings
- All local work item files have been reviewed and approved
- **If `documentLinks.enabled` is `true` in the config:** the BRD
  (`docs/requirements/BRD.md`) and the design document
  (`docs/design/design-doc.md`) have been **committed and pushed** to
  the remote repository so the URLs constructed from `repoBaseUrl`
  resolve for ADO users. See Step 0.6 for verification.

Estimates (`effort-estimate-report.html`) and the sprint plan
(`sprint-plan-report.html`) are **not** required for the 1st pass.
If they are absent, leave Remaining Work and Iteration blank on
created items and defer them to the 2nd pass.

## Two-Pass Behaviour

This skill runs in two optional passes, auto-detected from the
presence of `docs/ado-sync-state.json`:

**1st pass — Create (state file does NOT exist):**
- Create the full Epic → Feature → Story → Task hierarchy with
  parent-child links.
- Set Remaining Work only if an `estimatedEffort` value is present
  on the local item; otherwise leave the field blank.
- Set Iteration Path only if a sprint plan exists and assigns the
  story to a sprint; otherwise leave it blank.
- Save the state file at the end.

**2nd pass — Update (state file EXISTS):**
- Skip re-creating tracked items — never create duplicates.
- For each tracked item, update Remaining Work from the latest
  `estimatedEffort` and update Iteration Path from the latest sprint
  plan. Only call the update API if the value actually changed.
- For any local item not yet in the state file (added since the 1st
  pass), create-and-link it as in the 1st pass.
- Update each entry's `lastUpdated` timestamp in the state file.

Both passes are safe to re-run.

## Config File Format
```json
{
  "organization": "https://dev.azure.com/{your-org}",
  "project": "{your-project-name}",
  "areaPath": "{your-project-name}\\{optional-area}",
  "iterationRootPath": "{your-project-name}\\Sprint",
  "processTemplate": "Agile",
  "documentLinks": {
    "enabled": true,
    "repoBaseUrl": "https://github.com/{org}/{repo}/blob/{branch}",
    "brdPath": "docs/requirements/BRD.md",
    "designDocPath": "docs/design/design-doc.md",
    "brdLinkComment": "Business Requirements Document",
    "designDocLinkComment": "Technical Design Document"
  }
}
```

`processTemplate` is optional. Accepted values: `Agile`, `Scrum`, `CMMI`.
If omitted, the agent will auto-detect it from the ADO project API.

`documentLinks` is optional. When present and `enabled: true`, the
agent attaches a `Hyperlink` relation pointing to the BRD on every
Epic and Feature, and a `Hyperlink` relation pointing to the design
document on every User Story. `repoBaseUrl` may point to GitHub,
Azure Repos, GitLab, or Bitbucket — the agent simply concatenates
`{repoBaseUrl}/{brdPath}` and `{repoBaseUrl}/{designDocPath}` to
build the URLs. If `documentLinks` is absent or `enabled: false`,
no hyperlinks are attached.

## Step 0 — Detect Process Template

Before creating any work items, resolve the correct work item type for User Stories.

**If `processTemplate` is set in `docs/ado-sync-config.json`:** use it directly — skip the API call.

**If `processTemplate` is not set:** query the ADO project:
```
GET {organization}/_apis/projects/{project}?includeCapabilities=true&api-version=7.1
```
Read `capabilities.processTemplate.templateName` from the response.

Map the template to the story work item type and store as `storyWorkItemType`:

| Process Template | `storyWorkItemType`      |
|------------------|--------------------------|
| Agile            | `User Story`             |
| Scrum            | `Product Backlog Item`   |
| CMMI             | `Requirement`            |

If detection fails or the template is unrecognised, default to `User Story` and log:
`⚠️ Could not detect process template — defaulting to "User Story"`

## Step 0.6 — Resolve Document Link URLs

If `documentLinks` is missing from the config, or `documentLinks.enabled`
is `false`, set `brdUrl = null` and `designDocUrl = null` and skip the
rest of this step — no hyperlinks will be attached.

Otherwise:

1. Build the URLs:
   - `brdUrl = {repoBaseUrl}/{brdPath}`
   - `designDocUrl = {repoBaseUrl}/{designDocPath}`
   Use forward slashes only. Do not URL-encode `/`. URL-encode spaces
   in path segments as `%20`.
2. **Verify the BRD and design document are committed and pushed.**
   Run a lightweight git check from the workspace root (do not require
   network calls — just inspect the local repo):
   ```
   git ls-files --error-unmatch docs/requirements/BRD.md
   git ls-files --error-unmatch docs/design/design-doc.md
   git status --porcelain docs/requirements/BRD.md docs/design/design-doc.md
   git log -1 --format=%H origin/{branch} -- docs/requirements/BRD.md
   ```
   If either file is untracked, has uncommitted changes, or has local
   commits not yet pushed, **stop and instruct the user** to commit and
   push them before re-running:
   > "⚠️ The BRD or design document is not pushed to the remote.
   > Hyperlinks added to ADO work items would 404 for other users.
   > Commit and push these files, then re-run, **or** set
   > `documentLinks.enabled: false` in `docs/ado-sync-config.json`
   > to skip hyperlink attachment."
   If git is not available, skip the verification and warn the user
   that the URL was not validated.
3. Log:
   `🔗 BRD link: {brdUrl}`
   `🔗 Design doc link: {designDocUrl}`

## Step 1 — Load Sync State and Determine Pass Mode
Read `docs/ado-sync-state.json` if it exists.

- **State file missing** → set `mode = "create"` (1st pass).
- **State file present** → set `mode = "update"` (2nd pass).

Sync state format:
```json
{
  "lastSyncedAt": "{ISO datetime}",
  "lastPass": "create | update",
  "epics": {
    "epic-01": {
      "adoId": 1001,
      "adoUrl": "https://...",
      "hasEstimate": false,
      "hasIteration": false,
      "lastUpdated": "{ISO datetime}"
    }
  },
  "features": { "feature-01-01": { "adoId": 1002, "adoUrl": "...", "hasEstimate": false, "hasIteration": false, "lastUpdated": "..." } },
  "stories":  { "story-01-01-01": { "adoId": 1003, "adoUrl": "...", "hasEstimate": false, "hasIteration": false, "lastUpdated": "..." } },
  "tasks":    { "01-DATABASE-entity-model": { "adoId": 1004, "adoUrl": "...", "hasEstimate": false, "hasIteration": false, "lastUpdated": "..." } },
  "failures": []
}
```

In `create` mode:
- If a local item's ID already appears in the state file with an
  `adoId`, skip it — do not create a duplicate.

In `update` mode:
- Skip the create steps for tracked items entirely.
- For each tracked item, recompute the desired Remaining Work and
  Iteration Path from the latest local files and call the ADO
  update API only if the value differs from `hasEstimate`/`hasIteration`
  state or has changed.
- For any local item NOT in the state file, create-and-link it
  using the same rules as `create` mode.

## Step 2 — Create Epics in ADO

For each Epic file not already in sync state:

**ADO Work Item Type:** `Epic`

**Field mapping:**
| Local Field | ADO Field |
|-------------|-----------|
| title | Title |
| Description section | Description |
| Acceptance Criteria section | Acceptance Criteria |
| estimatedEffort (if present) | Remaining Work |
| source FR IDs | Tags (comma-separated) |

**Steps:**
1. Create the Epic work item using the ADO MCP tool.
2. Set Area Path from config.
3. **If `brdUrl` is set (Step 0.6):** add a `Hyperlink` relation to
   the Epic pointing to `brdUrl` with `comment = brdLinkComment`.
   Use the ADO work item update API with a JSON-Patch operation:
   ```json
   {
     "op": "add",
     "path": "/relations/-",
     "value": {
       "rel": "Hyperlink",
       "url": "{brdUrl}",
       "attributes": { "comment": "{brdLinkComment}" }
     }
   }
   ```
   Before adding, fetch the Epic's existing relations and skip the
   add if a `Hyperlink` with the same URL is already present
   (idempotency).
4. Record the returned ADO work item ID and URL in sync state.
5. Log: `✅ Epic created: {title} → ADO #{id}` (and `🔗 BRD linked` if applicable).

## Step 3 — Create Features in ADO

For each Feature file not already in sync state:

**ADO Work Item Type:** `Feature`

**Field mapping:**
| Local Field | ADO Field |
|-------------|-----------|
| title | Title |
| Description section | Description |
| Acceptance Criteria section | Acceptance Criteria |
| estimatedEffort (if present) | Remaining Work |
| source FR IDs | Tags |

**Steps:**
1. Look up the parent Epic's ADO ID from sync state
   using the feature's `epic` frontmatter field.
2. Create the Feature work item.
3. Link to parent Epic using ADO parent-child relationship.
4. Set Area Path from config.
5. **If `brdUrl` is set (Step 0.6):** add a `Hyperlink` relation to
   the Feature pointing to `brdUrl` with `comment = brdLinkComment`,
   using the same JSON-Patch operation shown in Step 2. Skip if a
   `Hyperlink` with the same URL already exists on the Feature.
6. Record ADO ID and URL in sync state.
7. Log: `✅ Feature created: {title} → ADO #{id} (child of Epic #{parentId})` (and `🔗 BRD linked` if applicable).

## Step 4 — Create User Stories in ADO

For each Story file not already in sync state:

**ADO Work Item Type:** `{storyWorkItemType}` (resolved in Step 0 — one of `User Story`, `Product Backlog Item`, or `Requirement`)

**Field mapping:**
| Local Field | ADO Field |
|-------------|-----------|
| title | Title |
| User Story section | Description |
| Acceptance Criteria section | Acceptance Criteria |
| estimatedEffort (if present) | Remaining Work |
| priority | Priority (1=must-have, 2=should-have, 3=could-have) |
| source FR IDs | Tags |
| sprint assignment (from sprint plan) | Iteration Path |

**Priority mapping:**
| Local Priority | ADO Priority |
|----------------|--------------|
| must-have | 1 |
| should-have | 2 |
| could-have | 3 |

**Sprint mapping:**
Read `docs/reports/sprint-plan-report.html` to determine which
sprint each story was assigned to. Map sprint number to ADO
Iteration Path:
```
Sprint 1 → {iterationRootPath} 1
Sprint 2 → {iterationRootPath} 2
```

If `sprint-plan-report.html` does not exist (1st pass before
sprint planning), leave Iteration Path blank and set
`hasIteration: false` in the state file. The 2nd pass will
populate it later.

**Steps:**
1. Look up the parent Feature's ADO ID from sync state
   using the story's `feature` frontmatter field.
2. Create the User Story work item.
3. Link to parent Feature using ADO parent-child relationship.
4. Set Iteration Path based on sprint assignment.
5. Set Area Path from config.
6. **If `designDocUrl` is set (Step 0.6):** add a `Hyperlink` relation
   to the Story pointing to `designDocUrl` with
   `comment = designDocLinkComment`, using the same JSON-Patch
   operation shown in Step 2. Skip if a `Hyperlink` with the same
   URL already exists on the Story.
7. Record ADO ID and URL in sync state.
8. Log: `✅ Story created: {title} → ADO #{id} (child of Feature #{parentId}, Sprint {N})` (and `🔗 Design doc linked` if applicable).

## Step 5 — Create Tasks in ADO

For each Task file not already in sync state:

**ADO Work Item Type:** `Task`

**Field mapping:**
| Local Field | ADO Field |
|-------------|-----------|
| title | Title |
| Description section | Description |
| Acceptance Criteria section | Acceptance Criteria |
| estimatedEffort | Remaining Work |
| taskType | Tags (e.g. DATABASE, BACKEND, UNIT-TEST, FRONTEND, E2E-TEST) |

**Steps:**
1. Look up the parent Story's ADO ID from sync state
   using the task's `userStory` frontmatter field.
2. Create the Task work item.
3. Link to parent User Story using ADO parent-child relationship.
4. Set Area Path from config.
5. Record ADO ID and URL in sync state.
6. Log: `✅ Task created: {title} → ADO #{id} (child of Story #{parentId})`

## Step 6 — Handle Failures

If any work item creation fails:
1. Log the failure:
   `❌ Failed: {item type} {local id} — {error message}`
2. Record in the `failures` array in sync state:
   ```json
   {
     "localId": "feature-02-01",
     "type": "Feature",
     "error": "Parent Epic ADO ID not found in sync state",
     "timestamp": "{ISO datetime}"
   }
   ```
3. Continue processing remaining items.
4. At the end, summarise all failures clearly.

**Common failure causes and resolutions:**
| Failure | Likely Cause | Resolution |
|---------|-------------|------------|
| Parent ID not found | Parent was not created yet or failed | Check sync state, re-run |
| 401 Unauthorized | PAT token expired or invalid | Refresh PAT in config |
| 404 Project not found | Organisation or project name wrong | Check ado-sync-config.json |
| Iteration Path not found | Sprint path does not exist in ADO | Create iteration in ADO first |

## Step 7 — Save Sync State

After all items are processed, save the complete sync state to
`docs/ado-sync-state.json` including:
- `lastSyncedAt` timestamp
- `lastPass` (`create` or `update`)
- All tracked items with their ADO IDs and URLs, plus
  `hasEstimate`, `hasIteration`, and `lastUpdated`
- All failures with error details

This file ensures both passes are idempotent — safe to re-run
without creating duplicates.

## Step 8 — Print Sync Summary

After saving state, print a clear summary that reflects the pass mode.

**1st pass (create) summary:**
```
ADO Sync — 1st pass complete
─────────────────────────────────────
✅ Epics created:        {N}
✅ Features created:     {N}
✅ User Stories created: {N}
✅ Tasks created:        {N}
─────────────────────────────────────
⏭️  Skipped (already synced): {N}
❌ Failed: {N}
─────────────────────────────────────
Deferred to 2nd pass:
  • Items without Remaining Work: {N}
  • Items without Iteration:      {N}
Total work items in ADO: {N}
View board: {organization}/{project}/_boards
Next: run estimate-agent → sprint-planning-agent → re-run this agent.
```

**2nd pass (update) summary:**
```
ADO Sync — 2nd pass complete
─────────────────────────────────────
🔄 Remaining Work updated: {N}
🔄 Iteration updated:      {N}
➕ New items created:      {N}
⏭️  Unchanged:              {N}
❌ Failed: {N}
─────────────────────────────────────
View board: {organization}/{project}/_boards
```

If there are failures, list them explicitly and suggest resolution steps.

## Idempotency Rules
- **Never create a duplicate.** Always check sync state first.
- **Updates are limited to Remaining Work and Iteration Path.**
  In `update` mode (2nd pass), only these two fields may be written
  back to ADO. Title, Description, Acceptance Criteria, Tags, and
  Area Path are written only at create time — further edits to
  those fields are made directly in ADO by the team.
- **Never delete ADO work items.** If a local item was removed,
  handle it manually in ADO.
- **Re-running is safe.** Already-synced items are skipped (1st pass)
  or updated in place (2nd pass); failed items are retried.

## What NOT to Do
- Do NOT sync without reading the config file first.
- Do NOT create child items before their parent exists in ADO.
- Do NOT abort the entire sync on a single failure —
  log and continue.
- Do NOT overwrite an existing `adoId` in the sync state file.
- Do NOT map effort to Story Points — use Remaining Work only.
- Do NOT sync items that have not been reviewed and approved.
