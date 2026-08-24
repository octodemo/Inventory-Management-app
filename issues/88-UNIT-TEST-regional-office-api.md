---
id: 88-UNIT-TEST-regional-office-api
title: [UNIT-TEST] Regional Office API Test
type: task
taskType: UNIT-TEST
userStory: story-03-01-01
feature: feature-03-01
epic: epic-03
status: ready
dependencies: [28-BACKEND-regional-office-api]
---

# [UNIT-TEST] Regional Office API Test

## Description
Write Jest unit tests for Regional Office CRUD endpoints covering creation, retrieval, and unique code validation.

## Acceptance Criteria
- [ ] Unit test verifies POST /api/regional-offices creates regional office with unique code and returns 201 Created
- [ ] Unit test verifies GET /api/regional-offices returns paginated list with branch counts
