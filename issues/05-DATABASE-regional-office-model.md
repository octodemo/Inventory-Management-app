---
id: 05-DATABASE-regional-office-model
title: [DATABASE] RegionalOffice Model
type: task
taskType: DATABASE
userStory: story-03-01-01
feature: feature-03-01
epic: epic-03
status: done
dependencies: []
---

# [DATABASE] RegionalOffice Model

## Description
Create the RegionalOffice entity in prisma/schema.prisma to maintain regional office master data (FR-007) with unique code constraint.

## Acceptance Criteria
- [ ] RegionalOffice entity defined in prisma/schema.prisma with fields (id, name, code, address, createdAt, updatedAt)
- [ ] Unique constraint on code field
- [ ] Seed data in prisma/seed.ts creates at least 3 regional office records
- [ ] Migration file generated in prisma/migrations/ folder

## Definition of Done
- All acceptance criteria above are verified
- Code is reviewed and meets team standards
- No regressions introduced in related areas
