---
id: 12-BACKEND-inventory-update-api
title: [BACKEND] Inventory Update API
type: task
taskType: BACKEND
userStory: story-01-01-03
feature: feature-01-01
epic: epic-01
status: ready
dependencies: [01-DATABASE-inventory-item-model]
---

# [BACKEND] Inventory Update API

## Description
Implement PUT /api/inventory/:id and GET /api/inventory/:id endpoints for updating and retrieving inventory items. PUT updates the item with new values and validates required fields. GET returns item details for editing. Both require authentication.

## Acceptance Criteria
- [ ] PUT /api/inventory/:id updates the inventory item with new values and returns 200 OK with updated item details
- [ ] PUT /api/inventory/:id returns 400 Bad Request when required fields (name, vendorId, hierarchyId, unit) are missing
