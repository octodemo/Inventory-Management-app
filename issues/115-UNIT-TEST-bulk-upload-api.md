---
id: 115-UNIT-TEST-bulk-upload-api
title: [UNIT-TEST] Bulk Upload API Test
type: task
taskType: UNIT-TEST
userStory: story-06-01-01
feature: feature-06-01
epic: epic-06
status: ready
dependencies: [55-BACKEND-bulk-upload-api]
---

# [UNIT-TEST] Bulk Upload API Test

## Description
Write Jest unit tests for POST /api/upload/{type} endpoints covering file processing, validation, and import results.

## Acceptance Criteria
- [ ] Unit test verifies POST /api/upload/inventory accepts CSV/Excel file and returns import summary with imported, failed, errors
- [ ] Unit test verifies bulk upload returns 400 Bad Request for invalid file types
