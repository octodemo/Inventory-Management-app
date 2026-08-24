---
id: 17-BACKEND-hierarchy-delete-api
title: [BACKEND] Hierarchy Delete API
type: task
taskType: BACKEND
userStory: story-01-02-04
feature: feature-01-02
epic: epic-01
status: ready
dependencies: [02-DATABASE-item-hierarchy-model]
---

# [BACKEND] Hierarchy Delete API

## Description
Implement DELETE /api/hierarchies/:id endpoint. Prevents deletion if hierarchy node has child nodes or assigned inventory items. Returns 409 Conflict if dependencies exist.

## Acceptance Criteria
- [ ] DELETE /api/hierarchies/:id deletes the hierarchy node and returns 204 No Content when no children or items exist
- [ ] DELETE /api/hierarchies/:id returns 409 Conflict when the node has child nodes or assigned inventory items
