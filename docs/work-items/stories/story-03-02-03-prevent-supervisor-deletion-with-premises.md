---
id: story-03-02-03
title: Prevent supervisor deletion with premises
type: user-story
feature: feature-03-02
epic: epic-03
status: ready
priority: must-have
source: FR-009, FR-010
dependencies: []
tasks: []
---

# Story 03-02-03: Prevent supervisor deletion with premises

## User Story
As an Admin,
I am prevented from deleting a supervisor who has assigned premises,
so that supervisory relationships are preserved and data integrity is maintained.

## Business Context
Deletion protection is essential for FR-009 and FR-010 to prevent orphaned premises and maintain referential integrity in the supervisor-premises mapping.

## Acceptance Criteria
- [ ] Given a supervisor has assigned premises, when I attempt to delete the supervisor, then I see an error message indicating deletion is blocked
- [ ] Given a supervisor has no assigned premises, when I delete the supervisor, then the supervisor is successfully removed
- [ ] Given I attempt to delete a supervisor with premises, when I see the error, then I understand which premises are preventing deletion
- [ ] Given I delete a supervisor successfully, when I view the supervisor list, then the deleted supervisor no longer appears

## Definition of Done
- All acceptance criteria above are verified and passing
- All tasks under this story are complete
- Behaviour is demonstrable in the running application
- No known defects for this story

## Technical Notes
- API: DELETE /api/supervisors/:id (validates no assigned premises)
- Validation: Prevent deletion if Supervisor.premises.length > 0
- Component: SupervisorDeleteConfirmation (data-testid: supervisor-delete-dialog)
- Business rule: Cascading validation ensures supervisory relationship integrity (FR-010)
