---
id: story-02-01-01
title: Create vendor record
type: user-story
feature: feature-02-01
epic: epic-02
status: ready
priority: must-have
source: FR-002
dependencies: []
tasks: []
---

# Story 02-01-01: Create vendor record

## User Story
As an Admin,
I can create a new vendor record with complete contact information,
so that I can maintain supplier details for inventory management and vendor analysis.

## Business Context
Vendor creation is the core behaviour for FR-002 enabling supplier relationship management. Each vendor receives a unique identifier and forms the foundation for vendor-to-item relationships.

## Acceptance Criteria
- [ ] Given I am on the vendor creation page, when I provide vendor name and contact details, then a new vendor is created with a unique identifier
- [ ] Given I create a vendor, when I provide an email address, then the system validates proper email format before submission
- [ ] Given I create a vendor, when I provide incomplete required fields, then I see validation errors indicating missing information
- [ ] Given I create a vendor successfully, when I view the vendor list, then the new vendor appears with name, contact email, and contact phone

## Definition of Done
- All acceptance criteria above are verified and passing
- All tasks under this story are complete
- Behaviour is demonstrable in the running application
- No known defects for this story

## Technical Notes
- API: POST /api/vendors (creates Vendor with name, contactName, contactEmail, contactPhone, address)
- Validation: Email format validation; unique identifier auto-generated
- Component: VendorForm (data-testid: vendor-form)
- Business rule: Each vendor must have unique identifier (FR-002)
