---
id: story-05-03-02
title: Drill down from hierarchy node to item details
type: user-story
feature: feature-05-03
epic: epic-05
status: ready
priority: must-have
source: FR-023
dependencies: []
tasks: []
---

# Story 05-03-02: Drill down from hierarchy node to item details

## User Story
As a User,
I can click on a hierarchy node in the usage report to drill down to detailed usage records,
so that I can investigate which branches or dates contributed to the category's consumption.

## Business Context
Hierarchy drill-down is essential for FR-023 enabling users to transition from high-level category aggregates to granular transactional usage details.

## Acceptance Criteria
- [ ] Given I view a hierarchy-based report, when I click on a hierarchy node, then I navigate to detailed usage records for all items under that node
- [ ] Given I drill down from a node, when I see usage details, then I can view date, branch, quantity, and notes
- [ ] Given I am viewing drill-down details, when I click "Back to Hierarchy Report", then I return to the hierarchy view with my previous expansion state preserved
- [ ] Given I drill down on a Level 2 or 3 node, when I view details, then only items under that specific node are shown

## Definition of Done
- All acceptance criteria above are verified and passing
- All tasks under this story are complete
- Behaviour is demonstrable in the running application
- No known defects for this story

## Technical Notes
- Navigation: HierarchyReport → UsageDetailView (with hierarchyNodeId filter)
- Component: UsageDetailView (data-testid: usage-detail-view)
- Filter: Items filtered by hierarchy node membership
- State preservation: Browser history or state management for hierarchy expansion
- Business rule: Drill-down from aggregate to detail per FR-023
