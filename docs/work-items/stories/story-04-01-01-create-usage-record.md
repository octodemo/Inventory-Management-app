---
id: story-04-01-01
title: Create usage record
type: user-story
feature: feature-04-01
epic: epic-04
status: ready
priority: must-have
source: FR-003
dependencies: []
tasks: []
---

# Story 04-01-01: Create usage record

## User Story
As a User,
I can create a new usage record capturing item, branch, quantity, usage date, and optional notes,
so that I can record stationery consumption at the branch level.

## Business Context
Usage record creation is the core behaviour for FR-003 providing the foundational data source for all usage tracking and reporting across 1,500 branches.

## Acceptance Criteria
- [ ] Given I am on the usage record creation page, when I select an item, branch, enter quantity and date, then a new usage record is created
- [ ] Given I create a usage record, when I enter a negative or zero quantity, then I see a validation error preventing submission
- [ ] Given I create a usage record, when I optionally provide notes, then the notes are saved with the record
- [ ] Given I create a usage record successfully, when I view the usage list, then the new record appears with item name, branch name, quantity, and usage date

## Definition of Done
- All acceptance criteria above are verified and passing
- All tasks under this story are complete
- Behaviour is demonstrable in the running application
- No known defects for this story

## Technical Notes
- API: POST /api/usage (creates UsageRecord with itemId, branchId, quantity, usageDate, optional notes)
- Validation: quantity > 0; usageDate required
- Component: UsageRecordForm (data-testid: usage-record-form)
- Selectors: ItemSelector (data-testid: item-selector), BranchSelector (data-testid: branch-selector) with search capability
- Business rule: Captures branch-level consumption per FR-003
