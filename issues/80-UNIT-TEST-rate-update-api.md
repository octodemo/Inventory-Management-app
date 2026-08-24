---
id: 80-UNIT-TEST-rate-update-api
title: [UNIT-TEST] Rate Update API Test
type: task
taskType: UNIT-TEST
userStory: story-01-03-03
feature: feature-01-03
epic: epic-01
status: ready
dependencies: [20-BACKEND-rate-update-api]
---

# [UNIT-TEST] Rate Update API Test

## Description
Write Jest unit tests for PUT /api/rates/:id endpoint covering rate updates and effective date validation.

## Acceptance Criteria
- [ ] Unit test verifies PUT /api/rates/:id updates rate and returns 200 OK
- [ ] Unit test verifies PUT /api/rates/:id returns 400 Bad Request when new effective date creates overlap with other rates
