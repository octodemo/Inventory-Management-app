---
id: story-06-01-02
title: Preview upload data before committing
type: user-story
feature: feature-06-01
epic: epic-06
status: ready
priority: must-have
source: FR-016
dependencies: []
tasks: []
---

# Story 06-01-02: Preview upload data before committing

## User Story
As an Admin,
I can preview the parsed contents of my uploaded file before committing the import,
so that I can verify data accuracy and cancel if errors are detected.

## Business Context
Upload preview is essential for FR-016 providing a safety gate preventing accidental import of incorrect data ensuring data quality before persistence.

## Acceptance Criteria
- [ ] Given I upload a file, when parsing completes, then I see a preview table showing the first 10-20 rows
- [ ] Given I view the preview, when I see the data, then column headers match the expected entity schema
- [ ] Given the preview shows validation errors, when I see error indicators, then each error row is highlighted with an error message
- [ ] Given I view the preview, when I click "Confirm Import", then valid records are imported and invalid rows are rejected

## Definition of Done
- All acceptance criteria above are verified and passing
- All tasks under this story are complete
- Behaviour is demonstrable in the running application
- No known defects for this story

## Technical Notes
- Component: BulkUploadPreview (data-testid: bulk-upload-preview)
- API: POST /api/bulk-upload/preview (parses file, returns preview + validation results)
- Display: Table with rows, validation error indicators per row
- Actions: "Confirm Import" button (commits valid rows), "Cancel" button (discards upload)
- Business rule: Preview-and-confirm workflow per FR-016
