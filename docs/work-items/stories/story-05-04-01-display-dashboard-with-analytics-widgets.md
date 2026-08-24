---
id: story-05-04-01
title: Display dashboard with analytics widgets
type: user-story
feature: feature-05-04
epic: epic-05
status: ready
priority: must-have
source: FR-019
dependencies: []
tasks: []
---

# Story 05-04-01: Display dashboard with analytics widgets

## User Story
As a User,
I can view a dashboard with multiple analytics widgets showing key usage metrics,
so that I can get an at-a-glance understanding of stationery consumption across the organization.

## Business Context
Dashboard display is the core behaviour for FR-019 providing executives and managers a consolidated view of critical consumption metrics and trends.

## Acceptance Criteria
- [ ] Given I access the dashboard, when it loads, then I see multiple widgets displaying different usage metrics
- [ ] Given I view the dashboard, when I see widgets, then each displays a clear title and current period data
- [ ] Given dashboard widgets load, when data is being fetched, then I see loading indicators
- [ ] Given the dashboard has loaded, when I view widgets, then they are responsive and adjust to screen size

## Definition of Done
- All acceptance criteria above are verified and passing
- All tasks under this story are complete
- Behaviour is demonstrable in the running application
- No known defects for this story

## Technical Notes
- Component: Dashboard (data-testid: dashboard), DashboardWidget (data-testid: dashboard-widget)
- Widgets: Total consumption, top items, top branches, vendor contribution, trend chart
- API: GET /api/dashboard/metrics (returns aggregated metrics for current period)
- UI: Grid layout with 2-3 widgets per row
- Business rule: Dashboard provides executive summary per FR-019
