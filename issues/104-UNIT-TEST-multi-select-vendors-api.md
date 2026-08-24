---
id: 104-UNIT-TEST-multi-select-vendors-api
title: [UNIT-TEST] Multi-Select Vendors API Test
type: task
taskType: UNIT-TEST
userStory: story-05-01-03
feature: feature-05-01
epic: epic-05
status: ready
dependencies: [44-BACKEND-multi-select-vendors-api]
---

# [UNIT-TEST] Multi-Select Vendors API Test

## Description
Write Jest unit tests for vendor-wise report with vendorIds array filter covering multiple vendor selection.

## Acceptance Criteria
- [ ] Unit test verifies POST /api/reports/vendor-wise with vendorIds array filters results correctly
- [ ] Unit test verifies POST /api/reports/vendor-wise returns 400 Bad Request when vendorIds contains invalid IDs
