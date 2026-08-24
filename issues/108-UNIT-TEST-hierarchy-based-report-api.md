---
id: 108-UNIT-TEST-hierarchy-based-report-api
title: [UNIT-TEST] Hierarchy-Based Report API Test
type: task
taskType: UNIT-TEST
userStory: story-05-03-01
feature: feature-05-03
epic: epic-05
status: done
dependencies: [48-BACKEND-hierarchy-based-report-api]
---

# [UNIT-TEST] Hierarchy-Based Report API Test

## Description
Write Jest unit tests for POST /api/reports/hierarchy-wise endpoint covering hierarchy aggregation and filtering.

## Acceptance Criteria
- [x] Unit test verifies POST /api/reports/hierarchy-wise returns usage data aggregated by hierarchy nodes
- [x] Unit test verifies aggregation correctly includes all items within each hierarchy node
