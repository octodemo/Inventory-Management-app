---
id: 59-BACKEND-excel-export-api
title: [BACKEND] Excel Export API
type: task
taskType: BACKEND
userStory: story-06-02-02
feature: feature-06-02
epic: epic-06
status: ready
dependencies: [09-DATABASE-usage-record-model]
---

# [BACKEND] Excel Export API

## Description
Implement GET /api/download/report endpoint with format=excel query parameter converting report data to Excel format (.xlsx) and returning as file download.

## Acceptance Criteria
- [ ] GET /api/download/report with format=excel returns Excel file with appropriate headers and Content-Disposition
- [ ] Excel export includes all report data with formatted headers and proper column widths
