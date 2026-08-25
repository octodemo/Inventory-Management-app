---
id: 98-UNIT-TEST-branch-usage-filter-api
title: [UNIT-TEST] Branch Usage Filter API Test
type: task
taskType: UNIT-TEST
userStory: story-04-02-01
feature: feature-04-02
epic: epic-04
status: done
dependencies: [38-BACKEND-branch-usage-filter-api]
---

# [UNIT-TEST] Branch Usage Filter API Test

## Description
Write Jest unit tests for POST /api/reports/branch-wise endpoint covering branchIds filtering and date range.

## Acceptance Criteria
- [x] Unit test verifies POST /api/reports/branch-wise with branchIds filter returns only data for specified branches
- [x] Unit test verifies usage data is aggregated correctly per branch with branch details
