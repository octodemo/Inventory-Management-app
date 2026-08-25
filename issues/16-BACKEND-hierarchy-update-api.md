---
id: 16-BACKEND-hierarchy-update-api
title: [BACKEND] Hierarchy Update API
type: task
taskType: BACKEND
userStory: story-01-02-03
feature: feature-01-02
epic: epic-01
status: done
dependencies: [02-DATABASE-item-hierarchy-model]
---

# [BACKEND] Hierarchy Update API

## Description
Implement PUT /api/hierarchies/:id and GET /api/hierarchies/:id endpoints for updating and retrieving hierarchy nodes. Validates parent reference changes and prevents circular references.

## Acceptance Criteria
- [ ] PUT /api/hierarchies/:id updates the hierarchy node and returns 200 OK with updated details
- [ ] PUT /api/hierarchies/:id returns 400 Bad Request when attempting to create a circular reference in the hierarchy
