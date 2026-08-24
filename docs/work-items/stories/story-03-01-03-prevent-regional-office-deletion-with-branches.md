---
id: story-03-01-03
title: Prevent regional office deletion with branches
type: user-story
feature: feature-03-01
epic: epic-03
status: ready
priority: must-have
source: FR-007
dependencies: []
tasks: [07-DATABASE-supervisor-model, 30-BACKEND-regional-office-delete-validation-api, 90-UNIT-TEST-regional-office-delete-validation-api, 150-FRONTEND-regional-office-delete-validation, 210-E2E-TEST-regional-office-deletion]
---

# Story 03-01-03: Prevent regional office deletion with branches

## User Story
As an Admin,
I am prevented from deleting a regional office that has associated branches,
so that data integrity is maintained across the organizational hierarchy.

## Business Context
Deletion protection is essential for FR-007 to prevent orphaned branches and maintain referential integrity in the organizational structure.

## Acceptance Criteria
- [ ] Given a regional office has associated branches, when I attempt to delete it, then I see an error message indicating the office cannot be deleted
- [ ] Given a regional office has no associated branches, when I delete it, then the office is successfully removed
- [ ] Given I attempt to delete a regional office with branches, when I see the error, then I understand how many branches are preventing deletion
- [ ] Given I delete a regional office successfully, when I view the regional office list, then the deleted office no longer appears

## Definition of Done
- All acceptance criteria above are verified and passing
- All tasks under this story are complete
- Behaviour is demonstrable in the running application
- No known defects for this story

## Technical Notes
- API: DELETE /api/regional-offices/:id (validates no associated branches)
- Validation: Prevent deletion if RegionalOffice.branches.length > 0
- Component: RegionalOfficeDeleteConfirmation (data-testid: regional-office-delete-dialog)
- Business rule: Cascading validation ensures organizational integrity (FR-007)
