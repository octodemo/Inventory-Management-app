---
id: 33-BACKEND-supervisor-delete-validation-api
title: [BACKEND] Supervisor Delete Validation API
type: task
taskType: BACKEND
userStory: story-03-02-03
feature: feature-03-02
epic: epic-03
status: done
dependencies: [07-DATABASE-supervisor-model,08-DATABASE-premises-model]
---

# [BACKEND] Supervisor Delete Validation API

## Description
Implement DELETE /api/supervisors/:id endpoint with validation preventing deletion when supervisor has assigned premises. Returns 409 Conflict if premises exist.

## Acceptance Criteria
- [ ] DELETE /api/supervisors/:id deletes the supervisor and returns 204 No Content when no premises are assigned
- [ ] DELETE /api/supervisors/:id returns 409 Conflict when the supervisor has assigned premises
