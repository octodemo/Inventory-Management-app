---
id: 186-FRONTEND-rbac-access-denied
title: [FRONTEND] RBAC Access Denied
type: task
taskType: FRONTEND
userStory: story-07-02-03
feature: feature-07-02
epic: epic-07
status: ready
dependencies: [66-BACKEND-rbac-access-denied-api]
---

# [FRONTEND] RBAC Access Denied

## Description
Create React component for displaying access denied error when user attempts unauthorized action.

## Acceptance Criteria
- [ ] Component intercepts 403 Forbidden responses and displays "Access denied" message
- [ ] Access denied message follows consistent error format matching other error displays
