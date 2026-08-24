---
id: 06-DATABASE-branch-model
title: [DATABASE] Branch Model
type: task
taskType: DATABASE
userStory: story-03-01-02
feature: feature-03-01
epic: epic-03
status: done
dependencies: [05-DATABASE-regional-office-model]
---

# [DATABASE] Branch Model

## Description
Create the Branch entity in prisma/schema.prisma to maintain branch master data (FR-006) with relationships to RegionalOffice. Each branch belongs to exactly one regional office.

## Acceptance Criteria
- [ ] Branch entity defined in prisma/schema.prisma with fields (id, name, code, regionalOfficeId, address, createdAt, updatedAt)
- [ ] Unique constraint on code field
- [ ] Relationship to RegionalOffice via regionalOfficeId foreign key
- [ ] Seed data in prisma/seed.ts creates at least 10 branch records across different regional offices
- [ ] Migration file generated in prisma/migrations/ folder

## Definition of Done
- All acceptance criteria above are verified
- Code is reviewed and meets team standards
- No regressions introduced in related areas
