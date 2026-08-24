---
id: feature-01-03
title: Item Rate Management
type: feature
epic: epic-01
status: planned
source: FR-005
userStories: []
---

# Feature 01-03: Item Rate Management

## Description
Provides comprehensive rate maintenance capabilities with historical tracking and effective date range management for all inventory items. Administrators can define and update item rates with effectiveFrom and effectiveTo dates, ensuring accurate cost tracking across all reporting periods. The system preserves complete rate history for audit and analysis purposes while enforcing non-overlapping date ranges per item.

## Parent Epic
[Epic 01: Inventory & Item Management](../epics/epic-01-inventory-item-management.md)

## Scope
**Included:** Create item rate with effectiveFrom and effectiveTo dates, rate history view per item, edit existing rate date ranges, validation preventing overlapping date ranges for same item, current rate calculation based on date ranges, rate history preservation for reporting, rate display on item detail page, effective date range picker with validation.

**Excluded:** Automatic rate inflation adjustment (not specified in BRD), rate approval workflows (not in scope), multi-currency support (not specified).

## Acceptance Criteria
- [ ] Admin can create a new rate for an inventory item with effectiveFrom and optional effectiveTo dates
- [ ] System displays complete rate history for each item in chronological order
- [ ] System validates and prevents overlapping date ranges for the same item
- [ ] Current rate is determined by matching current date against effectiveFrom/effectiveTo ranges
- [ ] Admin can update effectiveTo date to close a rate period
- [ ] Rate history is preserved and accessible for all reporting periods
- [ ] Item detail page displays current rate and link to rate history
- [ ] Form validation ensures effectiveFrom is before effectiveTo when both are specified

## Definition of Done
- All user stories under this feature are complete and accepted
- All acceptance criteria above are verified
- Feature is demonstrable end to end in the running application
- No known defects in this feature area
