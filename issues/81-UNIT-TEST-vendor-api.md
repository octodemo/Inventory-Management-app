---
id: 81-UNIT-TEST-vendor-api
title: [UNIT-TEST] Vendor API Test
type: task
taskType: UNIT-TEST
userStory: story-02-01-01
feature: feature-02-01
epic: epic-02
status: ready
dependencies: [21-BACKEND-vendor-api]
---

# [UNIT-TEST] Vendor API Test

## Description
Write Jest unit tests for POST /api/vendors endpoint covering vendor creation and field validation.

## Acceptance Criteria
- [ ] Unit test verifies POST /api/vendors creates vendor and returns 201 Created
- [ ] Unit test verifies POST /api/vendors returns 400 Bad Request when required fields are missing
