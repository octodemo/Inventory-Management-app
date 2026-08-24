---
id: story-02-01-02
title: View and search vendors
type: user-story
feature: feature-02-01
epic: epic-02
status: ready
priority: must-have
source: FR-002
dependencies: []
tasks: []
---

# Story 02-01-02: View and search vendors

## User Story
As a User,
I can view a paginated list of all vendors with search capability,
so that I can quickly find and access vendor information.

## Business Context
Vendor list viewing and search supports FR-002 by enabling efficient navigation of supplier data across the organization.

## Acceptance Criteria
- [ ] Given vendors exist, when I view the vendor list page, then I see vendors displayed in a paginated table
- [ ] Given the vendor list is displayed, when I search by vendor name, then only matching vendors are shown
- [ ] Given I view the vendor list, when I click on a vendor, then I see the detailed vendor information including all contact details
- [ ] Given the vendor list has multiple pages, when I navigate between pages, then search filters persist

## Definition of Done
- All acceptance criteria above are verified and passing
- All tasks under this story are complete
- Behaviour is demonstrable in the running application
- No known defects for this story

## Technical Notes
- API: GET /api/vendors (supports pagination and search query params)
- Component: VendorList (data-testid: vendor-list), VendorSearchInput (data-testid: vendor-search)
- Display: Vendor name, contact email, contact phone in table
- Business rule: Search capability required for efficient vendor lookup (FR-002)
