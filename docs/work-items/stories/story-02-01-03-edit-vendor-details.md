---
id: story-02-01-03
title: Edit vendor details
type: user-story
feature: feature-02-01
epic: epic-02
status: ready
priority: should-have
source: FR-002
dependencies: []
tasks: []
---

# Story 02-01-03: Edit vendor details

## User Story
As an Admin,
I can update existing vendor contact information,
so that I can keep supplier details current as relationships evolve.

## Business Context
Vendor editing supports FR-002 by allowing administrators to maintain accurate supplier contact information over time.

## Acceptance Criteria
- [ ] Given I select a vendor, when I edit contact details and save, then the updated information is persisted
- [ ] Given I edit a vendor email, when the new email has invalid format, then I see a validation error
- [ ] Given I update a vendor, when I save successfully, then the vendor list reflects the updated information
- [ ] Given I edit a vendor, when I cancel without saving, then no changes are persisted

## Definition of Done
- All acceptance criteria above are verified and passing
- All tasks under this story are complete
- Behaviour is demonstrable in the running application
- No known defects for this story

## Technical Notes
- API: PUT /api/vendors/:id (updates Vendor fields)
- Validation: Email format validation on update
- Component: VendorEditForm (data-testid: vendor-edit-form)
- Business rule: Maintain accurate supplier contact information (FR-002)
