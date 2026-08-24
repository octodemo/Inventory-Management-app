---
id: 56-BACKEND-upload-preview-api
title: [BACKEND] Upload Preview API
type: task
taskType: BACKEND
userStory: story-06-01-02
feature: feature-06-01
epic: epic-06
status: ready
dependencies: []
---

# [BACKEND] Upload Preview API

## Description
Extend POST /api/upload/{type} endpoints with preview=true query parameter returning parsed data preview without committing to database.

## Acceptance Criteria
- [ ] POST /api/upload/inventory with preview=true returns first 10 rows of parsed data without database insertion
- [ ] Upload preview validates data format and returns validation errors for preview rows
