---
id: 38-BACKEND-branch-usage-filter-api
title: [BACKEND] Branch Usage Filter API
type: task
taskType: BACKEND
userStory: story-04-02-01
feature: feature-04-02
epic: epic-04
status: ready
dependencies: [09-DATABASE-usage-record-model,06-DATABASE-branch-model]
---

# [BACKEND] Branch Usage Filter API

## Description
Implement POST /api/reports/branch-wise endpoint accepting branchIds filter array and date range, returning usage data aggregated by branch.

## Acceptance Criteria
- [ ] POST /api/reports/branch-wise with branchIds filter returns usage data only for specified branches
- [ ] POST /api/reports/branch-wise aggregates usage quantities correctly per branch with branch details
