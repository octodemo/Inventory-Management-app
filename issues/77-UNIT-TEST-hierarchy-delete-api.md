---
id: 77-UNIT-TEST-hierarchy-delete-api
title: [UNIT-TEST] Hierarchy Delete API Test
type: task
taskType: UNIT-TEST
userStory: story-01-02-04
feature: feature-01-02
epic: epic-01
status: ready
dependencies: [17-BACKEND-hierarchy-delete-api]
---

# [UNIT-TEST] Hierarchy Delete API Test

## Description
Write Jest unit tests for DELETE /api/hierarchies/:id endpoint covering successful deletion and dependency validation.

## Acceptance Criteria
- [ ] Unit test verifies DELETE /api/hierarchies/:id deletes node and returns 204 No Content when no children or items exist
- [ ] Unit test verifies DELETE /api/hierarchies/:id returns 409 Conflict when node has children or associated items
