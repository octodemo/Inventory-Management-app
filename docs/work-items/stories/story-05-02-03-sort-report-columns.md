---
id: story-05-02-03
title: Sort report columns
type: user-story
feature: feature-05-02
epic: epic-05
status: ready
priority: should-have
source: FR-014
dependencies: []
tasks: [47-BACKEND-report-column-sorting-api, 107-UNIT-TEST-report-column-sorting-api, 167-FRONTEND-report-column-sorting, 227-E2E-TEST-report-sorting]
---

# Story 05-02-03: Sort report columns

## User Story
As a User,
I can click on column headers to sort report data in ascending or descending order,
so that I can organize usage information to meet my analysis needs.

## Business Context
Column sorting enhances FR-014 by enabling users to organize tabular data dynamically without re-running reports or applying new filters.

## Acceptance Criteria
- [ ] Given I view a tabular report, when I click a column header, then the report sorts by that column in ascending order
- [ ] Given a column is sorted ascending, when I click the header again, then it sorts descending
- [ ] Given I sort by one column, when I click a different column header, then the report re-sorts by the new column
- [ ] Given I sort a report, when I navigate to the next page, then the sort order is preserved

## Definition of Done
- All acceptance criteria above are verified and passing
- All tasks under this story are complete
- Behaviour is demonstrable in the running application
- No known defects for this story

## Technical Notes
- Component: SortableTableHeader (data-testid: sortable-header)
- UI: Sort indicator icons (up/down arrows) on headers
- State: Current sort column, sort direction (asc/desc)
- Business rule: Column sorting enables flexible data organization per FR-014
