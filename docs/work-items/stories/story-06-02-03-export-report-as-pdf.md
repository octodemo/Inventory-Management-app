---
id: story-06-02-03
title: Export report as PDF
type: user-story
feature: feature-06-02
epic: epic-06
status: ready
priority: should-have
source: FR-018
dependencies: []
tasks: [60-BACKEND-pdf-export-api, 120-UNIT-TEST-pdf-export-api, 180-FRONTEND-pdf-export-button, 240-E2E-TEST-pdf-export]
---

# Story 06-02-03: Export report as PDF

## User Story
As a User,
I can export usage reports as PDF files,
so that I can share read-only formatted reports for presentations or archival purposes.

## Business Context
PDF export is the core behaviour for FR-018 enabling distribution of immutable, formatted reports suitable for executive review and compliance documentation.

## Acceptance Criteria
- [ ] Given I view a usage report, when I click "Export as PDF", then a PDF file downloads containing the formatted report
- [ ] Given I download a PDF, when I open it, then the report is properly formatted with headers, tables, and pagination
- [ ] Given I export a PDF, when I see the document, then branding elements (logo, company name) are included in the header/footer
- [ ] Given I have applied filters to a report, when I export PDF, then filter selections are displayed at the top of the document

## Definition of Done
- All acceptance criteria above are verified and passing
- All tasks under this story are complete
- Behaviour is demonstrable in the running application
- No known defects for this story

## Technical Notes
- API: POST /api/reports/export?format=pdf (accepts same parameters as report generation)
- Component: ExportPDFButton (data-testid: export-pdf-button)
- Library: PDFKit or similar for PDF generation
- Layout: Header with logo/company name, table with proper pagination, footer with page numbers
- Business rule: PDF export for immutable reports per FR-018
