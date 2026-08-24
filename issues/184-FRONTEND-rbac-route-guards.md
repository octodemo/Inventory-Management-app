---
id: 184-FRONTEND-rbac-route-guards
title: [FRONTEND] RBAC Route Guards
type: task
taskType: FRONTEND
userStory: story-07-02-01
feature: feature-07-02
epic: epic-07
status: ready
dependencies: [64-BACKEND-rbac-route-protection-api]
---

# [FRONTEND] RBAC Route Guards

## Description
Create React route guards protecting admin-only pages based on user role.

## Acceptance Criteria
- [ ] Component implements route guards checking user role from GET /api/auth/me before rendering admin pages
- [ ] Non-admin users attempting admin routes are redirected to dashboard with error message
