---
id: story-07-01-02
title: Logout and clear session
type: user-story
feature: feature-07-01
epic: epic-07
status: ready
priority: must-have
source: FR-027
dependencies: []
tasks: [62-BACKEND-logout-api, 122-UNIT-TEST-logout-api, 182-FRONTEND-logout-action, 242-E2E-TEST-logout]
---

# Story 07-01-02: Logout and clear session

## User Story
As a User,
I can log out of the application to end my session and clear my authentication token,
so that I can protect my account when using a shared computer.

## Business Context
Logout functionality is essential for FR-027 providing users control over session termination and ensuring security in shared-device scenarios.

## Acceptance Criteria
- [ ] Given I am authenticated, when I click the "Logout" button, then my session is terminated and I am redirected to the login page
- [ ] Given I log out, when I navigate back to the application, then I am required to authenticate again
- [ ] Given I log out, when my session token is cleared, then subsequent API calls return 401 Unauthorized until I log in again
- [ ] Given I log out, when I click logout, then the IAM framework is also notified to terminate the session

## Definition of Done
- All acceptance criteria above are verified and passing
- All tasks under this story are complete
- Behaviour is demonstrable in the running application
- No known defects for this story

## Technical Notes
- API: POST /api/auth/logout (clears session token, notifies IAM)
- Component: LogoutButton (data-testid: logout-button)
- Session clearing: Remove token from cookie/storage, invalidate server-side session
- IAM notification: Redirect to IAM logout endpoint per OAuth2/SAML protocol
- Business rule: Secure logout per FR-027
