---
id: 37-BACKEND-usage-delete-admin-api
title: [BACKEND] Usage Delete Admin API
type: task
taskType: BACKEND
userStory: story-04-01-04
feature: feature-04-01
epic: epic-04
status: ready
dependencies: [09-DATABASE-usage-record-model]
---

# [BACKEND] Usage Delete Admin API

## Description
Implement DELETE /api/usage/:id endpoint with admin-only authorization check. Returns 403 Forbidden for non-admin users.

## Acceptance Criteria
- [ ] DELETE /api/usage/:id deletes the usage record and returns 204 No Content when user is admin
- [ ] DELETE /api/usage/:id returns 403 Forbidden when user does not have admin role
