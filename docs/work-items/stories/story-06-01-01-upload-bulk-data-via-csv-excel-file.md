---
id: story-06-01-01
title: Upload bulk data via CSV/Excel file
type: user-story
feature: feature-06-01
epic: epic-06
status: ready
priority: must-have
source: FR-016
dependencies: []
tasks: [55-BACKEND-bulk-upload-api, 115-UNIT-TEST-bulk-upload-api, 175-FRONTEND-bulk-upload-form, 235-E2E-TEST-bulk-upload]
---

# Story 06-01-01: Upload bulk data via CSV/Excel file

## User Story
As an Admin,
I can upload a CSV or Excel file to bulk-import inventory items, branches, or usage records,
so that I can efficiently populate the system with large datasets without manual entry.

## Business Context
Bulk upload is the core behaviour for FR-016 enabling rapid data import for the 1,500-branch network and extensive item catalog reducing administrative overhead.

## Acceptance Criteria
- [ ] Given I am on the bulk upload page, when I select a CSV or Excel file, then I can upload it to the system
- [ ] Given I upload a file, when it contains valid data, then all records are imported successfully
- [ ] Given I upload a file, when it contains invalid data, then I see validation errors indicating which rows failed and why
- [ ] Given I upload a file successfully, when I view the imported entity list, then all newly imported records appear

## Definition of Done
- All acceptance criteria above are verified and passing
- All tasks under this story are complete
- Behaviour is demonstrable in the running application
- No known defects for this story

## Technical Notes
- API: POST /api/bulk-upload (accepts multipart/form-data with CSV or XLSX file)
- Validation: Schema validation per entity type; duplicate detection
- Component: BulkUploadForm (data-testid: bulk-upload-form)
- Supported entities: InventoryItem, Branch, RegionalOffice, Vendor, UsageRecord
- Business rule: Bulk import with validation per FR-016
