---
id: story-05-01-03
title: Multi-select vendors using checkboxes
type: user-story
feature: feature-05-01
epic: epic-05
status: ready
priority: should-have
source: FR-013
dependencies: []
tasks: []
---

# Story 05-01-03: Multi-select vendors using checkboxes

## User Story
As a User,
I can select multiple vendors using checkboxes in the filter panel,
so that I can generate comparative vendor analysis reports.

## Business Context
Multi-vendor checkbox selection is the core behaviour for FR-013 enabling users to compare performance or usage across a targeted set of suppliers.

## Acceptance Criteria
- [ ] Given I view the vendor filter panel, when I see the vendor list, then each vendor has a checkbox for selection
- [ ] Given I select multiple vendors, when I click checkboxes, then all selected vendors are highlighted
- [ ] Given I have selected vendors, when I apply the filter, then the report includes data for all selected vendors
- [ ] Given I select vendors, when I clear the filter, then all vendor checkboxes are unchecked

## Definition of Done
- All acceptance criteria above are verified and passing
- All tasks under this story are complete
- Behaviour is demonstrable in the running application
- No known defects for this story

## Technical Notes
- Component: VendorMultiSelectFilter (data-testid: vendor-multi-select-filter)
- UI: Checkbox per vendor, "Select All" checkbox
- State: Maintain selected vendor IDs array
- Business rule: Multi-selection enables multi-vendor comparative analysis per FR-013
