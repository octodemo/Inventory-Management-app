#!/bin/bash
# Workshop Workspace Initialisation Script
# Run this once before the workshop starts.
# Usage: bash init-workspace.sh

echo "Initialising workshop workspace..."

mkdir -p docs/requirements/work-items/epics
mkdir -p docs/requirements/work-items/features
mkdir -p docs/requirements/work-items/stories
mkdir -p docs/design
mkdir -p docs/reports
mkdir -p issues

echo "Workspace folders created:"
echo "  docs/requirements/work-items/epics/"
echo "  docs/requirements/work-items/features/"
echo "  docs/requirements/work-items/stories/"
echo "  docs/design/"
echo "  docs/reports/"
echo "  issues/"
echo ""
echo "Next step: Update docs/ado-sync-config.json with your ADO settings."
echo "Then open VS Code and invoke @brd-agent to begin."
