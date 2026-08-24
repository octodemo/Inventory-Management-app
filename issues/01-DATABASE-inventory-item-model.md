---
id: 01-DATABASE-inventory-item-model
title: [DATABASE] InventoryItem Model
type: task
taskType: DATABASE
userStory: story-01-01-01
feature: feature-01-01
epic: epic-01
status: ready
dependencies: []
---

# [DATABASE] InventoryItem Model

## Description
Create the InventoryItem entity in prisma/schema.prisma with all required fields, relationships to Vendor and ItemHierarchy, and seed data as defined in the design document. This entity represents the core inventory master (FR-001) with fields for name, description, unit, and foreign keys to vendor and hierarchy nodes.

## Acceptance Criteria
- [ ] InventoryItem entity defined in prisma/schema.prisma with all fields (id, name, description, vendorId, hierarchyId, unit, createdAt, updatedAt)
- [ ] Relationship to Vendor via vendorId foreign key
- [ ] Relationship to ItemHierarchy via hierarchyId foreign key
- [ ] Seed data in prisma/seed.ts creates at least 10 inventory items as specified in the design document
- [ ] Migration file generated in prisma/migrations/ folder

## Definition of Done
- All acceptance criteria above are verified
- Code is reviewed and meets team standards
- No regressions introduced in related areas
