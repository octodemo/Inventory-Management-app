---
id: 83-UNIT-TEST-vendor-update-api
title: [UNIT-TEST] Vendor Update API Test
type: task
taskType: UNIT-TEST
userStory: story-02-01-03
feature: feature-02-01
epic: epic-02
status: ready
dependencies: [23-BACKEND-vendor-update-api]
---

# [UNIT-TEST] Vendor Update API Test

## Description
Write Jest unit tests for PUT /api/vendors/:id endpoint covering successful updates and validation.

## Acceptance Criteria
- [ ] Unit test verifies PUT /api/vendors/:id updates vendor and returns 200 OK
- [ ] Unit test verifies PUT /api/vendors/:id returns 404 Not Found when vendor does not exist
