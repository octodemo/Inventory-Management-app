---
id: story-01-03-03
title: Update rate effective period
type: user-story
feature: feature-01-03
epic: epic-01
status: ready
priority: should-have
source: FR-005
dependencies: []
tasks: []
---

# Story 01-03-03: Update rate effective period

## User Story
As an Admin,
I can update the effectiveTo date of an existing rate to close a rate period,
so that I can manage rate transitions and maintain accurate effective date ranges.

## Business Context
Rate period updates support FR-005 by allowing administrators to close rate periods when introducing new rates, ensuring clean date range boundaries for reporting.

## Acceptance Criteria
- [ ] Given an existing rate with no effectiveTo date, when I set an effectiveTo date, then the rate period is closed on that date
- [ ] Given I update effectiveTo, when the new date creates an overlap with another rate, then I see an error message preventing the update
- [ ] Given I update effectiveTo, when the new date is earlier than effectiveFrom, then I see a validation error
- [ ] Given I update a rate's effectiveTo, when I save, then the current rate calculation reflects the updated date range

## Definition of Done
- All acceptance criteria above are verified and passing
- All tasks under this story are complete
- Behaviour is demonstrable in the running application
- No known defects for this story

## Technical Notes
- API: PUT /api/rates/:id (updates effectiveTo date)
- Validation: Prevent overlapping ranges; ensure effectiveTo > effectiveFrom
- Component: ItemRateEditForm (data-testid: rate-edit-form)
- Business rule: Current rate determined by matching current date against date ranges (FR-005)
