---
id: 149-FRONTEND-branch-form
title: [FRONTEND] Branch Form
type: task
taskType: FRONTEND
userStory: story-03-01-02
feature: feature-03-01
epic: epic-03
status: done
dependencies: [29-BACKEND-branch-api]
---

# [FRONTEND] Branch Form

## Description
Create React component for branch creation form with regional office selection.

## Acceptance Criteria
- [ ] Component renders form with data-testid="branch-form" including regional office dropdown and branch code/name fields
- [ ] Form calls POST /api/branches and list view filters branches by regional office
