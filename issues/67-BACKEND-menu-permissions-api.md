---
id: 67-BACKEND-menu-permissions-api
title: [BACKEND] Menu Permissions API
type: task
taskType: BACKEND
userStory: story-07-03-01
feature: feature-07-03
epic: epic-07
status: ready
dependencies: []
---

# [BACKEND] Menu Permissions API

## Description
Implement GET /api/menu/items endpoint returning menu structure filtered by user role permissions (admin vs user menu items).

## Acceptance Criteria
- [ ] GET /api/menu/items returns full menu structure for admin users including master management and upload menu items
- [ ] GET /api/menu/items returns restricted menu structure for regular users excluding admin-only sections
