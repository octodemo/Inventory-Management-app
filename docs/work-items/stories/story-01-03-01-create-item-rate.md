---
id: story-01-03-01
title: Create item rate
type: user-story
feature: feature-01-03
epic: epic-01
status: ready
priority: must-have
source: FR-005
dependencies: []
tasks: []
---

# Story 01-03-01: Create item rate

## User Story
As an Admin,
I can create a new rate for an inventory item with an effective date range,
so that I can track current and future pricing for stationery items.

## Business Context
Rate creation is the core behaviour for FR-005 enabling accurate cost tracking across all reporting periods. The system must enforce non-overlapping date ranges per item.

## Acceptance Criteria
- [ ] Given I select an inventory item, when I create a rate with effectiveFrom date, then the rate is saved and associated with that item
- [ ] Given I create a rate, when I provide both effectiveFrom and effectiveTo dates, then both dates are saved correctly
- [ ] Given a rate exists for an item, when I create a new rate with overlapping dates, then I see an error message preventing the creation
- [ ] Given I create a rate, when effectiveTo is earlier than effectiveFrom, then I see a validation error

## Definition of Done
- All acceptance criteria above are verified and passing
- All tasks under this story are complete
- Behaviour is demonstrable in the running application
- No known defects for this story

## Technical Notes
- API: POST /api/rates (creates ItemRate with itemId, rate, effectiveFrom, optional effectiveTo)
- Validation: Prevent overlapping date ranges for same itemId
- Component: ItemRateForm (data-testid: item-rate-form)
- Business rule: effectiveFrom must be before effectiveTo; no overlapping ranges per item (FR-005)
