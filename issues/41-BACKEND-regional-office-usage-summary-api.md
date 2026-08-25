---
id: 41-BACKEND-regional-office-usage-summary-api
title: [BACKEND] Regional Office Usage Summary API
type: task
taskType: BACKEND
userStory: story-04-03-02
feature: feature-04-03
epic: epic-04
status: done
dependencies: [09-DATABASE-usage-record-model,05-DATABASE-regional-office-model,06-DATABASE-branch-model]
---

# [BACKEND] Regional Office Usage Summary API

## Description
Extend POST /api/reports/regional-office-wise response to include regional office summary statistics (totalQuantity, branchCount) and overall totals.

## Acceptance Criteria
- [ ] POST /api/reports/regional-office-wise response includes regional-office-level summary with totalQuantity and branchCount
- [ ] POST /api/reports/regional-office-wise response includes breakdown by branch within each regional office
