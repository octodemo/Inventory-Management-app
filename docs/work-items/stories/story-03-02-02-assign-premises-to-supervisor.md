---
id: story-03-02-02
title: Assign premises to supervisor
type: user-story
feature: feature-03-02
epic: epic-03
status: ready
priority: must-have
source: FR-008, FR-010
dependencies: []
tasks: []
---

# Story 03-02-02: Assign premises to supervisor

## User Story
As an Admin,
I can create premises records and assign each to exactly one supervisor,
so that I can establish supervisory relationships for accountability tracking.

## Business Context
Premises-to-supervisor assignment is the core behaviour for FR-008 and FR-010 enabling one-to-many mapping where one supervisor can oversee multiple premises.

## Acceptance Criteria
- [ ] Given I create a premises, when I provide name, address, and select a supervisor, then the premises is created and assigned to that supervisor
- [ ] Given I view a supervisor's detail page, when I see assigned premises, then all premises under that supervisor are displayed
- [ ] Given I reassign a premises, when I select a different supervisor and save, then the premises is reassigned to the new supervisor
- [ ] Given I create or edit premises, when no supervisor is selected, then I see a validation error requiring supervisor assignment

## Definition of Done
- All acceptance criteria above are verified and passing
- All tasks under this story are complete
- Behaviour is demonstrable in the running application
- No known defects for this story

## Technical Notes
- API: POST /api/premises, GET /api/premises, PUT /api/premises/:id
- GET /api/supervisors/:id includes list of assigned premises
- Validation: Required supervisorId on Premises
- Component: PremisesForm (data-testid: premises-form), SupervisorDetailView (data-testid: supervisor-detail)
- Business rule: One premises to exactly one supervisor; supervisor to many premises (FR-010)
