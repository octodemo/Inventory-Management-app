---
id: 34-BACKEND-usage-record-api
title: [BACKEND] Usage Record API
type: task
taskType: BACKEND
userStory: story-04-01-01
feature: feature-04-01
epic: epic-04
status: ready
dependencies: [09-DATABASE-usage-record-model]
---

# [BACKEND] Usage Record API

## Description
Implement POST /api/usage endpoint for creating usage records with itemId, branchId, quantity, usageDate, and optional notes. Validates item and branch existence.

## Acceptance Criteria
- [ ] POST /api/usage creates a new usage record and returns 201 Created with record details
- [ ] POST /api/usage returns 400 Bad Request when itemId or branchId reference non-existent entities
