---
id: 29-BACKEND-branch-api
title: [BACKEND] Branch API
type: task
taskType: BACKEND
userStory: story-03-01-02
feature: feature-03-01
epic: epic-03
status: ready
dependencies: [06-DATABASE-branch-model,05-DATABASE-regional-office-model]
---

# [BACKEND] Branch API

## Description
Implement CRUD endpoints for Branch (GET, POST, PUT, DELETE /api/branches) with unique code validation and regionalOfficeId filtering.

## Acceptance Criteria
- [ ] POST /api/branches creates a new branch linked to a regional office and returns 201 Created
- [ ] GET /api/branches with regionalOfficeId filter returns only branches belonging to that regional office
