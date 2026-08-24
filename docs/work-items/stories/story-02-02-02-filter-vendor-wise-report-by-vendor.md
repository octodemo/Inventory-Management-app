---
id: story-02-02-02
title: Filter vendor-wise report by vendor
type: user-story
feature: feature-02-02
epic: epic-02
status: ready
priority: should-have
source: FR-015
dependencies: []
tasks: [05-DATABASE-regional-office-model, 26-BACKEND-vendor-filter-api, 86-UNIT-TEST-vendor-filter-api, 146-FRONTEND-vendor-wise-report-filters, 206-E2E-TEST-vendor-wise-report]
---

# Story 02-02-02: Filter vendor-wise report by vendor

## User Story
As a User,
I can filter the vendor-wise report to show data for specific selected vendors,
so that I can perform targeted analysis of individual supplier performance.

## Business Context
Vendor filtering enhances FR-015 by enabling focused analysis on specific suppliers without viewing all vendor data.

## Acceptance Criteria
- [ ] Given I am generating a vendor-wise report, when I select specific vendors from a dropdown, then only those vendors appear in the report
- [ ] Given I filter by multiple vendors, when I view the report, then all selected vendors are displayed with their usage data
- [ ] Given I have applied a vendor filter, when I clear the filter, then all vendors are shown again
- [ ] Given I filter by vendor, when I export the report, then the exported data includes only the filtered vendors

## Definition of Done
- All acceptance criteria above are verified and passing
- All tasks under this story are complete
- Behaviour is demonstrable in the running application
- No known defects for this story

## Technical Notes
- API: POST /api/reports/vendor-wise (accepts vendorIds array parameter)
- Component: VendorFilterDropdown (data-testid: vendor-filter)
- Filter persists during export operations
- Business rule: Vendor selection supports targeted supplier analysis (FR-015)
