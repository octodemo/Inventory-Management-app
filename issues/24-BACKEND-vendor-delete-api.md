---
id: 24-BACKEND-vendor-delete-api
title: [BACKEND] Vendor Delete API
type: task
taskType: BACKEND
userStory: story-02-01-04
feature: feature-02-01
epic: epic-02
status: done
dependencies: [04-DATABASE-vendor-model]
---

# [BACKEND] Vendor Delete API

## Description
Implement DELETE /api/vendors/:id endpoint. Prevents deletion if vendor has associated inventory items. Returns 409 Conflict if items exist.

## Acceptance Criteria
- [ ] DELETE /api/vendors/:id deletes the vendor and returns 204 No Content when no inventory items exist
- [ ] DELETE /api/vendors/:id returns 409 Conflict when the vendor has assigned inventory items
