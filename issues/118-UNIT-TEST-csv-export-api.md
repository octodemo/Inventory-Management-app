---
id: 118-UNIT-TEST-csv-export-api
title: [UNIT-TEST] CSV Export API Test
type: task
taskType: UNIT-TEST
userStory: story-06-02-01
feature: feature-06-02
epic: epic-06
status: done
dependencies: [58-BACKEND-csv-export-api]
---

# [UNIT-TEST] CSV Export API Test

## Description
Write Jest unit tests for GET /api/download/report with format=csv covering file generation and content headers.

## Acceptance Criteria
- [ ] Unit test verifies GET /api/download/report with format=csv returns CSV file with appropriate headers
- [ ] Unit test verifies CSV export includes all report data respecting filters without pagination limits
