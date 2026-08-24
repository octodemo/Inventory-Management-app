---
id: 04-DATABASE-vendor-model
title: [DATABASE] Vendor Model
type: task
taskType: DATABASE
userStory: story-02-01-01
feature: feature-02-01
epic: epic-02
status: ready
dependencies: []
---

# [DATABASE] Vendor Model

## Description
Create the Vendor entity in prisma/schema.prisma to maintain vendor master data (FR-002) with contact details and relationships to inventory items.

## Acceptance Criteria
- [ ] Vendor entity defined in prisma/schema.prisma with fields (id, name, contactName, contactEmail, contactPhone, address, createdAt, updatedAt)
- [ ] Seed data in prisma/seed.ts creates at least 3 vendor records as specified in the design document
- [ ] Migration file generated in prisma/migrations/ folder

## Definition of Done
- All acceptance criteria above are verified
- Code is reviewed and meets team standards
- No regressions introduced in related areas
