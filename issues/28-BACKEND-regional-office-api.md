---
id: 28-BACKEND-regional-office-api
title: [BACKEND] Regional Office API
type: task
taskType: BACKEND
userStory: story-03-01-01
feature: feature-03-01
epic: epic-03
status: ready
dependencies: [05-DATABASE-regional-office-model]
---

# [BACKEND] Regional Office API

## Description
Implement CRUD endpoints for RegionalOffice (GET, POST, PUT, DELETE /api/regional-offices) with unique code validation and pagination support.

## Acceptance Criteria
- [ ] POST /api/regional-offices creates a new regional office with unique code and returns 201 Created
- [ ] GET /api/regional-offices returns paginated list of regional offices with branch counts
