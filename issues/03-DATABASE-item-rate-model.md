---
id: 03-DATABASE-item-rate-model
title: [DATABASE] ItemRate Model
type: task
taskType: DATABASE
userStory: story-01-03-01
feature: feature-01-03
epic: epic-01
status: done
dependencies: [01-DATABASE-inventory-item-model]
---

# [DATABASE] ItemRate Model

## Description
Create the ItemRate entity in prisma/schema.prisma to maintain historical rates for inventory items with effective date ranges (FR-005). Business rule: overlapping date ranges not allowed for the same item.

## Acceptance Criteria
- [ ] ItemRate entity defined in prisma/schema.prisma with fields (id, itemId, rate, effectiveFrom, effectiveTo, createdAt, updatedAt)
- [ ] Relationship to InventoryItem via itemId foreign key
- [ ] Seed data in prisma/seed.ts creates at least 3 rate records with valid non-overlapping date ranges
- [ ] Migration file generated in prisma/migrations/ folder

## Definition of Done
- All acceptance criteria above are verified
- Code is reviewed and meets team standards
- No regressions introduced in related areas
