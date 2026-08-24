---
id: 175-FRONTEND-bulk-upload-form
title: [FRONTEND] Bulk Upload Form
type: task
taskType: FRONTEND
userStory: story-06-01-01
feature: feature-06-01
epic: epic-06
status: ready
dependencies: [55-BACKEND-bulk-upload-api]
---

# [FRONTEND] Bulk Upload Form

## Description
Create React component for bulk data upload form with file selection and import type dropdown.

## Acceptance Criteria
- [ ] Component renders data-testid="upload-page" with file input data-testid="upload-file-input" and type selector data-testid="upload-type"
- [ ] Form calls POST /api/upload/{type} with selected file and displays import summary with imported, failed, errors counts
