---
id: story-05-03-01
title: Generate hierarchy-based usage report
type: user-story
feature: feature-05-03
epic: epic-05
status: ready
priority: must-have
source: FR-023
dependencies: []
tasks: [48-BACKEND-hierarchy-based-report-api, 108-UNIT-TEST-hierarchy-based-report-api, 168-FRONTEND-hierarchy-based-report, 228-E2E-TEST-hierarchy-report]
---

# Story 05-03-01: Generate hierarchy-based usage report

## User Story
As a User,
I can generate a usage report showing items grouped by their position in the 4-level hierarchy,
so that I can analyze consumption patterns across different categories and subcategories.

## Business Context
Hierarchy-based reporting is the core behaviour for FR-023 enabling category-level analysis by leveraging the item hierarchy structure defined in FR-004.

## Acceptance Criteria
- [ ] Given I generate a hierarchy-based report, when it loads, then items are grouped by their hierarchy levels
- [ ] Given I view the report, when I see hierarchy levels, then Level 1 (top-level category) totals are displayed
- [ ] Given I view a top-level category, when I expand it, then I see Level 2 subcategories with their totals
- [ ] Given the hierarchy has 4 levels, when I fully expand a branch, then I see consumption data down to the lowest-level items

## Definition of Done
- All acceptance criteria above are verified and passing
- All tasks under this story are complete
- Behaviour is demonstrable in the running application
- No known defects for this story

## Technical Notes
- API: POST /api/reports/hierarchy-based (returns usage aggregated by hierarchy node)
- Component: HierarchyReport (data-testid: hierarchy-report)
- Display: Tree structure with expand/collapse controls per level
- Aggregation: Sum quantities for all items under each hierarchy node
- Business rule: Hierarchy-based aggregation per FR-023 using FR-004 hierarchy
