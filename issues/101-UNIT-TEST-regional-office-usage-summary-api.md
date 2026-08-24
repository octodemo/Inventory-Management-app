---
id: 101-UNIT-TEST-regional-office-usage-summary-api
title: [UNIT-TEST] Regional Office Usage Summary API Test
type: task
taskType: UNIT-TEST
userStory: story-04-03-02
feature: feature-04-03
epic: epic-04
status: ready
dependencies: [41-BACKEND-regional-office-usage-summary-api]
---

# [UNIT-TEST] Regional Office Usage Summary API Test

## Description
Write Jest unit tests for regional-office-wise report summary statistics covering regional office and branch-level details.

## Acceptance Criteria
- [ ] Unit test verifies POST /api/reports/regional-office-wise response includes regional-office-level summary with totalQuantity and branchCount
- [ ] Unit test verifies response includes breakdown by branch within each regional office
