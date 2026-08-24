---
id: 71-UNIT-TEST-inventory-list-search-api
title: [UNIT-TEST] Inventory List and Search API Test
type: task
taskType: UNIT-TEST
userStory: story-01-01-02
feature: feature-01-01
epic: epic-01
status: ready
dependencies: [11-BACKEND-inventory-list-search-api]
---

# [UNIT-TEST] Inventory List and Search API Test

## Description
Write Jest unit tests for GET /api/inventory endpoint covering pagination, filtering, and search functionality.

## Acceptance Criteria
- [ ] Unit test verifies GET /api/inventory returns paginated inventory list with correct metadata structure
- [ ] Unit test verifies GET /api/inventory filtering by vendorId, hierarchyId, and search text returns only matching items
