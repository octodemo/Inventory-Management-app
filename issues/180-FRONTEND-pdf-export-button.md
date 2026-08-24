---
id: 180-FRONTEND-pdf-export-button
title: [FRONTEND] PDF Export Button
type: task
taskType: FRONTEND
userStory: story-06-02-03
feature: feature-06-02
epic: epic-06
status: ready
dependencies: [60-BACKEND-pdf-export-api]
---

# [FRONTEND] PDF Export Button

## Description
Create React component for PDF export button on report pages.

## Acceptance Criteria
- [ ] Component renders PDF button in data-testid="export-buttons" group
- [ ] PDF button triggers POST /api/download/report-pdf with current report data and filter parameters
