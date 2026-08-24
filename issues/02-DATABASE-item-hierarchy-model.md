---
id: 02-DATABASE-item-hierarchy-model
title: [DATABASE] ItemHierarchy Model
type: task
taskType: DATABASE
userStory: story-01-02-01
feature: feature-01-02
epic: epic-01
status: done
dependencies: []
---

# [DATABASE] ItemHierarchy Model

## Description
Create the ItemHierarchy entity in prisma/schema.prisma with self-referential parent-child relationship supporting up to 4 levels of nesting (FR-004). This entity enables categorization and grouping of inventory items in a tree structure.

## Acceptance Criteria
- [ ] ItemHierarchy entity defined in prisma/schema.prisma with fields (id, name, parentId, createdAt, updatedAt)
- [ ] Self-referential relationship defined via parentId foreign key (HierarchyNesting relation)
- [ ] Seed data in prisma/seed.ts creates a 3-level hierarchy (Category → Subcategory → Item Type) with at least 5 nodes
- [ ] Migration file generated in prisma/migrations/ folder

## Definition of Done
- All acceptance criteria above are verified
- Code is reviewed and meets team standards
- No regressions introduced in related areas
