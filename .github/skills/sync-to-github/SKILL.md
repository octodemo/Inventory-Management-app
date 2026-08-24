---
name: sync-to-github
description: >
  Pushes Epics, Features, User Stories, and Tasks to GitHub Issues;
  builds the sub-issue hierarchy; syncs Effort and Sprint fields on a
  GitHub Project; and implements the branch-per-task PR workflow.
  Used exclusively by github-sync-agent.
---

# Skill — Sync to GitHub

## Overview

This skill covers **all** GitHub CLI (`gh`) operations needed to move
the locally generated work-item files into the GitHub platform:

```
Phase A  — Push Epics        → GitHub Issues (label: epic)
Phase B  — Push Features     → GitHub Issues (label: feature) + sub-issue of Epic
Phase C  — Push User Stories → GitHub Issues (label: user-story,<priority>) + sub-issue of Feature
Phase D  — Push Tasks        → GitHub Issues (label: task,<type>) + sub-issue of User Story
Phase E  — Sync Estimates    → GitHub Project Effort field (number, hours)
Phase F  — Sync Sprints      → GitHub Project Sprint iteration field
Phase G  — Branch-per-Task   → gh issue develop → implement → PR with Closes #N
```

Execute only the phase(s) relevant to the current invocation.

---

## Prerequisites

Before running any phase, verify:
- `gh` CLI is installed: `gh --version`
- `gh` is authenticated: `gh auth status`
- Required labels exist in the repository (create them if missing — see
  **Label Bootstrap** below).
- A GitHub Project exists and its number is known.

### Label Bootstrap

Run once per repository to ensure all required labels exist:

```bash
for label in epic feature user-story task database backend frontend unit-test e2e-test must-have should-have could-have; do
  gh label create "$label" --color "#0075ca" --force
done
```

`--force` is a no-op if the label already exists, making this idempotent.

---

## State File — `docs/github-sync-state.json`

Before creating any issue, read `docs/github-sync-state.json`.
If the file does not exist, initialise it:

```json
{
  "epics": {},
  "features": {},
  "stories": {},
  "tasks": {}
}
```

Structure (append after each creation):

```json
{
  "epics":    { "epic-01": 42, "epic-02": 43 },
  "features": { "feature-01": 44 },
  "stories":  { "story-01": 45 },
  "tasks":    { "01-DATABASE-item-model": 46 }
}
```

Keys are the file stem (without `.md`); values are GitHub Issue numbers.
**Never create an issue whose key is already present in the state file.**

---

## Phase A — Push Epics

```bash
for file in docs/work-items/epics/epic-*.md; do
  stem=$(basename "$file" .md)
  # Skip if already synced
  if jq -e ".epics[\"$stem\"]" docs/github-sync-state.json > /dev/null 2>&1; then
    echo "SKIP $stem (already exists)"
    continue
  fi

  title=$(grep '^title:' "$file" | sed 's/title:[[:space:]]*//')
  number=$(gh issue create \
    --title "$title" \
    --label "epic" \
    --body-file "$file" \
    --json number --jq '.number')

  # Add to GitHub Project
  issue_url="$(gh repo view --json url --jq '.url')/issues/$number"
  gh project item-add "$GITHUB_PROJECT_NUMBER" \
    --owner "$GITHUB_ORG" \
    --url "$issue_url"

  # Record in state file
  jq ".epics[\"$stem\"] = $number" docs/github-sync-state.json \
    > docs/github-sync-state.tmp && mv docs/github-sync-state.tmp docs/github-sync-state.json

  echo "CREATED Epic #$number — $title"
done
```

> **Variables** — set `GITHUB_PROJECT_NUMBER` and `GITHUB_ORG` from
> `docs/ado-sync-config.json` (fields `githubProjectNumber` and `githubOrg`)
> before running the loop.

---

## Phase B — Push Features

```bash
for file in docs/work-items/features/feature-*.md; do
  stem=$(basename "$file" .md)
  if jq -e ".features[\"$stem\"]" docs/github-sync-state.json > /dev/null 2>&1; then
    echo "SKIP $stem"; continue
  fi

  title=$(grep '^title:' "$file" | sed 's/title:[[:space:]]*//')
  # Resolve parent Epic issue number from state file
  parent_epic=$(grep '^epic:' "$file" | sed 's/epic:[[:space:]]*//')
  epic_number=$(jq -r ".epics[\"$parent_epic\"]" docs/github-sync-state.json)

  number=$(gh issue create \
    --title "$title" \
    --label "feature" \
    --body-file "$file" \
    --json number --jq '.number')

  # Link as sub-issue of the parent Epic
  if [ "$epic_number" != "null" ] && [ -n "$epic_number" ]; then
    gh issue edit "$number" --add-sub-issue-of "$epic_number"
  fi

  issue_url="$(gh repo view --json url --jq '.url')/issues/$number"
  gh project item-add "$GITHUB_PROJECT_NUMBER" --owner "$GITHUB_ORG" --url "$issue_url"

  jq ".features[\"$stem\"] = $number" docs/github-sync-state.json \
    > docs/github-sync-state.tmp && mv docs/github-sync-state.tmp docs/github-sync-state.json

  echo "CREATED Feature #$number — $title (sub-issue of Epic #$epic_number)"
done
```

