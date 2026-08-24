---
id: 120-UNIT-TEST-pdf-export-api
title: [UNIT-TEST] PDF Export API Test
type: task
taskType: UNIT-TEST
userStory: story-06-02-03
feature: feature-06-02
epic: epic-06
status: ready
dependencies: [60-BACKEND-pdf-export-api]
---

# [UNIT-TEST] PDF Export API Test

## Description
Write Jest unit tests for POST /api/download/report-pdf endpoint covering PDF generation with report formatting.

## Acceptance Criteria
- [ ] Unit test verifies POST /api/download/report-pdf generates PDF file from report data with proper formatting
- [ ] Unit test verifies PDF export includes report title, filter summary, data table, and timestamp
