---
id: story-03-01-02
title: Manage branches
type: user-story
feature: feature-03-01
epic: epic-03
status: ready
priority: must-have
source: FR-006
dependencies: []
tasks: []
---

# Story 03-01-02: Manage branches

## User Story
As an Admin,
I can create, view, update, and delete branch records with assignment to a regional office,
so that I can maintain the complete branch network of approximately 1,500 branches.

## Business Context
Branch management is the core behaviour for FR-006 enabling branch-level usage tracking across the nationwide network. Each branch belongs to exactly one regional office.

## Acceptance Criteria
- [ ] Given I create a branch, when I provide name, code, address, and select a regional office, then the branch is created and assigned to that office
- [ ] Given I attempt to create a branch with a duplicate code, when I submit, then I see an error message preventing creation
- [ ] Given I view the branch list, when I see branches, then name, code, regional office, and address are displayed with pagination
- [ ] Given I filter branches by regional office, when I apply the filter, then only branches under that regional office are displayed

## Definition of Done
- All acceptance criteria above are verified and passing
- All tasks under this story are complete
- Behaviour is demonstrable in the running application
- No known defects for this story

## Technical Notes
- API: POST /api/branches, GET /api/branches, PUT /api/branches/:id, DELETE /api/branches/:id
- Query param: regionalOfficeId for filtering
- Validation: Unique code constraint on Branch.code; required regionalOfficeId
- Component: BranchForm (data-testid: branch-form), BranchList (data-testid: branch-list)
- Business rule: Each branch assigned to exactly one regional office (FR-006)
