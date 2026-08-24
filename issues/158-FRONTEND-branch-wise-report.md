---
id: 158-FRONTEND-branch-wise-report
title: [FRONTEND] Branch-Wise Report
type: task
taskType: FRONTEND
userStory: story-04-02-01
feature: feature-04-02
epic: epic-04
status: ready
dependencies: [38-BACKEND-branch-usage-filter-api]
---

# [FRONTEND] Branch-Wise Report

## Description
Create React component for branch-wise usage report with multi-select branch filter and date range.

## Acceptance Criteria
- [ ] Component renders filter panel with multi-select branch dropdown and date pickers
- [ ] Filter changes trigger POST /api/reports/branch-wise and update report table with branch data
