---
id: 48-BACKEND-hierarchy-based-report-api
title: [BACKEND] Hierarchy-Based Report API
type: task
taskType: BACKEND
userStory: story-05-03-01
feature: feature-05-03
epic: epic-05
status: ready
dependencies: [02-DATABASE-item-hierarchy-model,09-DATABASE-usage-record-model]
---

# [BACKEND] Hierarchy-Based Report API

## Description
Implement POST /api/reports/hierarchy-wise endpoint aggregating usage data by hierarchy nodes with support for hierarchyIds filter array and date range.

## Acceptance Criteria
- [ ] POST /api/reports/hierarchy-wise returns usage data aggregated by hierarchy nodes with node details
- [ ] POST /api/reports/hierarchy-wise correctly aggregates usage across all items within each hierarchy node
