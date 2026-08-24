---
id: 18-BACKEND-item-rate-api
title: [BACKEND] Item Rate API
type: task
taskType: BACKEND
userStory: story-01-03-01
feature: feature-01-03
epic: epic-01
status: ready
dependencies: [03-DATABASE-item-rate-model]
---

# [BACKEND] Item Rate API

## Description
Implement POST /api/rates endpoint for creating item rates with effectiveFrom and optional effectiveTo dates. Validates that date ranges don't overlap for the same item.

## Acceptance Criteria
- [ ] POST /api/rates creates a new item rate and returns 201 Created with rate details
- [ ] POST /api/rates returns 400 Bad Request when creating a rate with overlapping date range for the same item
