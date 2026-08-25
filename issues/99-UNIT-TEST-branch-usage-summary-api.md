---
id: 99-UNIT-TEST-branch-usage-summary-api
title: [UNIT-TEST] Branch Usage Summary API Test
type: task
taskType: UNIT-TEST
userStory: story-04-02-02
feature: feature-04-02
epic: epic-04
status: done
dependencies: [39-BACKEND-branch-usage-summary-api]
---

# [UNIT-TEST] Branch Usage Summary API Test

## Description
Write Jest unit tests for branch-wise report summary statistics covering branch-level and overall totals.

## Acceptance Criteria
- [x] Unit test verifies POST /api/reports/branch-wise response includes branch-level summary with totalQuantity and itemCount
- [x] Unit test verifies response includes overall summary across all selected branches
