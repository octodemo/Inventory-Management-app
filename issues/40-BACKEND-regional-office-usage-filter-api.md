---
id: 40-BACKEND-regional-office-usage-filter-api
title: [BACKEND] Regional Office Usage Filter API
type: task
taskType: BACKEND
userStory: story-04-03-01
feature: feature-04-03
epic: epic-04
status: ready
dependencies: [09-DATABASE-usage-record-model,05-DATABASE-regional-office-model,06-DATABASE-branch-model]
---

# [BACKEND] Regional Office Usage Filter API

## Description
Implement POST /api/reports/regional-office-wise endpoint accepting regionalOfficeIds filter array and date range, aggregating usage across all branches within each regional office.

## Acceptance Criteria
- [ ] POST /api/reports/regional-office-wise with regionalOfficeIds filter returns usage data aggregated across branches within those regional offices
- [ ] POST /api/reports/regional-office-wise joins Branch and UsageRecord correctly to aggregate by regional office
