---
id: 31-BACKEND-supervisor-api
title: [BACKEND] Supervisor API
type: task
taskType: BACKEND
userStory: story-03-02-01
feature: feature-03-02
epic: epic-03
status: ready
dependencies: [07-DATABASE-supervisor-model]
---

# [BACKEND] Supervisor API

## Description
Implement CRUD endpoints for Supervisor (GET, POST, PUT, DELETE /api/supervisors) with unique email validation and premises listing.

## Acceptance Criteria
- [ ] POST /api/supervisors creates a new supervisor with unique email and returns 201 Created
- [ ] GET /api/supervisors/:id returns supervisor details including list of assigned premises
