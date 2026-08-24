---
id: 93-UNIT-TEST-supervisor-delete-validation-api
title: [UNIT-TEST] Supervisor Delete Validation API Test
type: task
taskType: UNIT-TEST
userStory: story-03-02-03
feature: feature-03-02
epic: epic-03
status: done
dependencies: [33-BACKEND-supervisor-delete-validation-api]
---

# [UNIT-TEST] Supervisor Delete Validation API Test

## Description
Write Jest unit tests for DELETE /api/supervisors/:id covering deletion and premises dependency validation.

## Acceptance Criteria
- [x] Unit test verifies DELETE /api/supervisors/:id deletes supervisor and returns 204 No Content when no premises assigned
- [x] Unit test verifies DELETE /api/supervisors/:id returns 409 Conflict when supervisor has assigned premises
