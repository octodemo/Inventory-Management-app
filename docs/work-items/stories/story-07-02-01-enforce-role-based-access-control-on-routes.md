---
id: story-07-02-01
title: Enforce role-based access control on routes
type: user-story
feature: feature-07-02
epic: epic-07
status: ready
priority: must-have
source: FR-024, FR-025
dependencies: []
tasks: [64-BACKEND-rbac-route-protection-api, 124-UNIT-TEST-rbac-route-protection-api, 184-FRONTEND-rbac-route-guards, 244-E2E-TEST-rbac-route-guards]
---

# Story 07-02-01: Enforce role-based access control on routes

## User Story
As the System,
I enforce role-based access control on protected routes based on the user's assigned role (Admin or User),
so that users can only access features they are authorized to use.

## Business Context
RBAC enforcement is the core behaviour for FR-024 and FR-025 ensuring Admin-only operations (create, edit, delete) are restricted while read operations are available to all authenticated users.

## Acceptance Criteria
- [ ] Given I am a User (not Admin), when I attempt to access an Admin-only route, then I receive a 403 Forbidden response
- [ ] Given I am an Admin, when I access any route, then I have full access to create, edit, and delete operations
- [ ] Given I am authenticated as a User, when I access read-only routes, then I can view data successfully
- [ ] Given my role changes, when I refresh the application, then my access permissions are updated immediately

## Definition of Done
- All acceptance criteria above are verified and passing
- All tasks under this story are complete
- Behaviour is demonstrable in the running application
- No known defects for this story

## Technical Notes
- Middleware: Role validation middleware on all /api/* routes (per copilot-instructions.md)
- Roles: Admin (full access), User (read-only for most entities)
- Authorization: Extract role from IAM token claims, enforce on API layer
- Error response: 403 Forbidden with message "Insufficient permissions"
- Business rule: Admin-only create/edit/delete per FR-024, FR-025
