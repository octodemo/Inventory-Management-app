---
id: 91-UNIT-TEST-supervisor-api
title: [UNIT-TEST] Supervisor API Test
type: task
taskType: UNIT-TEST
userStory: story-03-02-01
feature: feature-03-02
epic: epic-03
status: done
dependencies: [31-BACKEND-supervisor-api]
---

# [UNIT-TEST] Supervisor API Test

## Description
Write Jest unit tests for Supervisor CRUD endpoints covering creation, unique email validation, and premises listing.

## Acceptance Criteria
- [x] Unit test verifies POST /api/supervisors creates supervisor with unique email and returns 201 Created
- [x] Unit test verifies GET /api/supervisors/:id returns supervisor details including assigned premises
