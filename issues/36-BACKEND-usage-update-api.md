---
id: 36-BACKEND-usage-update-api
title: [BACKEND] Usage Update API
type: task
taskType: BACKEND
userStory: story-04-01-03
feature: feature-04-01
epic: epic-04
status: done
dependencies: [09-DATABASE-usage-record-model]
---

# [BACKEND] Usage Update API

## Description
Implement PUT /api/usage/:id and GET /api/usage/:id endpoints for updating and retrieving usage records. Validates item and branch existence on update.

## Acceptance Criteria
- [ ] PUT /api/usage/:id updates the usage record and returns 200 OK with updated details
- [ ] PUT /api/usage/:id returns 400 Bad Request when required fields are missing or invalid
