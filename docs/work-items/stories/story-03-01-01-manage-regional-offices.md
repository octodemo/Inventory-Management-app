---
id: story-03-01-01
title: Manage regional offices
type: user-story
feature: feature-03-01
epic: epic-03
status: ready
priority: must-have
source: FR-007
dependencies: []
tasks: []
---

# Story 03-01-01: Manage regional offices

## User Story
As an Admin,
I can create, view, update, and delete regional office records with name, code, and address,
so that I can maintain the organizational structure for regional-level reporting.

## Business Context
Regional office management is foundational for FR-007 and enables regional-level usage aggregation. Each regional office receives a unique code for identification.

## Acceptance Criteria
- [ ] Given I create a regional office, when I provide name, code, and address, then a new regional office is created with a unique code
- [ ] Given I attempt to create a regional office with a duplicate code, when I submit, then I see an error message preventing creation
- [ ] Given I view the regional office list, when I see all offices, then name, code, and address are displayed in a paginated table
- [ ] Given I update a regional office, when I save changes, then the updated information is persisted and displayed

## Definition of Done
- All acceptance criteria above are verified and passing
- All tasks under this story are complete
- Behaviour is demonstrable in the running application
- No known defects for this story

## Technical Notes
- API: POST /api/regional-offices, GET /api/regional-offices, PUT /api/regional-offices/:id, DELETE /api/regional-offices/:id
- Validation: Unique code constraint on RegionalOffice.code
- Component: RegionalOfficeForm (data-testid: regional-office-form), RegionalOfficeList (data-testid: regional-office-list)
- Business rule: Unique code generation and validation (FR-007)
