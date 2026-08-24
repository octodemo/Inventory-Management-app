---
id: 136-FRONTEND-hierarchy-update-form
title: [FRONTEND] Hierarchy Update Form
type: task
taskType: FRONTEND
userStory: story-01-02-03
feature: feature-01-02
epic: epic-01
status: ready
dependencies: [16-BACKEND-hierarchy-update-api]
---

# [FRONTEND] Hierarchy Update Form

## Description
Create React component for editing hierarchy nodes with circular reference error handling.

## Acceptance Criteria
- [ ] Component pre-populates form with existing node data and allows changing name or parent
- [ ] Form calls PUT /api/hierarchies/:id and displays circular reference validation errors
