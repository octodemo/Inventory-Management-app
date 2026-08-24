---
id: story-05-03-03
title: Compare hierarchy nodes across time periods
type: user-story
feature: feature-05-03
epic: epic-05
status: ready
priority: should-have
source: FR-023
dependencies: []
tasks: [50-BACKEND-hierarchy-time-comparison-api, 110-UNIT-TEST-hierarchy-time-comparison-api, 170-FRONTEND-hierarchy-time-comparison, 230-E2E-TEST-time-comparison]
---

# Story 05-03-03: Compare hierarchy nodes across time periods

## User Story
As a User,
I can select multiple date ranges to compare hierarchy node usage over time,
so that I can identify consumption trends and seasonal patterns at the category level.

## Business Context
Time-based comparison enhances FR-023 by enabling trend analysis across hierarchy categories supporting forecasting and budget planning.

## Acceptance Criteria
- [ ] Given I generate a hierarchy-based report, when I select two date ranges, then the report displays side-by-side consumption totals for each period
- [ ] Given I view time-based comparison, when I expand a hierarchy node, then I see consumption for both periods at every level
- [ ] Given I compare time periods, when I view totals, then I see percentage change indicators showing increase or decrease
- [ ] Given I compare periods, when I drill down, then detailed usage records respect the selected date range

## Definition of Done
- All acceptance criteria above are verified and passing
- All tasks under this story are complete
- Behaviour is demonstrable in the running application
- No known defects for this story

## Technical Notes
- API: POST /api/reports/hierarchy-based (accepts multiple date range pairs)
- Component: HierarchyComparisonReport (data-testid: hierarchy-comparison)
- Display: Two columns per node showing period 1 and period 2 totals plus delta
- Calculation: Percentage change = ((period2 - period1) / period1) * 100
- Business rule: Time-based comparison supports trend analysis per FR-023
