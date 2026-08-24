---
id: 160-FRONTEND-regional-office-wise-report
title: [FRONTEND] Regional Office-Wise Report
type: task
taskType: FRONTEND
userStory: story-04-03-01
feature: feature-04-03
epic: epic-04
status: done
dependencies: [40-BACKEND-regional-office-usage-filter-api]
---

# [FRONTEND] Regional Office-Wise Report

## Description
Create React component for regional-office-wise usage report with multi-select filter and aggregation.

## Acceptance Criteria
- [ ] Component renders filter panel with multi-select regional office dropdown
- [ ] Filter changes trigger POST /api/reports/regional-office-wise showing aggregated usage across branches
