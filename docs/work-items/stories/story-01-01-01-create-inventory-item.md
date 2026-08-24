---
id: story-01-01-01
title: Create inventory item
type: user-story
feature: feature-01-01
epic: epic-01
status: ready
priority: must-have
source: FR-001
dependencies: []
tasks: []
---

# Story 01-01-01: Create inventory item

## User Story
As an Admin,
I can create a new inventory item with name, description, vendor, hierarchy, and unit,
so that the item is available for usage tracking across all branches.

## Business Context
Core inventory master management capability required by FR-001. Without this story, no inventory items can be added to the system and usage tracking cannot begin. The system must assign a unique identifier to each inventory item upon creation.

## Acceptance Criteria
- [ ] Given I am on the inventory management page, when I click "Create Item" and fill in all required fields (name, vendor, hierarchy, unit) and submit, then a new inventory item is created with a unique identifier
- [ ] Given I submit a new inventory item, when the item is created successfully, then I am shown a confirmation message with the item details
- [ ] Given I attempt to create an inventory item, when I leave a required field empty (name, vendor, hierarchy, or unit) and submit, then I see a validation error message and the form is not submitted
- [ ] Given I create a new inventory item, when I navigate to the inventory list, then the newly created item appears in the list with correct name, vendor, hierarchy, and unit
- [ ] Given I am creating an inventory item, when I select a vendor from the dropdown, then all active vendors are available for selection

## Definition of Done
- All acceptance criteria above are verified and passing
- All tasks under this story are complete
- Behaviour is demonstrable in the running application
- No known defects for this story

## Technical Notes
- API: POST /api/inventory (creates inventory item with auto-generated unique ID)
- Domain: InventoryItem entity with required fields: name, vendorId, hierarchyId, unit
- Component: InventoryItemCreateForm (data-testid: inventory-item-create-form)
- Business rule: Each item must reference exactly one Vendor and one ItemHierarchy (FR-001, FR-002, FR-004)
- Validation: Name, vendor, hierarchy, and unit are required fields
