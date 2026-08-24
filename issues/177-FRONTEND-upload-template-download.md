---
id: 177-FRONTEND-upload-template-download
title: [FRONTEND] Upload Template Download
type: task
taskType: FRONTEND
userStory: story-06-01-03
feature: feature-06-01
epic: epic-06
status: ready
dependencies: [57-BACKEND-upload-template-api]
---

# [FRONTEND] Upload Template Download

## Description
Create React component for downloading upload templates with correct column headers.

## Acceptance Criteria
- [ ] Component renders download template button triggering GET /api/upload/template/{type}
- [ ] Button downloads CSV file with appropriate filename and headers
