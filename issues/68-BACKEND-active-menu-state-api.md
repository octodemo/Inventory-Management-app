---
id: 68-BACKEND-active-menu-state-api
title: [BACKEND] Active Menu State API
type: task
taskType: BACKEND
userStory: story-07-03-02
feature: feature-07-03
epic: epic-07
status: ready
dependencies: []
---

# [BACKEND] Active Menu State API

## Description
Ensure GET /api/menu/items endpoint returns menu items with identifiers (id, path) enabling frontend active menu highlighting based on current route.

## Acceptance Criteria
- [ ] GET /api/menu/items response includes id and path fields for each menu item
- [ ] Menu items are organized hierarchically with parent-child relationships for nested menus
