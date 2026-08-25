---
id: 11-BACKEND-inventory-list-search-api
title: [BACKEND] Inventory List and Search API
type: task
taskType: BACKEND
userStory: story-01-01-02
feature: feature-01-01
epic: epic-01
status: done
dependencies: [01-DATABASE-inventory-item-model]
---

# [BACKEND] Inventory List and Search API

## Description
Implement the GET /api/inventory endpoint with pagination, filtering (vendorId, hierarchyId), and search (name/description) capabilities as defined in the design document. Returns paginated inventory items with vendor and hierarchy details. Default page size is 20, maximum is 100.

## Acceptance Criteria
- [ ] GET /api/inventory returns a paginated list of inventory items with default page=1 and limit=20, including vendor and hierarchy details
- [ ] GET /api/inventory with query parameters (vendorId, hierarchyId, search) filters the results correctly and returns only matching items
