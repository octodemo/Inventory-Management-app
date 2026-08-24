---
id: 86-UNIT-TEST-vendor-filter-api
title: [UNIT-TEST] Vendor Filter API Test
type: task
taskType: UNIT-TEST
userStory: story-02-02-02
feature: feature-02-02
epic: epic-02
status: ready
dependencies: [26-BACKEND-vendor-filter-api]
---

# [UNIT-TEST] Vendor Filter API Test

## Description
Write Jest unit tests for POST /api/reports/vendor-wise endpoint covering vendorIds and date range filtering.

## Acceptance Criteria
- [ ] Unit test verifies POST /api/reports/vendor-wise with vendorIds filter returns only data for specified vendors
- [ ] Unit test verifies POST /api/reports/vendor-wise with date range filters usage records correctly
