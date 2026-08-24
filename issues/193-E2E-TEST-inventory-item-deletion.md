---
id: 193-E2E-TEST-inventory-item-deletion
title: [E2E-TEST] Inventory Item Deletion
type: task
taskType: E2E-TEST
userStory: story-01-01-04
feature: feature-01-01
epic: epic-01
status: ready
dependencies: [133-FRONTEND-inventory-delete-action]
---

# [E2E-TEST] Inventory Item Deletion

## Description
Write Playwright E2E test for deleting inventory item with dependency validation

## Acceptance Criteria
- [ ] Test clicks delete button, confirms deletion dialog, verifies success message and item removed from list
- [ ] Test attempts delete on item with usage records and verifies error message displayed
