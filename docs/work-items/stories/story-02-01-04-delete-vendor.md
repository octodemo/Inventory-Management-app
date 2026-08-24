---
id: story-02-01-04
title: Delete vendor
type: user-story
feature: feature-02-01
epic: epic-02
status: ready
priority: should-have
source: FR-002
dependencies: []
tasks: []
---

# Story 02-01-04: Delete vendor

## User Story
As an Admin,
I can delete a vendor that has no associated inventory items,
so that I can remove obsolete suppliers from the system.

## Business Context
Vendor deletion supports FR-002 while protecting data integrity by preventing deletion of vendors with active item associations.

## Acceptance Criteria
- [ ] Given a vendor has no associated inventory items, when I delete the vendor, then the vendor is removed from the system
- [ ] Given a vendor has associated inventory items, when I attempt to delete it, then I see an error message and the vendor is not deleted
- [ ] Given I delete a vendor successfully, when I view the vendor list, then the deleted vendor no longer appears
- [ ] Given I attempt to delete a vendor with items, when I see the error message, then I understand which items prevent deletion

## Definition of Done
- All acceptance criteria above are verified and passing
- All tasks under this story are complete
- Behaviour is demonstrable in the running application
- No known defects for this story

## Technical Notes
- API: DELETE /api/vendors/:id (validates no associated InventoryItem records)
- Validation: Prevent deletion if Vendor.items.length > 0
- Component: VendorDeleteConfirmation (data-testid: vendor-delete-dialog)
- Business rule: Referential integrity prevents deletion of vendors with items (FR-002)
