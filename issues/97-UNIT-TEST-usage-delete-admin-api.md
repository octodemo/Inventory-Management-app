---
id: 97-UNIT-TEST-usage-delete-admin-api
title: [UNIT-TEST] Usage Delete Admin API Test
type: task
taskType: UNIT-TEST
userStory: story-04-01-04
feature: feature-04-01
epic: epic-04
status: done
dependencies: [37-BACKEND-usage-delete-admin-api]
---

# [UNIT-TEST] Usage Delete Admin API Test

## Description
Write Jest unit tests for DELETE /api/usage/:id endpoint covering admin authorization checks.

## Acceptance Criteria
- [x] Unit test verifies DELETE /api/usage/:id deletes usage record and returns 204 No Content when user is admin
- [x] Unit test verifies DELETE /api/usage/:id returns 403 Forbidden when user is not admin
