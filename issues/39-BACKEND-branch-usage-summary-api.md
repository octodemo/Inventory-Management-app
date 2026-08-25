---
id: 39-BACKEND-branch-usage-summary-api
title: [BACKEND] Branch Usage Summary API
type: task
taskType: BACKEND
userStory: story-04-02-02
feature: feature-04-02
epic: epic-04
status: done
dependencies: [09-DATABASE-usage-record-model,06-DATABASE-branch-model]
---

# [BACKEND] Branch Usage Summary API

## Description
Extend POST /api/reports/branch-wise response to include summary statistics (totalQuantity, itemCount) per branch and overall totals.

## Acceptance Criteria
- [ ] POST /api/reports/branch-wise response includes branch-level summary with totalQuantity and itemCount
- [ ] POST /api/reports/branch-wise response includes overall summary across all selected branches
