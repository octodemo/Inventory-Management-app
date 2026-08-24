---
id: story-06-02-02
title: Download usage data as Excel
type: user-story
feature: feature-06-02
epic: epic-06
status: ready
priority: must-have
source: FR-017
dependencies: []
tasks: []
---

# Story 06-02-02: Download usage data as Excel

## User Story
As a User,
I can download usage report data as an Excel (XLSX) file,
so that I can leverage Excel's advanced features for data manipulation and visualization.

## Business Context
Excel download enhances FR-017 by providing a richer format supporting formatted cells, formulas, and charts preferred by many business users.

## Acceptance Criteria
- [ ] Given I view a usage report, when I click "Download as Excel", then an XLSX file downloads containing all report data
- [ ] Given I download an Excel file, when I open it, then column headers are bold and data is formatted appropriately (dates, numbers)
- [ ] Given I have applied filters to a report, when I download Excel, then only the filtered data is included
- [ ] Given the report has multiple pages, when I download Excel, then all pages are included in a single worksheet

## Definition of Done
- All acceptance criteria above are verified and passing
- All tasks under this story are complete
- Behaviour is demonstrable in the running application
- No known defects for this story

## Technical Notes
- API: POST /api/reports/export?format=xlsx (accepts same parameters as report generation)
- Component: DownloadExcelButton (data-testid: download-excel-button)
- Library: ExcelJS or similar for XLSX generation
- Formatting: Bold headers, date formatting, number formatting
- Business rule: Excel export with formatting per FR-017
