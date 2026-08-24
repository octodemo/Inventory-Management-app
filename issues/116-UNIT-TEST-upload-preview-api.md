---
id: 116-UNIT-TEST-upload-preview-api
title: [UNIT-TEST] Upload Preview API Test
type: task
taskType: UNIT-TEST
userStory: story-06-01-02
feature: feature-06-01
epic: epic-06
status: ready
dependencies: [56-BACKEND-upload-preview-api]
---

# [UNIT-TEST] Upload Preview API Test

## Description
Write Jest unit tests for upload preview functionality covering data parsing and validation without database insertion.

## Acceptance Criteria
- [ ] Unit test verifies POST /api/upload/inventory with preview=true returns first 10 rows without database insertion
- [ ] Unit test verifies upload preview validates data format and returns validation errors
