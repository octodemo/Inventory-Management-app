---
id: story-02-02-01
title: Generate vendor-wise usage report
type: user-story
feature: feature-02-02
epic: epic-02
status: ready
priority: must-have
source: FR-015
dependencies: []
tasks: []
---

# Story 02-02-01: Generate vendor-wise usage report

## User Story
As a User,
I can generate a report showing inventory usage grouped by vendor across all branches,
so that I can analyze which suppliers contribute to our stationery consumption.

## Business Context
Vendor-wise analysis is the core behaviour for FR-015 enabling procurement decisions and supplier evaluation by showing vendor contribution to overall consumption.

## Acceptance Criteria
- [ ] Given I generate a vendor-wise report, when I select a date range, then I see usage grouped by vendor for that period
- [ ] Given the report is displayed, when I view each vendor, then I see vendor name, items supplied, and total consumption quantities
- [ ] Given a vendor has items used across multiple branches, when I view the report, then I see branch-level breakdown of consumption
- [ ] Given the report has many vendors, when I navigate, then pagination controls allow efficient browsing

## Definition of Done
- All acceptance criteria above are verified and passing
- All tasks under this story are complete
- Behaviour is demonstrable in the running application
- No known defects for this story

## Technical Notes
- API: POST /api/reports/vendor-wise (date range, optional vendor filter)
- Response includes vendor name, items, quantities, branch-level breakdown
- Component: VendorWiseReport (data-testid: vendor-wise-report)
- Business rule: Report aggregates usage by vendor across all branches (FR-015)
