---
id: 134-FRONTEND-hierarchy-node-form
title: [FRONTEND] Hierarchy Node Form
type: task
taskType: FRONTEND
userStory: story-01-02-01
feature: feature-01-02
epic: epic-01
status: ready
dependencies: [14-BACKEND-hierarchy-node-api]
---

# [FRONTEND] Hierarchy Node Form

## Description
Create React component for creating hierarchy nodes with parent selection and depth validation.

## Acceptance Criteria
- [ ] Component renders form for hierarchy node creation with parent dropdown showing tree structure
- [ ] Form calls POST /api/hierarchies and displays depth validation errors when exceeding 4 levels
