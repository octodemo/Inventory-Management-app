---
id: feature-04-01
title: Usage Record Management
type: feature
epic: epic-04
status: planned
source: FR-003
userStories: [story-04-01-01, story-04-01-02, story-04-01-03, story-04-01-04]
---

# Feature 04-01: Usage Record Management

## Description
Captures and maintains detailed stationery usage data at the branch level, recording item-wise consumption with quantities, usage dates, and contextual notes. Users can create, view, and manage usage records that serve as the foundational data source for all usage tracking, reporting, and analytics capabilities across the 1,500 branches.

## Parent Epic
[Epic 04: Usage Tracking & Recording](../epics/epic-04-usage-tracking-recording.md)

## Scope
**Included:** Create usage record form with item selection, branch selection, quantity input, usage date picker, and notes field, paginated usage record list table, usage record detail view, edit usage record functionality, delete usage record with admin-only restriction, item dropdown selector with search, branch dropdown selector with search, quantity validation preventing negative values, usage date with calendar picker, optional notes textarea.

**Excluded:** Real-time inventory deduction (BRD assumes manual data entry), automated usage alerts (per BRD Out of Scope), barcode scanning for usage entry (per BRD Out of Scope).

## Acceptance Criteria
- [ ] Users can create a new usage record capturing item, branch, quantity, usage date, and optional notes
- [ ] System validates quantity field to prevent negative or zero values
- [ ] Users can view a paginated list of all usage records with search and filter capabilities
- [ ] Users can view detailed information for a single usage record
- [ ] Users can edit existing usage records if they have appropriate permissions
- [ ] Only Admin users can delete usage records
- [ ] Usage record list displays item name, branch name, quantity, and usage date
- [ ] Item and branch selectors support search/filter for efficient selection

## Definition of Done
- All user stories under this feature are complete and accepted
- All acceptance criteria above are verified
- Feature is demonstrable end to end in the running application
- No known defects in this feature area
