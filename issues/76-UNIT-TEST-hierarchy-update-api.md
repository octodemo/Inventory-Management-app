---
id: 76-UNIT-TEST-hierarchy-update-api
title: [UNIT-TEST] Hierarchy Update API Test
type: task
taskType: UNIT-TEST
userStory: story-01-02-03
feature: feature-01-02
epic: epic-01
status: ready
dependencies: [16-BACKEND-hierarchy-update-api]
---

# [UNIT-TEST] Hierarchy Update API Test

## Description
Write Jest unit tests for PUT /api/hierarchies/:id endpoint covering successful updates and circular reference validation.

## Acceptance Criteria
- [ ] Unit test verifies PUT /api/hierarchies/:id updates hierarchy node and returns 200 OK
- [ ] Unit test verifies PUT /api/hierarchies/:id returns 400 Bad Request when update creates circular reference
