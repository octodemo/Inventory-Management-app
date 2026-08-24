---
id: story-05-01-01
title: Multi-select items using checkboxes
type: user-story
feature: feature-05-01
epic: epic-05
status: ready
priority: must-have
source: FR-011
dependencies: []
tasks: []
---

# Story 05-01-01: Multi-select items using checkboxes

## User Story
As a User,
I can select multiple items using checkboxes in the filter panel,
so that I can generate reports showing usage for multiple items simultaneously.

## Business Context
Multi-item checkbox selection is the core behaviour for FR-011 enabling users to analyze several items in a single report without running multiple queries.

## Acceptance Criteria
- [ ] Given I view the item filter panel, when I see the item list, then each item has a checkbox for selection
- [ ] Given I select multiple items, when I click checkboxes, then all selected items are highlighted
- [ ] Given I have selected items, when I apply the filter, then the report includes usage data for all selected items
- [ ] Given I select all items, when I uncheck "Select All", then all individual item checkboxes are cleared

## Definition of Done
- All acceptance criteria above are verified and passing
- All tasks under this story are complete
- Behaviour is demonstrable in the running application
- No known defects for this story

## Technical Notes
- Component: ItemMultiSelectFilter (data-testid: item-multi-select-filter)
- UI: Checkbox per item, "Select All" checkbox at top
- State: Maintain selected item IDs array
- Business rule: Multi-selection enables multi-item analysis per FR-011