> **Front-matter convention** — the feature file must contain an `epic:` field
> whose value matches the state-file key of its parent epic
> (e.g. `epic: epic-01`). The `feature-agent` / `create-features` skill must
> include this field. If it is missing, emit a warning and skip the sub-issue
> link but still create the issue.

---

## Phase C — Push User Stories

```bash
for file in docs/work-items/stories/story-*.md; do
  stem=$(basename "$file" .md)
  if jq -e ".stories[\"$stem\"]" docs/github-sync-state.json > /dev/null 2>&1; then
    echo "SKIP $stem"; continue
  fi

  title=$(grep '^title:' "$file" | sed 's/title:[[:space:]]*//')
  priority=$(grep '^priority:' "$file" | sed 's/priority:[[:space:]]*//')
  parent_feature=$(grep '^feature:' "$file" | sed 's/feature:[[:space:]]*//')
  feature_number=$(jq -r ".features[\"$parent_feature\"]" docs/github-sync-state.json)

  number=$(gh issue create \
    --title "$title" \
    --label "user-story,$priority" \
    --body-file "$file" \
    --json number --jq '.number')

  if [ "$feature_number" != "null" ] && [ -n "$feature_number" ]; then
    gh issue edit "$number" --add-sub-issue-of "$feature_number"
  fi

  issue_url="$(gh repo view --json url --jq '.url')/issues/$number"
  gh project item-add "$GITHUB_PROJECT_NUMBER" --owner "$GITHUB_ORG" --url "$issue_url"

  jq ".stories[\"$stem\"] = $number" docs/github-sync-state.json \
    > docs/github-sync-state.tmp && mv docs/github-sync-state.tmp docs/github-sync-state.json

  echo "CREATED Story #$number — $title (sub-issue of Feature #$feature_number)"
done
```

---

## Phase D — Push Tasks

```bash
for file in issues/*.md; do
  stem=$(basename "$file" .md)
  if jq -e ".tasks[\"$stem\"]" docs/github-sync-state.json > /dev/null 2>&1; then
    echo "SKIP $stem"; continue
  fi

  title=$(grep '^title:' "$file" | sed 's/title:[[:space:]]*//')
  # Derive task-type label from [TYPE] prefix in title (e.g. [DATABASE] → database)
  type_label=$(echo "$title" | grep -oP '\[\K[^\]]+' | tr '[:upper:]' '[:lower:]')
  parent_story=$(grep '^story:' "$file" | sed 's/story:[[:space:]]*//')
  story_number=$(jq -r ".stories[\"$parent_story\"]" docs/github-sync-state.json)

  number=$(gh issue create \
    --title "$title" \
    --label "task,$type_label" \
    --body-file "$file" \
    --json number --jq '.number')

  if [ "$story_number" != "null" ] && [ -n "$story_number" ]; then
    gh issue edit "$number" --add-sub-issue-of "$story_number"
  fi

  issue_url="$(gh repo view --json url --jq '.url')/issues/$number"
  gh project item-add "$GITHUB_PROJECT_NUMBER" --owner "$GITHUB_ORG" --url "$issue_url"

  jq ".tasks[\"$stem\"] = $number" docs/github-sync-state.json \
    > docs/github-sync-state.tmp && mv docs/github-sync-state.tmp docs/github-sync-state.json

  echo "CREATED Task #$number — $title (sub-issue of Story #$story_number)"
done
```

---

## Phase E — Sync Estimates to GitHub Project

Run after `estimate-agent` has updated `estimatedEffort:` in each task file.

```bash
# Requires GITHUB_PROJECT_NUMBER, GITHUB_ORG, EFFORT_FIELD_ID
# Retrieve EFFORT_FIELD_ID once:
#   gh project field-list $GITHUB_PROJECT_NUMBER --owner $GITHUB_ORG --format json

for file in issues/*.md; do
  stem=$(basename "$file" .md)
  issue_number=$(jq -r ".tasks[\"$stem\"]" docs/github-sync-state.json)
  [ "$issue_number" = "null" ] && continue

  # Parse estimatedEffort (e.g. "1.5h" or "30min") — convert to decimal hours
  raw=$(grep '^estimatedEffort:' "$file" | sed 's/estimatedEffort:[[:space:]]*//')
  if echo "$raw" | grep -q 'min'; then
    minutes=$(echo "$raw" | grep -oP '[0-9]+')
    effort=$(echo "scale=2; $minutes/60" | bc)
  else
    effort=$(echo "$raw" | grep -oP '[0-9.]+')
  fi

  # Get the project item ID for this issue
  item_id=$(gh project item-list "$GITHUB_PROJECT_NUMBER" \
    --owner "$GITHUB_ORG" --format json \
    | jq -r ".items[] | select(.content.number == $issue_number) | .id")

  [ -z "$item_id" ] && echo "WARN: No project item for issue #$issue_number" && continue

  gh project item-edit \
    --project-id "$(gh project view $GITHUB_PROJECT_NUMBER --owner $GITHUB_ORG --format json | jq -r '.id')" \
    --id "$item_id" \
    --field-id "$EFFORT_FIELD_ID" \
    --number "$effort"

  echo "EFFORT $effort h set on issue #$issue_number"
done
```

