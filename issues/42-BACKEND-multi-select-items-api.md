---
id: 42-BACKEND-multi-select-items-api
title: [BACKEND] Multi-Select Items API
type: task
taskType: BACKEND
userStory: story-05-01-01
feature: feature-05-01
epic: epic-05
status: done
dependencies: [01-DATABASE-inventory-item-model]
---

# [BACKEND] Multi-Select Items API

## Description
Ensure POST /api/reports/item-wise endpoint accepts itemIds array filter allowing multiple item selection for report filtering.

## Acceptance Criteria
- [ ] POST /api/reports/item-wise accepts itemIds array with multiple values and filters results correctly
- [ ] POST /api/reports/item-wise returns 400 Bad Request when itemIds array contains invalid item IDs
