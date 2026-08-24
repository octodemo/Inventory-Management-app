---
id: story-07-02-03
title: Display access denied message for unauthorized actions
type: user-story
feature: feature-07-02
epic: epic-07
status: ready
priority: should-have
source: FR-026
dependencies: []
tasks: [66-BACKEND-rbac-access-denied-api, 126-UNIT-TEST-rbac-access-denied-api, 186-FRONTEND-rbac-access-denied, 246-E2E-TEST-access-denied]
---

# Story 07-02-03: Display access denied message for unauthorized actions

## User Story
As a User,
I see a clear access denied message when I attempt an action I am not authorized to perform,
so that I understand why the operation was blocked.

## Business Context
Access denied messaging is essential for FR-026 ensuring users receive clear feedback when authorization fails supporting transparency and reducing frustration.

## Acceptance Criteria
- [ ] Given I attempt an unauthorized action, when the API returns 403, then I see an access denied message in the UI
- [ ] Given I see an access denied message, when I read it, then it clearly states I lack the required permissions
- [ ] Given I receive an access denied error, when the message is displayed, then it does not expose sensitive system details
- [ ] Given I see an access denied message, when I dismiss it, then I remain on the current page without disruption

## Definition of Done
- All acceptance criteria above are verified and passing
- All tasks under this story are complete
- Behaviour is demonstrable in the running application
- No known defects for this story

## Technical Notes
- Component: AccessDeniedMessage (data-testid: access-denied-message)
- Trigger: 403 response from API calls
- Display: Toast notification or modal with user-friendly message
- Message: "You do not have permission to perform this action."
- Business rule: Clear authorization feedback per FR-026
