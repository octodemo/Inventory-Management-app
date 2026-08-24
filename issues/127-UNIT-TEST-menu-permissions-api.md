---
id: 127-UNIT-TEST-menu-permissions-api
title: [UNIT-TEST] Menu Permissions API Test
type: task
taskType: UNIT-TEST
userStory: story-07-03-01
feature: feature-07-03
epic: epic-07
status: ready
dependencies: [67-BACKEND-menu-permissions-api]
---

# [UNIT-TEST] Menu Permissions API Test

## Description
Write Jest unit tests for GET /api/menu/items endpoint covering role-based menu filtering.

## Acceptance Criteria
- [ ] Unit test verifies GET /api/menu/items returns full menu structure for admin users including admin-only sections
- [ ] Unit test verifies GET /api/menu/items returns restricted menu structure for regular users excluding admin sections
