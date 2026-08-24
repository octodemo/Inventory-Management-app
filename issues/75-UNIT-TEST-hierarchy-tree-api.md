---
id: 75-UNIT-TEST-hierarchy-tree-api
title: [UNIT-TEST] Hierarchy Tree API Test
type: task
taskType: UNIT-TEST
userStory: story-01-02-02
feature: feature-01-02
epic: epic-01
status: ready
dependencies: [15-BACKEND-hierarchy-tree-api]
---

# [UNIT-TEST] Hierarchy Tree API Test

## Description
Write Jest unit tests for GET /api/hierarchies endpoint covering tree structure retrieval and filtering.

## Acceptance Criteria
- [ ] Unit test verifies GET /api/hierarchies returns complete tree structure with parent-child relationships
- [ ] Unit test verifies GET /api/hierarchies with parentId filter returns only children of specified parent node
