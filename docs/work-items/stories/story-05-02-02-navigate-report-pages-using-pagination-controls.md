---
id: story-05-02-02
title: Navigate report pages using pagination controls
type: user-story
feature: feature-05-02
epic: epic-05
status: ready
priority: must-have
source: FR-014
dependencies: []
tasks: []
---

# Story 05-02-02: Navigate report pages using pagination controls

## User Story
As a User,
I can navigate large report datasets using pagination controls with page size selection,
so that I can efficiently browse through extensive usage data without performance degradation.

## Business Context
Pagination is essential for FR-014 given the scale of data from 1,500 branches ensuring performance and usability when viewing large result sets.

## Acceptance Criteria
- [ ] Given a report has more rows than fit on one page, when I view the report, then I see pagination controls at the bottom
- [ ] Given I see pagination controls, when I click "Next", then the next page of data loads
- [ ] Given I am on page 2 or later, when I click "Previous", then the previous page loads
- [ ] Given I see pagination controls, when I select a page size (e.g., 10, 25, 50, 100), then the report re-renders with the selected number of rows per page

## Definition of Done
- All acceptance criteria above are verified and passing
- All tasks under this story are complete
- Behaviour is demonstrable in the running application
- No known defects for this story

## Technical Notes
- Component: ReportPagination (data-testid: report-pagination)
- UI: Previous/Next buttons, page number display, page size dropdown
- State: Current page, page size, total count
- Business rule: Pagination enables efficient large dataset navigation per FR-014
