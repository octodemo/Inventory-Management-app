---
id: story-06-02-01
title: Download usage data as CSV
type: user-story
feature: feature-06-02
epic: epic-06
status: ready
priority: must-have
source: FR-017
dependencies: []
tasks: []
---

# Story 06-02-01: Download usage data as CSV

## User Story
As a User,
I can download usage report data as a CSV file,
so that I can perform offline analysis using spreadsheet tools like Excel.

## Business Context
CSV download is the core behaviour for FR-017 enabling users to export data for integration with external tools, offline analysis, or regulatory compliance record-keeping.

## Acceptance Criteria
- [ ] Given I view a usage report, when I click "Download as CSV", then a CSV file downloads containing all report data
- [ ] Given I download a CSV, when I open it, then column headers are present and data is properly formatted
- [ ] Given I have applied filters to a report, when I download CSV, then only the filtered data is included in the export
- [ ] Given the report has multiple pages, when I download CSV, then all pages are included in the export (not just the current page)

## Definition of Done
- All acceptance criteria above are verified and passing
- All tasks under this story are complete
- Behaviour is demonstrable in the running application
- No known defects for this story

## Technical Notes
- API: POST /api/reports/export?format=csv (accepts same parameters as report generation)
- Component: DownloadCSVButton (data-testid: download-csv-button)
- Response: CSV file with appropriate Content-Disposition header
- Business rule: CSV export of report data per FR-017
