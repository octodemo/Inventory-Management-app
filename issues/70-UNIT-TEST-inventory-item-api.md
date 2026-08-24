---
id: 70-UNIT-TEST-inventory-item-api
title: [UNIT-TEST] Inventory Item API Test
type: task
taskType: UNIT-TEST
userStory: story-01-01-01
feature: feature-01-01
epic: epic-01
status: ready
dependencies: [10-BACKEND-inventory-item-api]
---

# [UNIT-TEST] Inventory Item API Test

## Description
Write Jest unit tests for POST /api/inventory endpoint covering successful creation and validation error scenarios.

## Acceptance Criteria
- [ ] Unit test verifies POST /api/inventory creates inventory item and returns 201 Created with correct response structure
- [ ] Unit test verifies POST /api/inventory returns 400 Bad Request when required fields are missing or invalid
