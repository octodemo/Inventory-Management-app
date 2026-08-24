---
id: story-01-01-04
title: Delete inventory item
type: user-story
feature: feature-01-01
epic: epic-01
status: ready
priority: should-have
source: FR-001
dependencies: []
tasks: [13-BACKEND-inventory-delete-api, 73-UNIT-TEST-inventory-delete-api, 133-FRONTEND-inventory-delete-action, 193-E2E-TEST-inventory-item-deletion]
---

# Story 01-01-04: Delete inventory item

## User Story
As an Admin,
I can delete an inventory item with a confirmation prompt,
so that obsolete or incorrectly created items are removed from the system.

## Business Context
Inventory master deletion capability required by FR-001. This story enables administrators to maintain a clean inventory master by removing items that are no longer needed, were created in error, or have been permanently discontinued. Deletion must be blocked if the item has associated usage records to preserve data integrity.

## Acceptance Criteria
- [ ] Given I am viewing an inventory item's detail page, when I click "Delete", then I see a confirmation dialog asking me to confirm the deletion
- [ ] Given I see the deletion confirmation dialog, when I click "Confirm", then the inventory item is deleted and I am redirected to the inventory list
- [ ] Given I see the deletion confirmation dialog, when I click "Cancel", then the item is not deleted and I remain on the item detail page
- [ ] Given an inventory item has associated usage records, when I attempt to delete it, then I see an error message stating deletion is blocked and the item is not deleted
- [ ] Given I delete an inventory item successfully, when I search for the deleted item in the inventory list, then the item no longer appears

## Definition of Done
- All acceptance criteria above are verified and passing
- All tasks under this story are complete
- Behaviour is demonstrable in the running application
- No known defects for this story

## Technical Notes
- API: DELETE /api/inventory/:id (deletes inventory item if no usage records exist)
- Domain: InventoryItem entity with referential integrity check on UsageRecord
- Component: InventoryItemDeleteConfirmation (data-testid: inventory-item-delete-confirmation)
- Business rule: Deletion blocked if item has associated UsageRecord entries (data integrity NFR-014)
- Error response: HTTP 409 Conflict if usage records exist
