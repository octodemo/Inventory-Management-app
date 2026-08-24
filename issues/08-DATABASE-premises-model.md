---
id: 08-DATABASE-premises-model
title: [DATABASE] Premises Model
type: task
taskType: DATABASE
userStory: story-03-02-02
feature: feature-03-02
epic: epic-03
status: ready
dependencies: [07-DATABASE-supervisor-model]
---

# [DATABASE] Premises Model

## Description
Create the Premises entity in prisma/schema.prisma to maintain premises master data (FR-008) with relationships to Supervisor. Each premises is assigned to exactly one supervisor (FR-010).

## Acceptance Criteria
- [ ] Premises entity defined in prisma/schema.prisma with fields (id, name, address, supervisorId, createdAt, updatedAt)
- [ ] Relationship to Supervisor via supervisorId foreign key
- [ ] Seed data in prisma/seed.ts creates at least 5 premises records mapped to supervisors
- [ ] Migration file generated in prisma/migrations/ folder

## Definition of Done
- All acceptance criteria above are verified
- Code is reviewed and meets team standards
- No regressions introduced in related areas
