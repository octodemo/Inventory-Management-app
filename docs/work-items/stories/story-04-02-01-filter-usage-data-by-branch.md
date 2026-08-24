---
id: story-04-02-01
title: Filter usage data by branch
type: user-story
feature: feature-04-02
epic: epic-04
status: ready
priority: must-have
source: FR-021
dependencies: []
tasks: []
---

# Story 04-02-01: Filter usage data by branch

## User Story
As a User,
I can filter usage data to display consumption for a specific individual branch,
so that I can analyze stationery usage patterns at the branch level.

## Business Context
Branch-level filtering is the core behaviour for FR-021 enabling targeted analysis of consumption for any of the 1,500 branches across the organization.

## Acceptance Criteria
- [ ] Given I am viewing usage data, when I select a specific branch from the filter, then only usage records for that branch are displayed
- [ ] Given I filter by branch, when I view the results, then item-wise consumption totals are calculated for that branch
- [ ] Given I have applied a branch filter, when I add a date range filter, then both filters are applied together
- [ ] Given I filter by branch, when I clear the filter, then usage data for all branches is shown again

## Definition of Done
- All acceptance criteria above are verified and passing
- All tasks under this story are complete
- Behaviour is demonstrable in the running application
- No known defects for this story

## Technical Notes
- API: GET /api/usage?branchId={id} or POST /api/reports/branch-wise
- Component: BranchFilterDropdown (data-testid: branch-filter)
- Calculation: Item-wise totals per selected branch
- Business rule: Branch-level usage tracking per FR-021
