---
id: story-02-02-03
title: Drill down from vendor to item details
type: user-story
feature: feature-02-02
epic: epic-02
status: ready
priority: should-have
source: FR-015
dependencies: []
tasks: [27-BACKEND-vendor-drill-down-api, 87-UNIT-TEST-vendor-drill-down-api, 147-FRONTEND-vendor-wise-drill-down, 207-E2E-TEST-vendor-drill-down]
---

# Story 02-02-03: Drill down from vendor to item details

## User Story
As a User,
I can click on an item in the vendor-wise report to view detailed usage records,
so that I can investigate specific consumption patterns for vendor-supplied items.

## Business Context
Drill-down capability enhances FR-015 by connecting summary vendor data to detailed transactional usage records for deeper analysis.

## Acceptance Criteria
- [ ] Given I view a vendor-wise report, when I click on an item, then I navigate to detailed usage records for that item
- [ ] Given I drill down to item details, when I view usage records, then I see date, branch, quantity, and notes for each record
- [ ] Given I am viewing item detail from vendor drill-down, when I return to the vendor report, then my previous filter selections are preserved
- [ ] Given I drill down on an item, when the item has usage across multiple branches, then all branch usage records are displayed

## Definition of Done
- All acceptance criteria above are verified and passing
- All tasks under this story are complete
- Behaviour is demonstrable in the running application
- No known defects for this story

## Technical Notes
- Navigation: VendorWiseReport → ItemUsageDetail view
- Component: ItemUsageDetailView (data-testid: item-usage-detail)
- Filter preservation via route state or session storage
- Business rule: Drill-down supports detailed investigation of vendor item usage (FR-015)
