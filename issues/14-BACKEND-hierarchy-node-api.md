---
id: 14-BACKEND-hierarchy-node-api
title: [BACKEND] Hierarchy Node API
type: task
taskType: BACKEND
userStory: story-01-02-01
feature: feature-01-02
epic: epic-01
status: done
dependencies: [02-DATABASE-item-hierarchy-model]
---

# [BACKEND] Hierarchy Node API

## Description
Implement POST /api/hierarchies endpoint for creating hierarchy nodes with optional parent reference. Validates that parentId exists if provided. Returns 201 Created with node details.

## Acceptance Criteria
- [ ] POST /api/hierarchies creates a new hierarchy node and returns 201 Created with node details including auto-generated ID
- [ ] POST /api/hierarchies with parentId creates a child node correctly linked to the parent hierarchy
