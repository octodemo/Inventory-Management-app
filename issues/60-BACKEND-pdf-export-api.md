---
id: 60-BACKEND-pdf-export-api
title: [BACKEND] PDF Export API
type: task
taskType: BACKEND
userStory: story-06-02-03
feature: feature-06-02
epic: epic-06
status: ready
dependencies: [09-DATABASE-usage-record-model]
---

# [BACKEND] PDF Export API

## Description
Implement POST /api/download/report-pdf endpoint accepting report filters and generating formatted PDF report with headers, tables, and summary sections.

## Acceptance Criteria
- [ ] POST /api/download/report-pdf generates PDF file from report data with proper formatting and returns as download
- [ ] PDF export includes report title, filter summary, data table, and generated timestamp
