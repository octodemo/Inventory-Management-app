---
id: 100-UNIT-TEST-regional-office-usage-filter-api
title: [UNIT-TEST] Regional Office Usage Filter API Test
type: task
taskType: UNIT-TEST
userStory: story-04-03-01
feature: feature-04-03
epic: epic-04
status: done
dependencies: [40-BACKEND-regional-office-usage-filter-api]
---

# [UNIT-TEST] Regional Office Usage Filter API Test

## Description
Write Jest unit tests for POST /api/reports/regional-office-wise endpoint covering regional office filtering and aggregation.

## Acceptance Criteria
- [x] Unit test verifies POST /api/reports/regional-office-wise with regionalOfficeIds filter returns aggregated usage across branches
- [x] Unit test verifies data aggregation correctly joins Branch and UsageRecord by regional office
