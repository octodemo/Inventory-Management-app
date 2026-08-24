---
id: 126-UNIT-TEST-rbac-access-denied-api
title: [UNIT-TEST] RBAC Access Denied API Test
type: task
taskType: UNIT-TEST
userStory: story-07-02-03
feature: feature-07-02
epic: epic-07
status: ready
dependencies: [66-BACKEND-rbac-access-denied-api]
---

# [UNIT-TEST] RBAC Access Denied API Test

## Description
Write Jest unit tests for RBAC access denied error response covering consistency and format.

## Acceptance Criteria
- [ ] Unit test verifies RBAC middleware returns 403 Forbidden with message "Access denied" for unauthorized attempts
- [ ] Unit test verifies access denied response follows standard error format with message, status, timestamp
