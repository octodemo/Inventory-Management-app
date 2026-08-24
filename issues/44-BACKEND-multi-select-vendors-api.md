---
id: 44-BACKEND-multi-select-vendors-api
title: [BACKEND] Multi-Select Vendors API
type: task
taskType: BACKEND
userStory: story-05-01-03
feature: feature-05-01
epic: epic-05
status: ready
dependencies: [04-DATABASE-vendor-model]
---

# [BACKEND] Multi-Select Vendors API

## Description
Ensure POST /api/reports/vendor-wise endpoint accepts vendorIds array filter allowing multiple vendor selection for report filtering.

## Acceptance Criteria
- [ ] POST /api/reports/vendor-wise accepts vendorIds array with multiple values and filters results correctly
- [ ] POST /api/reports/vendor-wise returns 400 Bad Request when vendorIds array contains invalid vendor IDs
