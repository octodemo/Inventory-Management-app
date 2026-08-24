---
id: 94-UNIT-TEST-usage-record-api
title: [UNIT-TEST] Usage Record API Test
type: task
taskType: UNIT-TEST
userStory: story-04-01-01
feature: feature-04-01
epic: epic-04
status: ready
dependencies: [34-BACKEND-usage-record-api]
---

# [UNIT-TEST] Usage Record API Test

## Description
Write Jest unit tests for POST /api/usage endpoint covering usage record creation and entity validation.

## Acceptance Criteria
- [ ] Unit test verifies POST /api/usage creates usage record and returns 201 Created
- [ ] Unit test verifies POST /api/usage returns 400 Bad Request when itemId or branchId reference non-existent entities
