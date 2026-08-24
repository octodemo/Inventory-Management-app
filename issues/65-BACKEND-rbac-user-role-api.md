---
id: 65-BACKEND-rbac-user-role-api
title: [BACKEND] RBAC User Role API
type: task
taskType: BACKEND
userStory: story-07-02-02
feature: feature-07-02
epic: epic-07
status: ready
dependencies: []
---

# [BACKEND] RBAC User Role API

## Description
Ensure GET /api/auth/me endpoint returns user role (ADMIN or USER) in response for frontend role-based UI rendering decisions.

## Acceptance Criteria
- [ ] GET /api/auth/me response includes role field with value ADMIN or USER matching authenticated user's role
- [ ] User role is correctly retrieved from IAM framework or database User entity
