---
id: story-05-02-01
title: Display reports in tabular format
type: user-story
feature: feature-05-02
epic: epic-05
status: ready
priority: must-have
source: FR-014
dependencies: []
tasks: []
---

# Story 05-02-01: Display reports in tabular format

## User Story
As a User,
I can view usage reports in a clear tabular layout with columns for relevant data fields,
so that I can read and interpret consumption data efficiently.

## Business Context
Tabular report display is the core behaviour for FR-014 providing a structured, scannable format for presenting usage data to users across all reporting scenarios.

## Acceptance Criteria
- [ ] Given I generate a usage report, when the report loads, then data is displayed in a table with columns for item, branch, quantity, date, and vendor
- [ ] Given I view a tabular report, when I see column headers, then they clearly label the data in each column
- [ ] Given the report has many rows, when I scroll, then column headers remain visible (sticky headers)
- [ ] Given I view a tabular report, when I see numeric data, then numbers are right-aligned and properly formatted

## Definition of Done
- All acceptance criteria above are verified and passing
- All tasks under this story are complete
- Behaviour is demonstrable in the running application
- No known defects for this story

## Technical Notes
- Component: ReportTable (data-testid: report-table)
- UI: Sticky header row, alternating row colors for readability
- Columns: Configurable based on report type (item, branch, vendor, quantity, date)
- Business rule: Tabular format per FR-014 for all reports
