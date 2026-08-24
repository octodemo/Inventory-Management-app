---
id: 137-FRONTEND-hierarchy-delete-action
title: [FRONTEND] Hierarchy Delete Action
type: task
taskType: FRONTEND
userStory: story-01-02-04
feature: feature-01-02
epic: epic-01
status: ready
dependencies: [17-BACKEND-hierarchy-delete-api]
---

# [FRONTEND] Hierarchy Delete Action

## Description
Create delete action for hierarchy nodes with dependency validation error handling.

## Acceptance Criteria
- [ ] Delete button triggers confirmation before calling DELETE /api/hierarchies/:id
- [ ] Component displays appropriate error when deletion fails due to children or items (409 Conflict)
