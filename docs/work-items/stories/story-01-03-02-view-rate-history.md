---
id: story-01-03-02
title: View rate history
type: user-story
feature: feature-01-03
epic: epic-01
status: ready
priority: must-have
source: FR-005
dependencies: []
tasks: [19-BACKEND-rate-history-api, 79-UNIT-TEST-rate-history-api, 139-FRONTEND-rate-history-view, 199-E2E-TEST-rate-history-view]
---

# Story 01-03-02: View rate history

## User Story
As a User,
I can view the complete rate history for an inventory item in chronological order,
so that I can see all historical pricing periods for audit and analysis purposes.

## Business Context
Rate history viewing is essential for FR-005 to support reporting and cost analysis across different time periods. All rate changes must be preserved and accessible.

## Acceptance Criteria
- [ ] Given an item has multiple rates, when I view the rate history, then all rates are displayed in chronological order
- [ ] Given I view rate history, when I see each rate, then effectiveFrom, effectiveTo, and rate value are displayed
- [ ] Given an item has no rate history, when I view rate history, then I see a message indicating no rates defined
- [ ] Given I am on the item detail page, when I access rate history, then I can navigate to the full rate history view

## Definition of Done
- All acceptance criteria above are verified and passing
- All tasks under this story are complete
- Behaviour is demonstrable in the running application
- No known defects for this story

## Technical Notes
- API: GET /api/rates?itemId={id} (returns all ItemRate records for the item)
- Component: ItemRateHistory (data-testid: rate-history-table)
- Display: Sorted by effectiveFrom descending (most recent first)
- Business rule: Rate history preservation required for reporting per FR-005
