---
id: story-07-01-01
title: Authenticate via IAM framework
type: user-story
feature: feature-07-01
epic: epic-07
status: ready
priority: must-have
source: FR-027
dependencies: []
tasks: []
---

# Story 07-01-01: Authenticate via IAM framework

## User Story
As a User,
I can log in to the application using the organization's IAM framework (OAuth2 or SAML),
so that I can access the system using my corporate credentials without a separate password.

## Business Context
IAM integration is the core behaviour for FR-027 providing centralized authentication leveraging the organization's existing identity infrastructure and SSO capabilities.

## Acceptance Criteria
- [ ] Given I navigate to the application, when I am not authenticated, then I am redirected to the IAM login page
- [ ] Given I enter valid IAM credentials, when I submit, then I am authenticated and redirected to the application dashboard
- [ ] Given I enter invalid IAM credentials, when I submit, then I see an error message and remain on the login page
- [ ] Given I am authenticated, when my session expires, then I am redirected to the IAM login page to reauthenticate

## Definition of Done
- All acceptance criteria above are verified and passing
- All tasks under this story are complete
- Behaviour is demonstrable in the running application
- No known defects for this story

## Technical Notes
- API: POST /api/auth/login (initiates OAuth2/SAML flow)
- Middleware: IAM token validation on all protected routes (per copilot-instructions.md)
- Session: Store IAM token in httpOnly cookie or session storage
- Component: LoginRedirect (handles IAM callback)
- Business rule: OAuth2/SAML integration per FR-027
