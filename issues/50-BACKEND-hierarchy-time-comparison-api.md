---
id: 50-BACKEND-hierarchy-time-comparison-api
title: [BACKEND] Hierarchy Time Comparison API
type: task
taskType: BACKEND
userStory: story-05-03-03
feature: feature-05-03
epic: epic-05
status: ready
dependencies: [02-DATABASE-item-hierarchy-model,09-DATABASE-usage-record-model]
---

# [BACKEND] Hierarchy Time Comparison API

## Description
Extend POST /api/reports/hierarchy-wise endpoint to accept multiple date ranges (periods array) and return usage comparison across periods for each hierarchy node.

## Acceptance Criteria
- [ ] POST /api/reports/hierarchy-wise with periods array returns usage data for each period per hierarchy node
- [ ] Hierarchy time comparison response includes change percentage and trend direction between periods
