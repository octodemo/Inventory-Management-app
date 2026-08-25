---
id: 102-UNIT-TEST-multi-select-items-api
title: [UNIT-TEST] Multi-Select Items API Test
type: task
taskType: UNIT-TEST
userStory: story-05-01-01
feature: feature-05-01
epic: epic-05
status: done
dependencies: [42-BACKEND-multi-select-items-api]
---

# [UNIT-TEST] Multi-Select Items API Test

## Description
Write Jest unit tests for item-wise report with itemIds array filter covering multiple item selection.

## Acceptance Criteria
- [x] Unit test verifies POST /api/reports/item-wise with itemIds array filters results correctly
- [x] Unit test verifies POST /api/reports/item-wise returns 400 Bad Request when itemIds contains invalid IDs
