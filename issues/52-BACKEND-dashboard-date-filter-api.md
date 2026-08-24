---
id: 52-BACKEND-dashboard-date-filter-api
title: [BACKEND] Dashboard Date Filter API
type: task
taskType: BACKEND
userStory: story-05-04-02
feature: feature-05-04
epic: epic-05
status: ready
dependencies: [09-DATABASE-usage-record-model]
---

# [BACKEND] Dashboard Date Filter API

## Description
Extend GET /api/dashboard/widgets endpoint to accept startDate and endDate query parameters filtering dashboard metrics to specified date range.

## Acceptance Criteria
- [ ] GET /api/dashboard/widgets with startDate and endDate filters returns metrics only for that date range
- [ ] Dashboard date filtering correctly calculates totalUsage changePercent comparing filtered period to previous equivalent period
