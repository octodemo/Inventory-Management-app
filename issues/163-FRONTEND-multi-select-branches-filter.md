---
id: 163-FRONTEND-multi-select-branches-filter
title: [FRONTEND] Multi-Select Branches Filter
type: task
taskType: FRONTEND
userStory: story-05-01-02
feature: feature-05-01
epic: epic-05
status: ready
dependencies: [43-BACKEND-multi-select-branches-api]
---

# [FRONTEND] Multi-Select Branches Filter

## Description
Create React component for branch-wise report with multi-select branch dropdown filter.

## Acceptance Criteria
- [ ] Component renders filter panel with data-testid="filter-branches" multi-select dropdown
- [ ] Filter changes trigger POST /api/reports/branch-wise with branchIds array
