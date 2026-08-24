---
id: story-04-03-02
title: View regional office usage summary
type: user-story
feature: feature-04-03
epic: epic-04
status: ready
priority: should-have
source: FR-022
dependencies: []
tasks: [41-BACKEND-regional-office-usage-summary-api, 101-UNIT-TEST-regional-office-usage-summary-api, 161-FRONTEND-regional-office-usage-summary, 221-E2E-TEST-regional-office-summary]
---

# Story 04-03-02: View regional office usage summary

## User Story
As a User,
I can view a summary of consumption for a regional office with branch-level breakdown,
so that I can understand regional usage patterns and identify high-usage branches.

## Business Context
Regional office summary enhances FR-022 by providing aggregated and disaggregated views supporting regional planning and resource allocation decisions.

## Acceptance Criteria
- [ ] Given I select a regional office, when I view the summary, then I see total consumption across all branches
- [ ] Given I view a regional office summary, when I see item totals, then I can view which branches contributed to each item's consumption
- [ ] Given I view a regional office summary, when I apply a date range, then totals are calculated for that period
- [ ] Given I view the summary, when I drill down to a specific branch, then I navigate to that branch's detailed usage data

## Definition of Done
- All acceptance criteria above are verified and passing
- All tasks under this story are complete
- Behaviour is demonstrable in the running application
- No known defects for this story

## Technical Notes
- API: POST /api/reports/regional-office-wise (includes branch breakdown in response)
- Component: RegionalOfficeUsageSummary (data-testid: regional-office-usage-summary)
- Display: Aggregate totals plus branch-level breakdown per item
- Business rule: Regional-level aggregation with drill-down per FR-022
