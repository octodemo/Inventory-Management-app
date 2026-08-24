---
id: 90-UNIT-TEST-regional-office-delete-validation-api
title: [UNIT-TEST] Regional Office Delete Validation API Test
type: task
taskType: UNIT-TEST
userStory: story-03-01-03
feature: feature-03-01
epic: epic-03
status: ready
dependencies: [30-BACKEND-regional-office-delete-validation-api]
---

# [UNIT-TEST] Regional Office Delete Validation API Test

## Description
Write Jest unit tests for DELETE /api/regional-offices/:id covering deletion and branch dependency validation.

## Acceptance Criteria
- [ ] Unit test verifies DELETE /api/regional-offices/:id deletes regional office and returns 204 No Content when no branches exist
- [ ] Unit test verifies DELETE /api/regional-offices/:id returns 409 Conflict when branches exist