---

## Phase F — Sync Sprints to GitHub Project

Run after `sprint-planning-agent` has produced `docs/reports/sprint-plan-report.html`
and the agent has parsed which story/task belongs to which sprint.

```bash
# Requires GITHUB_PROJECT_NUMBER, GITHUB_ORG, SPRINT_FIELD_ID
# Retrieve SPRINT_FIELD_ID and iteration IDs once:
#   gh project field-list $GITHUB_PROJECT_NUMBER --owner $GITHUB_ORG --format json

# sprint-assignments.json shape (produced by sprint-planning-agent):
# { "story-01": { "sprint": 1, "iteration_id": "<id>" }, ... }

jq -c 'to_entries[]' docs/sprint-assignments.json | while IFS= read -r entry; do
  stem=$(echo "$entry" | jq -r '.key')
  iteration_id=$(echo "$entry" | jq -r '.value.iteration_id')

  # Resolve issue number from state file (check stories then tasks)
  issue_number=$(jq -r "(.stories[\"$stem\"] // .tasks[\"$stem\"] // \"null\")" \
    docs/github-sync-state.json)
  [ "$issue_number" = "null" ] && continue

  item_id=$(gh project item-list "$GITHUB_PROJECT_NUMBER" \
    --owner "$GITHUB_ORG" --format json \
    | jq -r ".items[] | select(.content.number == $issue_number) | .id")

  [ -z "$item_id" ] && continue

  gh project item-edit \
    --project-id "$(gh project view $GITHUB_PROJECT_NUMBER --owner $GITHUB_ORG --format json | jq -r '.id')" \
    --id "$item_id" \
    --field-id "$SPRINT_FIELD_ID" \
    --iteration-id "$iteration_id"

  echo "SPRINT assigned on issue #$issue_number → iteration $iteration_id"
done
```

> **`docs/sprint-assignments.json`** is a machine-readable file that
> `sprint-planning-agent` must produce alongside the HTML report. It maps
> each work-item file stem to its sprint number and GitHub iteration ID.
> The `sprint-planning-agent` should be updated to also emit this file.

---

## Phase G — Branch-per-Task PR Workflow

For each task during implementation, follow this workflow exactly:

```bash
# 1. Create a branch linked to the task issue and check it out
gh issue develop <issue-number> --checkout
# Branch is automatically named: <issue-number>-<slug-of-title>

# 2. Implement the task using implement-agent in VS Code

# 3. Stage, commit with closing keyword, and push
git add .
git commit -m "closes #<issue-number>: <title-from-task-file>"
git push

# 4. Open a Pull Request linked to the issue
gh pr create \
  --title "<title-from-task-file> (#<issue-number>)" \
  --body "Closes #<issue-number>" \
  --label "<type-label>"
```

> Using `Closes #<issue-number>` in the PR body automatically closes the
> issue and moves it to **Done** on the GitHub Project board when the PR
> is merged (requires the built-in Project automation to be enabled).

### Enable Project Automations (one-time)

In your GitHub Project → **Settings → Workflows**, enable:
- ✅ Auto-add to project when labeled `task`
- ✅ Item closed → Status = Done
- ✅ Pull request merged → linked issue Status = Done
- ✅ Item added → Status = Todo

---

## Validation Checklist

Before reporting completion, verify:
- [ ] `docs/github-sync-state.json` has an entry for every file processed
- [ ] No duplicate issues created (state file was checked before every `gh issue create`)
- [ ] Sub-issue links are set: Feature → Epic, Story → Feature, Task → Story
- [ ] All issues appear on the GitHub Project board
- [ ] Effort fields are set on all task issues (Phase E only)
- [ ] Sprint iterations are set on assigned items (Phase F only)
- [ ] PRs use `Closes #N` syntax and carry the correct type label (Phase G only)

## What NOT to Do
- Do NOT rename issue titles — use the `title:` front-matter value verbatim.
- Do NOT truncate the issue body — use `--body-file` with the full `.md` file.
- Do NOT run all phases at once unless the user explicitly asks for a full sync.
- Do NOT hard-code project IDs or iteration IDs — always resolve them via `gh` CLI.
- Do NOT skip the state file check — idempotency is mandatory.
