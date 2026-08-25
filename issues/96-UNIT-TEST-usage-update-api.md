---
id: 96-UNIT-TEST-usage-update-api
title: [UNIT-TEST] Usage Update API Test
type: task
taskType: UNIT-TEST
userStory: story-04-01-03
feature: feature-04-01
epic: epic-04
status: done
dependencies: [36-BACKEND-usage-update-api]
---

# [UNIT-TEST] Usage Update API Test

## Description
Write Jest unit tests for PUT /api/usage/:id and GET /api/usage/:id endpoints covering updates and validation.

## Acceptance Criteria
- [x] Unit test verifies PUT /api/usage/:id updates usage record and returns 200 OK
- [x] Unit test verifies PUT /api/usage/:id returns 400 Bad Request when required fields are invalid
