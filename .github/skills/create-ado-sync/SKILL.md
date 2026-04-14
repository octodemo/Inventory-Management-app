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

## Config File Format
```json
{
  "organization": "https://dev.azure.com/{your-org}",
  "project": "{your-project-name}",
  "areaPath": "{your-project-name}\\{optional-area}",
  "iterationRootPath": "{your-project-name}\\Sprint",
  "processTemplate": "Agile"
}
```

`processTemplate` is optional. Accepted values: `Agile`, `Scrum`, `CMMI`.
If omitted, the agent will auto-detect it from the ADO project API.

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

## Step 1 — Load Sync State
Read `docs/ado-sync-state.json` if it exists.
This file tracks which local items have already been created in ADO
to prevent duplicates on re-run.

Sync state format:
```json
{
  "lastSyncedAt": "{ISO datetime}",
  "epics": {
    "epic-01": { "adoId": 1001, "adoUrl": "https://..." }
  },
  "features": {
    "feature-01-01": { "adoId": 1002, "adoUrl": "https://..." }
  },
  "stories": {
    "story-01-01-01": { "adoId": 1003, "adoUrl": "https://..." }
  },
  "tasks": {
    "01-DATABASE-entity-model": { "adoId": 1004, "adoUrl": "https://..." }
  },
  "failures": []
}
```

If the file does not exist, start with an empty state.
If a local item's ID already appears in the state file with an
`adoId`, skip it entirely — do not create a duplicate.

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
3. Record the returned ADO work item ID and URL in sync state.
4. Log: `✅ Epic created: {title} → ADO #{id}`

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
5. Record ADO ID and URL in sync state.
6. Log: `✅ Feature created: {title} → ADO #{id} (child of Epic #{parentId})`

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

**Steps:**
1. Look up the parent Feature's ADO ID from sync state
   using the story's `feature` frontmatter field.
2. Create the User Story work item.
3. Link to parent Feature using ADO parent-child relationship.
4. Set Iteration Path based on sprint assignment.
5. Set Area Path from config.
6. Record ADO ID and URL in sync state.
7. Log: `✅ Story created: {title} → ADO #{id} (child of Feature #{parentId}, Sprint {N})`

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
- All successfully created items with their ADO IDs and URLs
- All failures with error details

This file ensures the sync is idempotent — safe to re-run without
creating duplicates.

## Step 8 — Print Sync Summary

After saving state, print a clear summary:

```
ADO Sync Complete
─────────────────────────────────────
✅ Epics created:        {N}
✅ Features created:     {N}
✅ User Stories created: {N}
✅ Tasks created:        {N}
─────────────────────────────────────
⏭️  Skipped (already synced): {N}
❌ Failed: {N}
─────────────────────────────────────
Total work items in ADO: {N}
View board: {organization}/{project}/_boards
```

If there are failures, list them explicitly and suggest resolution steps.

## Idempotency Rules
- **Never create a duplicate.** Always check sync state first.
- **Never update existing ADO work items.** This is a one-way
  initial sync — updates are made directly in ADO by the team.
- **Never delete ADO work items.** If a local item was removed,
  handle it manually in ADO.
- **Re-running is safe.** Already-synced items are skipped,
  failed items are retried.

## What NOT to Do
- Do NOT sync without reading the config file first.
- Do NOT create child items before their parent exists in ADO.
- Do NOT abort the entire sync on a single failure —
  log and continue.
- Do NOT overwrite an existing `adoId` in the sync state file.
- Do NOT map effort to Story Points — use Remaining Work only.
- Do NOT sync items that have not been reviewed and approved.
