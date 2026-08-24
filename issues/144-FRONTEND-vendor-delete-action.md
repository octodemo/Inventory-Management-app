---
id: 144-FRONTEND-vendor-delete-action
title: [FRONTEND] Vendor Delete Action
type: task
taskType: FRONTEND
userStory: story-02-01-04
feature: feature-02-01
epic: epic-02
status: ready
dependencies: [24-BACKEND-vendor-delete-api]
---

# [FRONTEND] Vendor Delete Action

## Description
Create delete action for vendors with dependency validation error handling.

## Acceptance Criteria
- [ ] Delete button triggers confirmation before calling DELETE /api/vendors/:id
- [ ] Component displays appropriate error when deletion fails due to items (409 Conflict)
