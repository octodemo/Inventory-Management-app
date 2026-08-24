---
id: story-07-03-02
title: Highlight active menu item
type: user-story
feature: feature-07-03
epic: epic-07
status: ready
priority: should-have
source: FR-020
dependencies: []
tasks: []
---

# Story 07-03-02: Highlight active menu item

## User Story
As a User,
I see the currently active menu item highlighted in the navigation menu,
so that I always know which section of the application I am viewing.

## Business Context
Active menu highlighting enhances FR-020 by improving user orientation supporting efficient navigation across the multi-section application.

## Acceptance Criteria
- [ ] Given I navigate to a page, when I view the menu, then the corresponding menu item is highlighted
- [ ] Given I click a menu item, when the page loads, then that menu item is highlighted and the previous item is unhighlighted
- [ ] Given I navigate using browser back/forward, when the page changes, then the active menu item updates to match
- [ ] Given the active item is in a submenu, when I view the menu, then the parent menu item is also highlighted or expanded

## Definition of Done
- All acceptance criteria above are verified and passing
- All tasks under this story are complete
- Behaviour is demonstrable in the running application
- No known defects for this story

## Technical Notes
- Component: ActiveMenuItem (data-testid: active-menu-item)
- Styling: Active item has distinct background color or border
- Route matching: Compare current route path to menu item href
- State: Sync active item with browser route changes
- Business rule: Visual navigation feedback per FR-020
