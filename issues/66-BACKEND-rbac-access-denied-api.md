---
id: 66-BACKEND-rbac-access-denied-api
title: [BACKEND] RBAC Access Denied API
type: task
taskType: BACKEND
userStory: story-07-02-03
feature: feature-07-02
epic: epic-07
status: ready
dependencies: []
---

# [BACKEND] RBAC Access Denied API

## Description
Ensure RBAC middleware returns consistent 403 Forbidden error response with message "Access denied" when user lacks required role for endpoint access.

## Acceptance Criteria
- [ ] RBAC middleware returns 403 Forbidden with error message "Access denied" for unauthorized role-based access attempts
- [ ] Access denied response follows standard error format with message, status, and timestamp fields
