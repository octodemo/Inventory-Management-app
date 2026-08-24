---
id: story-01-01-03
title: Edit inventory item details
type: user-story
feature: feature-01-01
epic: epic-01
status: ready
priority: must-have
source: FR-001
dependencies: []
tasks: [12-BACKEND-inventory-update-api, 72-UNIT-TEST-inventory-update-api, 132-FRONTEND-inventory-update-form, 192-E2E-TEST-inventory-item-update]
---

# Story 01-01-03: Edit inventory item details

## User Story
As an Admin,
I can update existing inventory item details including name, description, vendor, hierarchy, and unit,
so that item information remains accurate and current across the system.

## Business Context
Core inventory master update capability required by FR-001. This story enables administrators to correct errors, update vendor assignments, reclassify items within the hierarchy, and maintain accurate unit definitions as business needs evolve.

## Acceptance Criteria
- [ ] Given I am viewing an inventory item's detail page, when I click "Edit" and modify any field (name, description, vendor, hierarchy, or unit) and save, then the item is updated with the new values
- [ ] Given I update an inventory item, when the update is successful, then I see a confirmation message and the updated values are displayed
- [ ] Given I am editing an inventory item, when I clear a required field (name, vendor, hierarchy, or unit) and attempt to save, then I see a validation error message and the form is not submitted
- [ ] Given I update an inventory item's vendor, when I navigate to the inventory list and filter by the new vendor, then the updated item appears in that vendor's list
- [ ] Given I am editing an inventory item, when I click "Cancel", then no changes are saved and I return to the item detail view

## Definition of Done
- All acceptance criteria above are verified and passing
- All tasks under this story are complete
- Behaviour is demonstrable in the running application
- No known defects for this story

## Technical Notes
- API: PUT /api/inventory/:id (updates existing inventory item)
- API: GET /api/inventory/:id (retrieves current item details for editing)
- Domain: InventoryItem entity with validation on required fields
- Component: InventoryItemEditForm (data-testid: inventory-item-edit-form)
- Business rule: Item must maintain reference to exactly one Vendor and one ItemHierarchy
- Validation: Name, vendor, hierarchy, and unit remain required after update
