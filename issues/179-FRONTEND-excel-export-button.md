---
id: 179-FRONTEND-excel-export-button
title: [FRONTEND] Excel Export Button
type: task
taskType: FRONTEND
userStory: story-06-02-02
feature: feature-06-02
epic: epic-06
status: ready
dependencies: [59-BACKEND-excel-export-api]
---

# [FRONTEND] Excel Export Button

## Description
Create React component for Excel export button on report pages.

## Acceptance Criteria
- [ ] Component renders Excel button in data-testid="export-buttons" group
- [ ] Excel button triggers GET /api/download/report with format=excel and current filter parameters
