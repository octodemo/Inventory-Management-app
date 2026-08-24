---
id: 43-BACKEND-multi-select-branches-api
title: [BACKEND] Multi-Select Branches API
type: task
taskType: BACKEND
userStory: story-05-01-02
feature: feature-05-01
epic: epic-05
status: ready
dependencies: [06-DATABASE-branch-model]
---

# [BACKEND] Multi-Select Branches API

## Description
Ensure POST /api/reports/branch-wise endpoint accepts branchIds array filter allowing multiple branch selection for report filtering.

## Acceptance Criteria
- [ ] POST /api/reports/branch-wise accepts branchIds array with multiple values and filters results correctly
- [ ] POST /api/reports/branch-wise returns 400 Bad Request when branchIds array contains invalid branch IDs
