---
id: story-05-04-04
title: Display trend visualization in dashboard widget
type: user-story
feature: feature-05-04
epic: epic-05
status: ready
priority: should-have
source: FR-019
dependencies: []
tasks: [54-BACKEND-dashboard-trend-visualization-api, 114-UNIT-TEST-dashboard-trend-visualization-api, 174-FRONTEND-dashboard-trend-chart, 234-E2E-TEST-trend-chart]
---

# Story 05-04-04: Display trend visualization in dashboard widget

## User Story
As a User,
I can view a trend chart widget showing consumption over time,
so that I can quickly identify usage patterns, spikes, or declines in stationery consumption.

## Business Context
Trend visualization enhances FR-019 by providing graphical representation of consumption patterns enabling faster insight recognition than tabular data alone.

## Acceptance Criteria
- [ ] Given I view the dashboard, when I see the trend widget, then consumption data is displayed as a line or bar chart
- [ ] Given I view the trend chart, when I hover over data points, then I see tooltips with exact quantities and dates
- [ ] Given the dashboard date range changes, when the trend widget updates, then the chart reflects the new time period
- [ ] Given the chart displays weekly or monthly aggregates, when I click a data point, then I drill down to daily usage details

## Definition of Done
- All acceptance criteria above are verified and passing
- All tasks under this story are complete
- Behaviour is demonstrable in the running application
- No known defects for this story

## Technical Notes
- Component: TrendChartWidget (data-testid: trend-chart-widget)
- Charting library: Chart.js or Recharts (per workshop-stack.md frontend dependencies)
- API: GET /api/dashboard/trends?startDate=X&endDate=Y (returns time-series data)
- Display: Line chart for trends; bar chart for period comparisons
- Business rule: Graphical trend analysis per FR-019
