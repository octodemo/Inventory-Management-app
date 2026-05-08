#!/bin/bash
# Workshop Workspace Initialisation Script
# Run this once before the workshop starts.
# Usage: bash init-workspace.sh

echo "Initialising workshop workspace..."

folders=(
    "docs/requirements"
    "docs/design"
    "docs/work-items/epics"
    "docs/work-items/features"
    "docs/work-items/stories"
    "docs/reports"
    "docs/test-reports"
    "issues"
    "e2e"
    "src"
)

for folder in "${folders[@]}"; do
    mkdir -p "$folder"
done

echo "Workspace folders created:"
for folder in "${folders[@]}"; do
    echo "  $folder/"
done
echo ""
echo "Next step: Update docs/ado-sync-config.json with your ADO settings (optional — only if using Azure DevOps)."
echo "Then open VS Code and invoke brd-agent to begin."
