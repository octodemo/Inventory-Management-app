---
id: 103-UNIT-TEST-multi-select-branches-api
title: [UNIT-TEST] Multi-Select Branches API Test
type: task
taskType: UNIT-TEST
userStory: story-05-01-02
feature: feature-05-01
epic: epic-05
status: ready
dependencies: [43-BACKEND-multi-select-branches-api]
---

# [UNIT-TEST] Multi-Select Branches API Test

## Description
Write Jest unit tests for branch-wise report with branchIds array filter covering multiple branch selection.

## Acceptance Criteria
- [ ] Unit test verifies POST /api/reports/branch-wise with branchIds array filters results correctly
- [ ] Unit test verifies POST /api/reports/branch-wise returns 400 Bad Request when branchIds contains invalid IDs
