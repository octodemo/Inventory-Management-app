---
id: 78-UNIT-TEST-item-rate-api
title: [UNIT-TEST] Item Rate API Test
type: task
taskType: UNIT-TEST
userStory: story-01-03-01
feature: feature-01-03
epic: epic-01
status: ready
dependencies: [18-BACKEND-item-rate-api]
---

# [UNIT-TEST] Item Rate API Test

## Description
Write Jest unit tests for POST /api/rates endpoint covering rate creation and date overlap validation.

## Acceptance Criteria
- [ ] Unit test verifies POST /api/rates creates item rate and returns 201 Created
- [ ] Unit test verifies POST /api/rates returns 400 Bad Request when effectiveDate overlaps with existing rate
