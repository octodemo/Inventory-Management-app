---
id: 09-DATABASE-usage-record-model
title: [DATABASE] UsageRecord Model
type: task
taskType: DATABASE
userStory: story-04-01-01
feature: feature-04-01
epic: epic-04
status: ready
dependencies: [01-DATABASE-inventory-item-model, 06-DATABASE-branch-model]
---

# [DATABASE] UsageRecord Model

## Description
Create the UsageRecord entity in prisma/schema.prisma to track stationery usage per item per branch (FR-003, FR-021) with quantity, usage date, and optional notes.

## Acceptance Criteria
- [ ] UsageRecord entity defined in prisma/schema.prisma with fields (id, itemId, branchId, quantity, usageDate, notes, createdAt, updatedAt)
- [ ] Relationship to InventoryItem via itemId foreign key
- [ ] Relationship to Branch via branchId foreign key
- [ ] Seed data in prisma/seed.ts creates at least 20 usage records across different items and branches
- [ ] Migration file generated in prisma/migrations/ folder

## Definition of Done
- All acceptance criteria above are verified
- Code is reviewed and meets team standards
- No regressions introduced in related areas
