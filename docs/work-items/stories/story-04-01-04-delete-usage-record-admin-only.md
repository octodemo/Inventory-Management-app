---
id: story-04-01-04
title: Delete usage record (Admin only)
type: user-story
feature: feature-04-01
epic: epic-04
status: ready
priority: should-have
source: FR-003
dependencies: []
tasks: []
---

# Story 04-01-04: Delete usage record (Admin only)

## User Story
As an Admin,
I can delete usage records that contain errors or are no longer needed,
so that I can maintain data quality in the usage tracking system.

## Business Context
Usage record deletion supports FR-003 while restricting deletion to Admin role to prevent unauthorized data removal and maintain audit integrity.

## Acceptance Criteria
- [ ] Given I am an Admin, when I delete a usage record, then the record is removed from the system
- [ ] Given I am a User (not Admin), when I view a usage record, then delete controls are not available
- [ ] Given I delete a usage record successfully, when I view the usage list, then the deleted record no longer appears
- [ ] Given I attempt to delete a usage record, when I confirm the action, then the record is permanently removed

## Definition of Done
- All acceptance criteria above are verified and passing
- All tasks under this story are complete
- Behaviour is demonstrable in the running application
- No known defects for this story

## Technical Notes
- API: DELETE /api/usage/:id (Admin role required)
- Authorization: Admin-only enforcement via RBAC
- Component: UsageRecordDeleteConfirmation (data-testid: usage-delete-dialog)
- Business rule: Admin-only deletion per FR-003 and access control requirements
