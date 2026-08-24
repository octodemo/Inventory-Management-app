---
id: 30-BACKEND-regional-office-delete-validation-api
title: [BACKEND] Regional Office Delete Validation API
type: task
taskType: BACKEND
userStory: story-03-01-03
feature: feature-03-01
epic: epic-03
status: done
dependencies: [05-DATABASE-regional-office-model,06-DATABASE-branch-model]
---

# [BACKEND] Regional Office Delete Validation API

## Description
Implement DELETE /api/regional-offices/:id endpoint with validation preventing deletion when regional office has associated branches. Returns 409 Conflict if branches exist.

## Acceptance Criteria
- [ ] DELETE /api/regional-offices/:id deletes the regional office and returns 204 No Content when no branches exist
- [ ] DELETE /api/regional-offices/:id returns 409 Conflict when the regional office has associated branches
