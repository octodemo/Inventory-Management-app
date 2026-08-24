---
id: story-06-01-03
title: Download template file for bulk upload
type: user-story
feature: feature-06-01
epic: epic-06
status: ready
priority: should-have
source: FR-016
dependencies: []
tasks: [57-BACKEND-upload-template-api, 117-UNIT-TEST-upload-template-api, 177-FRONTEND-upload-template-download, 237-E2E-TEST-template-download]
---

# Story 06-01-03: Download template file for bulk upload

## User Story
As an Admin,
I can download a CSV or Excel template with correct column headers for each entity type,
so that I can prepare my bulk upload data in the expected format.

## Business Context
Template download supports FR-016 by reducing user errors and providing clear guidance on required schema ensuring successful bulk imports.

## Acceptance Criteria
- [ ] Given I am on the bulk upload page, when I select an entity type (e.g., Inventory Item), then I can download a template file
- [ ] Given I download a template, when I open it, then column headers match the required schema for that entity
- [ ] Given the template includes example rows, when I view them, then I see sample data illustrating the correct format
- [ ] Given I download a template as CSV, when I select Excel format, then I receive an XLSX file with the same schema

## Definition of Done
- All acceptance criteria above are verified and passing
- All tasks under this story are complete
- Behaviour is demonstrable in the running application
- No known defects for this story

## Technical Notes
- API: GET /api/bulk-upload/template?entityType=InventoryItem&format=csv
- Component: TemplateDownloadButton (data-testid: template-download-button)
- Templates: Pre-generated CSV/XLSX files with headers + sample row
- Entity types: InventoryItem, Branch, RegionalOffice, Vendor, UsageRecord
- Business rule: Template provision per FR-016
