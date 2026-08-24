---
id: story-01-02-03
title: Edit hierarchy node
type: user-story
feature: feature-01-02
epic: epic-01
status: ready
priority: should-have
source: FR-004
dependencies: []
tasks: [16-BACKEND-hierarchy-update-api, 76-UNIT-TEST-hierarchy-update-api, 136-FRONTEND-hierarchy-update-form, 196-E2E-TEST-hierarchy-node-update]
---

# Story 01-02-03: Edit hierarchy node

## User Story
As an Admin,
I can edit an existing hierarchy node's name and reassign its parent relationship,
so that I can correct categorization errors or reorganize the hierarchy structure.

## Business Context
Hierarchy editing supports FR-004 by allowing administrators to refine and adjust categorization over time as organizational needs evolve.

## Acceptance Criteria
- [ ] Given I select a hierarchy node, when I edit its name, then the updated name is saved and displayed in the tree
- [ ] Given I edit a node, when I reassign it to a different parent, then the node moves to the new parent in the tree structure
- [ ] Given I reassign a node to a new parent, when the move would exceed 4 levels of nesting, then I see an error message preventing the change
- [ ] Given I edit a node that has children, when I reassign its parent, then all child nodes move with it maintaining their relative structure

## Definition of Done
- All acceptance criteria above are verified and passing
- All tasks under this story are complete
- Behaviour is demonstrable in the running application
- No known defects for this story

## Technical Notes
- API: PUT /api/hierarchies/:id (updates name and/or parentId)
- Validation: Prevent reassignment if new depth > 4 levels
- Component: HierarchyEditForm (data-testid: hierarchy-edit-form)
- Business rule: Depth validation must consider entire subtree when reassigning parent
