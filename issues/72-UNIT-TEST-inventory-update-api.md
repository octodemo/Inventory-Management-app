---
id: 72-UNIT-TEST-inventory-update-api
title: [UNIT-TEST] Inventory Update API Test
type: task
taskType: UNIT-TEST
userStory: story-01-01-03
feature: feature-01-01
epic: epic-01
status: ready
dependencies: [12-BACKEND-inventory-update-api]
---

# [UNIT-TEST] Inventory Update API Test

## Description
Write Jest unit tests for PUT /api/inventory/:id and GET /api/inventory/:id endpoints covering successful updates and error handling.

## Acceptance Criteria
- [ ] Unit test verifies PUT /api/inventory/:id updates inventory item and returns 200 OK with updated details
- [ ] Unit test verifies GET /api/inventory/:id returns 404 Not Found when inventory item does not exist
