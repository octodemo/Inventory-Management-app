---
id: 84-UNIT-TEST-vendor-delete-api
title: [UNIT-TEST] Vendor Delete API Test
type: task
taskType: UNIT-TEST
userStory: story-02-01-04
feature: feature-02-01
epic: epic-02
status: ready
dependencies: [24-BACKEND-vendor-delete-api]
---

# [UNIT-TEST] Vendor Delete API Test

## Description
Write Jest unit tests for DELETE /api/vendors/:id endpoint covering deletion and item dependency validation.

## Acceptance Criteria
- [ ] Unit test verifies DELETE /api/vendors/:id deletes vendor and returns 204 No Content when no items exist
- [ ] Unit test verifies DELETE /api/vendors/:id returns 409 Conflict when vendor has associated items
