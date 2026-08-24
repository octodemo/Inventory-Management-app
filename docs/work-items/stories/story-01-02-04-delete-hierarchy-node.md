---
id: story-01-02-04
title: Delete hierarchy node
type: user-story
feature: feature-01-02
epic: epic-01
status: ready
priority: should-have
source: FR-004
dependencies: []
tasks: []
---

# Story 01-02-04: Delete hierarchy node

## User Story
As an Admin,
I can delete a hierarchy node that has no associated inventory items,
so that I can remove unused or obsolete categories from the hierarchy.

## Business Context
Hierarchy deletion supports FR-004 by allowing cleanup of unused categories while protecting data integrity by preventing deletion of categories with assigned items.

## Acceptance Criteria
- [ ] Given a hierarchy node has no assigned inventory items, when I delete it, then the node is removed from the tree
- [ ] Given a hierarchy node has assigned inventory items, when I attempt to delete it, then I see an error message and the node is not deleted
- [ ] Given a hierarchy node has child nodes, when I attempt to delete it, then I see an error message and the node is not deleted
- [ ] Given I delete a hierarchy node, when I refresh the tree view, then the deleted node is no longer displayed

## Definition of Done
- All acceptance criteria above are verified and passing
- All tasks under this story are complete
- Behaviour is demonstrable in the running application
- No known defects for this story

## Technical Notes
- API: DELETE /api/hierarchies/:id (validates no items or children before deletion)
- Validation: Prevent deletion if ItemHierarchy.items.length > 0 or children.length > 0
- Component: HierarchyDeleteConfirmation (data-testid: hierarchy-delete-dialog)
- Business rule: Cascade validation ensures data integrity per FR-004
