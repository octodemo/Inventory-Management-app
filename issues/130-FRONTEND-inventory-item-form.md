---
id: 130-FRONTEND-inventory-item-form
title: [FRONTEND] Inventory Item Form
type: task
taskType: FRONTEND
userStory: story-01-01-01
feature: feature-01-01
epic: epic-01
status: done
dependencies: [10-BACKEND-inventory-item-api]
---

# [FRONTEND] Inventory Item Form

## Description
Create React component for inventory item creation form with vendor and hierarchy selection.

## Acceptance Criteria
- [ ] Component renders form with data-testid="inventory-form" including fields for name, vendor, hierarchy
- [ ] Form calls POST /api/inventory on submit and displays success or validation error messages
