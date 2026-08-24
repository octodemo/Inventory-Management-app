---
id: story-07-02-02
title: Hide UI controls based on user role
type: user-story
feature: feature-07-02
epic: epic-07
status: ready
priority: must-have
source: FR-024, FR-025
dependencies: []
tasks: []
---

# Story 07-02-02: Hide UI controls based on user role

## User Story
As a User,
I see only the UI controls and menu items that are available for my role,
so that I am not presented with options I cannot use.

## Business Context
UI-level access control enhances FR-024 and FR-025 by providing a clean user experience hiding unavailable actions and reducing confusion or support requests.

## Acceptance Criteria
- [ ] Given I am a User (not Admin), when I view entity lists, then "Create", "Edit", and "Delete" buttons are hidden
- [ ] Given I am an Admin, when I view entity lists, then "Create", "Edit", and "Delete" buttons are visible
- [ ] Given I am a User, when I view the navigation menu, then Admin-only menu items (e.g., "Bulk Upload") are not displayed
- [ ] Given I am an Admin, when I view the navigation menu, then all menu items including Admin-only options are displayed

## Definition of Done
- All acceptance criteria above are verified and passing
- All tasks under this story are complete
- Behaviour is demonstrable in the running application
- No known defects for this story

## Technical Notes
- Component: RoleAwareButton (data-testid: role-aware-button), RoleAwareMenuItem (data-testid: role-aware-menu-item)
- Implementation: Conditional rendering based on user role from auth context
- Auth context: UserRole available via React Context or global state
- Business rule: Hide unavailable controls per FR-024, FR-025
