---
id: 178-FRONTEND-csv-export-button
title: [FRONTEND] CSV Export Button
type: task
taskType: FRONTEND
userStory: story-06-02-01
feature: feature-06-02
epic: epic-06
status: ready
dependencies: [58-BACKEND-csv-export-api]
---

# [FRONTEND] CSV Export Button

## Description
Create React component for CSV export button on report pages.

## Acceptance Criteria
- [ ] Component renders data-testid="export-buttons" with CSV button
- [ ] CSV button triggers GET /api/download/report with format=csv and current filter parameters
