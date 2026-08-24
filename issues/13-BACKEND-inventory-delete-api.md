---
id: 13-BACKEND-inventory-delete-api
title: [BACKEND] Inventory Delete API
type: task
taskType: BACKEND
userStory: story-01-01-04
feature: feature-01-01
epic: epic-01
status: ready
dependencies: [01-DATABASE-inventory-item-model]
---

# [BACKEND] Inventory Delete API

## Description
Implement DELETE /api/inventory/:id endpoint for deleting inventory items. Checks for associated UsageRecord entries before deletion and returns 409 Conflict if usage records exist. Returns 204 No Content on successful deletion.

## Acceptance Criteria
- [ ] DELETE /api/inventory/:id deletes the inventory item and returns 204 No Content when no usage records exist
- [ ] DELETE /api/inventory/:id returns 409 Conflict when the item has associated usage records, preventing deletion
