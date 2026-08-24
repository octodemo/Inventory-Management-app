---
id: 26-BACKEND-vendor-filter-api
title: [BACKEND] Vendor Filter API
type: task
taskType: BACKEND
userStory: story-02-02-02
feature: feature-02-02
epic: epic-02
status: ready
dependencies: [04-DATABASE-vendor-model,09-DATABASE-usage-record-model]
---

# [BACKEND] Vendor Filter API

## Description
Extend POST /api/reports/vendor-wise endpoint to support filtering by vendor IDs, date range, and branches. Returns filtered vendor-wise usage data.

## Acceptance Criteria
- [ ] POST /api/reports/vendor-wise with vendorIds filter returns usage data only for specified vendors
- [ ] POST /api/reports/vendor-wise with date range (startDate, endDate) filters usage records within that period
