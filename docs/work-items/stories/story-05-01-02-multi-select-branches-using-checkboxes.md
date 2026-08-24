---
id: story-05-01-02
title: Multi-select branches using checkboxes
type: user-story
feature: feature-05-01
epic: epic-05
status: ready
priority: must-have
source: FR-012
dependencies: []
tasks: []
---

# Story 05-01-02: Multi-select branches using checkboxes

## User Story
As a User,
I can select multiple branches using checkboxes in the filter panel,
so that I can generate reports comparing usage across several branches.

## Business Context
Multi-branch checkbox selection is the core behaviour for FR-012 enabling users to analyze usage across a targeted set of branches without viewing all 1,500 branches.

## Acceptance Criteria
- [ ] Given I view the branch filter panel, when I see the branch list, then each branch has a checkbox for selection
- [ ] Given I select multiple branches, when I click checkboxes, then all selected branches are highlighted
- [ ] Given I have selected branches, when I apply the filter, then the report includes usage data for all selected branches
- [ ] Given the branch list has many entries, when I use pagination or search, then selected branch checkboxes remain checked

## Definition of Done
- All acceptance criteria above are verified and passing
- All tasks under this story are complete
- Behaviour is demonstrable in the running application
- No known defects for this story

## Technical Notes
- Component: BranchMultiSelectFilter (data-testid: branch-multi-select-filter)
- UI: Checkbox per branch, "Select All" checkbox, search box for filtering branches
- State: Maintain selected branch IDs array across pagination
- Business rule: Multi-selection enables multi-branch comparative analysis per FR-012
