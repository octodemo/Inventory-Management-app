---
id: 176-FRONTEND-upload-preview
title: [FRONTEND] Upload Preview
type: task
taskType: FRONTEND
userStory: story-06-01-02
feature: feature-06-01
epic: epic-06
status: ready
dependencies: [56-BACKEND-upload-preview-api]
---

# [FRONTEND] Upload Preview

## Description
Create React component for upload file preview showing first 10 rows with validation errors before import.

## Acceptance Criteria
- [ ] Component adds preview button triggering POST /api/upload/{type} with preview=true
- [ ] Preview displays table with first 10 rows and highlights validation errors without database insertion
