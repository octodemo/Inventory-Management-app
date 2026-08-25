---
id: 23-BACKEND-vendor-update-api
title: [BACKEND] Vendor Update API
type: task
taskType: BACKEND
userStory: story-02-01-03
feature: feature-02-01
epic: epic-02
status: done
dependencies: [04-DATABASE-vendor-model]
---

# [BACKEND] Vendor Update API

## Description
Implement PUT /api/vendors/:id and GET /api/vendors/:id endpoints for updating and retrieving vendor details. Validates required name field on update.

## Acceptance Criteria
- [ ] PUT /api/vendors/:id updates the vendor with new values and returns 200 OK with updated details
- [ ] PUT /api/vendors/:id returns 400 Bad Request when name field is missing or empty
