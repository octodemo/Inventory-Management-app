---
id: story-04-01-02
title: View and search usage records
type: user-story
feature: feature-04-01
epic: epic-04
status: ready
priority: must-have
source: FR-003
dependencies: []
tasks: []
---

# Story 04-01-02: View and search usage records

## User Story
As a User,
I can view a paginated list of all usage records with search and filter capabilities,
so that I can find and review stationery consumption data efficiently.

## Business Context
Usage record list viewing supports FR-003 by enabling navigation and retrieval of consumption data across all branches and items.

## Acceptance Criteria
- [ ] Given usage records exist, when I view the usage list page, then I see records displayed in a paginated table
- [ ] Given the usage list is displayed, when I filter by item or branch, then only matching records are shown
- [ ] Given I view the usage list, when I click on a record, then I see detailed information including quantity, date, and notes
- [ ] Given the usage list has multiple pages, when I navigate between pages, then filter selections persist

## Definition of Done
- All acceptance criteria above are verified and passing
- All tasks under this story are complete
- Behaviour is demonstrable in the running application
- No known defects for this story

## Technical Notes
- API: GET /api/usage (supports pagination, itemId filter, branchId filter)
- Component: UsageRecordList (data-testid: usage-list), UsageRecordDetail (data-testid: usage-detail)
- Display: Item name, branch name, quantity, usage date in table
- Business rule: Search and filter enable efficient data retrieval per FR-003
