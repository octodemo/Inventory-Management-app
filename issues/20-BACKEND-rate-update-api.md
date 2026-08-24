---
id: 20-BACKEND-rate-update-api
title: [BACKEND] Rate Update API
type: task
taskType: BACKEND
userStory: story-01-03-03
feature: feature-01-03
epic: epic-01
status: ready
dependencies: [03-DATABASE-item-rate-model]
---

# [BACKEND] Rate Update API

## Description
Implement PUT /api/rates/:id endpoint for updating rate effective periods. Validates that updated date ranges don't overlap with other rates for the same item.

## Acceptance Criteria
- [ ] PUT /api/rates/:id updates the rate effective period and returns 200 OK with updated details
- [ ] PUT /api/rates/:id returns 400 Bad Request when updated date range overlaps with existing rates for the same item
