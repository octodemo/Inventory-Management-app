---
id: story-04-02-02
title: View branch usage summary
type: user-story
feature: feature-04-02
epic: epic-04
status: ready
priority: should-have
source: FR-021
dependencies: []
tasks: [39-BACKEND-branch-usage-summary-api, 99-UNIT-TEST-branch-usage-summary-api, 159-FRONTEND-branch-usage-summary, 219-E2E-TEST-branch-usage-summary]
---

# Story 04-02-02: View branch usage summary

## User Story
As a User,
I can view a summary of all items consumed by a selected branch with totals and trends,
so that I can understand branch-level consumption patterns at a glance.

## Business Context
Branch usage summary enhances FR-021 by providing aggregated view of branch consumption supporting operational insights and cost tracking.

## Acceptance Criteria
- [ ] Given I select a branch, when I view the summary, then I see all items consumed with quantity totals
- [ ] Given I view a branch summary, when I apply a date range, then consumption is calculated for that period
- [ ] Given I view a branch summary, when I see consumption trends, then I can compare current period to previous period
- [ ] Given I view a branch summary, when I click on an item, then I drill down to detailed usage records for that item at that branch

## Definition of Done
- All acceptance criteria above are verified and passing
- All tasks under this story are complete
- Behaviour is demonstrable in the running application
- No known defects for this story

## Technical Notes
- API: POST /api/reports/branch-wise (with single branchId and date range)
- Component: BranchUsageSummary (data-testid: branch-usage-summary)
- Display: Item-wise totals, date range filtering, trend comparison
- Business rule: Branch-level analysis per FR-021
