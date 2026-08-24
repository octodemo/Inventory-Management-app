---
id: story-04-03-01
title: Filter usage data by regional office
type: user-story
feature: feature-04-03
epic: epic-04
status: ready
priority: must-have
source: FR-022
dependencies: []
tasks: []
---

# Story 04-03-01: Filter usage data by regional office

## User Story
As a User,
I can filter usage data to display consumption aggregated by regional office including all associated branches,
so that I can analyze stationery usage at the regional level.

## Business Context
Regional office filtering is the core behaviour for FR-022 enabling managers to view aggregate consumption across all branches within their regional office.

## Acceptance Criteria
- [ ] Given I select a regional office, when I view usage data, then all usage records from branches under that office are displayed
- [ ] Given I filter by regional office, when I view results, then item-wise consumption totals include all branches in that office
- [ ] Given I apply a regional office filter, when I add a date range, then both filters work together
- [ ] Given I filter by regional office, when I view branch breakdown, then I see consumption per branch within that regional office

## Definition of Done
- All acceptance criteria above are verified and passing
- All tasks under this story are complete
- Behaviour is demonstrable in the running application
- No known defects for this story

## Technical Notes
- API: POST /api/reports/regional-office-wise (aggregates all branches under selected regional office)
- Component: RegionalOfficeFilterDropdown (data-testid: regional-office-filter)
- Aggregation: Automatic inclusion of all Branch records where regionalOfficeId matches
- Business rule: Regional-office-level tracking per FR-022
