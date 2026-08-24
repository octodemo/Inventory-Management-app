---
id: 185-FRONTEND-user-role-display
title: [FRONTEND] User Role Display
type: task
taskType: FRONTEND
userStory: story-07-02-02
feature: feature-07-02
epic: epic-07
status: ready
dependencies: [65-BACKEND-rbac-user-role-api]
---

# [FRONTEND] User Role Display

## Description
Create React component for displaying current user role in navigation or profile section.

## Acceptance Criteria
- [ ] Component fetches GET /api/auth/me and displays user role badge in navigation bar
- [ ] Role badge shows ADMIN or USER based on authenticated user's role
