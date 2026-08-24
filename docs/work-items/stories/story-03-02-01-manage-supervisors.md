---
id: story-03-02-01
title: Manage supervisors
type: user-story
feature: feature-03-02
epic: epic-03
status: ready
priority: must-have
source: FR-009
dependencies: []
tasks: [31-BACKEND-supervisor-api, 91-UNIT-TEST-supervisor-api, 151-FRONTEND-supervisor-form, 211-E2E-TEST-supervisor-management]
---

# Story 03-02-01: Manage supervisors

## User Story
As an Admin,
I can create, view, update, and delete supervisor records with unique email addresses,
so that I can maintain supervisor master data for premises oversight.

## Business Context
Supervisor management is the core behaviour for FR-009 enabling accountability tracking. Each supervisor has a unique email for identification and contact.

## Acceptance Criteria
- [ ] Given I create a supervisor, when I provide name, email, and phone, then the supervisor is created with a unique email
- [ ] Given I attempt to create a supervisor with a duplicate email, when I submit, then I see an error message preventing creation
- [ ] Given I view the supervisor list, when I see supervisors, then name, email, and phone are displayed in a paginated table
- [ ] Given I update a supervisor's email, when the new email is already used, then I see a validation error

## Definition of Done
- All acceptance criteria above are verified and passing
- All tasks under this story are complete
- Behaviour is demonstrable in the running application
- No known defects for this story

## Technical Notes
- API: POST /api/supervisors, GET /api/supervisors, PUT /api/supervisors/:id, DELETE /api/supervisors/:id
- Validation: Unique constraint on Supervisor.email
- Component: SupervisorForm (data-testid: supervisor-form), SupervisorList (data-testid: supervisor-list)
- Business rule: Unique email validation for supervisors (FR-009)
