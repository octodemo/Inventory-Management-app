---
id: story-01-02-01
title: Create hierarchy node
type: user-story
feature: feature-01-02
epic: epic-01
status: ready
priority: must-have
source: FR-004
dependencies: []
tasks: []
---

# Story 01-02-01: Create hierarchy node

## User Story
As an Admin,
I can create a new hierarchy node and optionally assign it to a parent node,
so that I can build a multi-level categorization structure for inventory items.

## Business Context
This is the core behaviour for establishing the item hierarchy required by FR-004. The system must support up to 4 levels of nesting to enable logical grouping of stationery items across the organization.

## Acceptance Criteria
- [ ] Given I am on the hierarchy management page, when I create a new node without a parent, then a root-level hierarchy node is created
- [ ] Given I am creating a new node, when I select an existing node as parent, then the new node is created as a child of the selected parent
- [ ] Given I attempt to create a node at the 5th level, when I submit, then I see an error message indicating maximum nesting depth exceeded
- [ ] Given I create a hierarchy node, when I provide a name, then the node is saved with that name and displayed in the tree view

## Definition of Done
- All acceptance criteria above are verified and passing
- All tasks under this story are complete
- Behaviour is demonstrable in the running application
- No known defects for this story

## Technical Notes
- API: POST /api/hierarchies (creates ItemHierarchy with optional parentId)
- Domain: ItemHierarchy.parentId references parent node; depth validation enforced
- Component: HierarchyForm (data-testid: hierarchy-form)
- Business rule: Maximum hierarchy depth is 4 levels (FR-004)
