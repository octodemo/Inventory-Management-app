---
id: 157-FRONTEND-usage-delete-admin
title: [FRONTEND] Usage Delete Admin
type: task
taskType: FRONTEND
userStory: story-04-01-04
feature: feature-04-01
epic: epic-04
status: ready
dependencies: [37-BACKEND-usage-delete-admin-api]
---

# [FRONTEND] Usage Delete Admin

## Description
Create delete action for usage records with admin-only authorization check.

## Acceptance Criteria
- [ ] Delete button is visible only for admin users and triggers confirmation before calling DELETE /api/usage/:id
- [ ] Component displays appropriate error when non-admin user attempts deletion (403 Forbidden)
