---
id: 74-UNIT-TEST-hierarchy-node-api
title: [UNIT-TEST] Hierarchy Node API Test
type: task
taskType: UNIT-TEST
userStory: story-01-02-01
feature: feature-01-02
epic: epic-01
status: ready
dependencies: [14-BACKEND-hierarchy-node-api]
---

# [UNIT-TEST] Hierarchy Node API Test

## Description
Write Jest unit tests for POST /api/hierarchies endpoint covering hierarchy node creation and depth validation.

## Acceptance Criteria
- [ ] Unit test verifies POST /api/hierarchies creates hierarchy node and returns 201 Created
- [ ] Unit test verifies POST /api/hierarchies returns 400 Bad Request when hierarchy depth exceeds 4 levels
