#!/bin/bash

# Usage:
#   export PROJECT_NUMBER=1
#   export ORG=octodemo   # optional; defaults to octodemo
#   bash scripts/setup-github-project.sh
#
# This script:
#   1) Creates/updates repository labels in the configured repository
#   2) Creates GitHub Project custom fields
#
# Note:
#   Sprint duration (2 weeks) must be set manually in Project Settings
#   after creating the Sprint iteration field.

set -euo pipefail

usage() {
  cat <<'USAGE'
Usage:
  export PROJECT_NUMBER=<project-number>
  export ORG=octodemo   # optional
  bash scripts/setup-github-project.sh
USAGE
}

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  usage
  exit 0
fi

if [[ -z "${PROJECT_NUMBER:-}" ]]; then
  echo "Error: PROJECT_NUMBER is required."
  usage
  exit 1
fi

ORG="${ORG:-octodemo}"
REPO_NAME="Inventory-Management-app"
REPO="${ORG}/${REPO_NAME}"

echo "==> Setting up labels in ${REPO}"

# Work item type labels
gh label create "epic"       --color "8B4FBE" --repo "${REPO}" --force
gh label create "feature"    --color "0075CA" --repo "${REPO}" --force
gh label create "user-story" --color "006B75" --repo "${REPO}" --force
gh label create "task"       --color "E4E669" --repo "${REPO}" --force

# Task type labels
gh label create "database"   --color "D93F0B" --repo "${REPO}" --force
gh label create "backend"    --color "0052CC" --repo "${REPO}" --force
gh label create "frontend"   --color "0E8A16" --repo "${REPO}" --force
gh label create "unit-test"  --color "F9D0C4" --repo "${REPO}" --force
gh label create "e2e-test"   --color "FBCA04" --repo "${REPO}" --force

# Priority labels
gh label create "must-have"   --color "B60205" --repo "${REPO}" --force
gh label create "should-have" --color "E99695" --repo "${REPO}" --force
gh label create "could-have"  --color "F9D0C4" --repo "${REPO}" --force

echo "==> Creating GitHub Project fields in org '${ORG}', project #${PROJECT_NUMBER}"

echo " -> Type (SINGLE_SELECT)"
gh project field-create "${PROJECT_NUMBER}" \
  --owner "${ORG}" \
  --name "Type" \
  --data-type "SINGLE_SELECT" \
  --single-select-options "Epic,Feature,User Story,Task"

echo " -> Priority (SINGLE_SELECT)"
gh project field-create "${PROJECT_NUMBER}" \
  --owner "${ORG}" \
  --name "Priority" \
  --data-type "SINGLE_SELECT" \
  --single-select-options "must-have,should-have,could-have"

echo " -> Effort (NUMBER)"
gh project field-create "${PROJECT_NUMBER}" \
  --owner "${ORG}" \
  --name "Effort" \
  --data-type "NUMBER"

echo " -> Sprint (ITERATION)"
gh project field-create "${PROJECT_NUMBER}" \
  --owner "${ORG}" \
  --name "Sprint" \
  --data-type "ITERATION"

echo " -> Task Type (SINGLE_SELECT)"
gh project field-create "${PROJECT_NUMBER}" \
  --owner "${ORG}" \
  --name "Task Type" \
  --data-type "SINGLE_SELECT" \
  --single-select-options "DATABASE,BACKEND,FRONTEND,UNIT-TEST,E2E-TEST"

echo "==> Done."
echo "Reminder: Set Sprint duration to 2 weeks manually in Project Settings."
