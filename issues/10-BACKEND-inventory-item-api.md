---
id: 10-BACKEND-inventory-item-api
title: [BACKEND] Inventory Item API
type: task
taskType: BACKEND
userStory: story-01-01-01
feature: feature-01-01
epic: epic-01
status: done
dependencies: [01-DATABASE-inventory-item-model]
---

# [BACKEND] Inventory Item API

## Description
Implement the POST /api/inventory endpoint for creating new inventory items as defined in the design document. The endpoint creates an InventoryItem with auto-generated unique ID, enforces authentication via IAM middleware, and validates that name, vendor, hierarchy, and unit are present. Returns 201 Created on success with item details, or 400 Bad Request for validation errors.

## Acceptance Criteria
- [ ] POST /api/inventory creates a new inventory item with all required fields (name, vendorId, hierarchyId, unit) and returns 201 Created with the item details including auto-generated ID
- [ ] POST /api/inventory returns 400 Bad Request when required fields are missing, with error message indicating which fields are required
