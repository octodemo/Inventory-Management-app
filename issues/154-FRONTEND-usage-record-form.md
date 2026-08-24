---
id: 154-FRONTEND-usage-record-form
title: [FRONTEND] Usage Record Form
type: task
taskType: FRONTEND
userStory: story-04-01-01
feature: feature-04-01
epic: epic-04
status: ready
dependencies: [34-BACKEND-usage-record-api]
---

# [FRONTEND] Usage Record Form

## Description
Create React component for usage record creation form with item, branch, quantity, and date selection.

## Acceptance Criteria
- [ ] Component renders form with data-testid="usage-form" including dropdowns for item and branch, plus quantity and date inputs
- [ ] Form calls POST /api/usage and displays validation errors for invalid entity references
