---
id: story-04-01-03
title: Edit usage record
type: user-story
feature: feature-04-01
epic: epic-04
status: ready
priority: should-have
source: FR-003
dependencies: []
tasks: [36-BACKEND-usage-update-api, 96-UNIT-TEST-usage-update-api, 156-FRONTEND-usage-update-form, 216-E2E-TEST-usage-record-update]
---

# Story 04-01-03: Edit usage record

## User Story
As a User,
I can edit an existing usage record if I have appropriate permissions,
so that I can correct data entry errors or update consumption information.

## Business Context
Usage record editing supports FR-003 by allowing authorized users to maintain data accuracy while respecting role-based access controls.

## Acceptance Criteria
- [ ] Given I have edit permissions, when I update a usage record's quantity, date, or notes, then the changes are saved
- [ ] Given I edit a usage record, when I enter an invalid quantity, then I see a validation error
- [ ] Given I update a usage record successfully, when I view the usage list, then the updated information is displayed
- [ ] Given I lack edit permissions, when I attempt to edit a record, then edit controls are not available

## Definition of Done
- All acceptance criteria above are verified and passing
- All tasks under this story are complete
- Behaviour is demonstrable in the running application
- No known defects for this story

## Technical Notes
- API: PUT /api/usage/:id (updates quantity, usageDate, notes)
- Validation: quantity > 0; date validation
- Component: UsageRecordEditForm (data-testid: usage-edit-form)
- Business rule: Edit permissions enforced per role-based access control
