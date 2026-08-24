---
id: 125-UNIT-TEST-rbac-user-role-api
title: [UNIT-TEST] RBAC User Role API Test
type: task
taskType: UNIT-TEST
userStory: story-07-02-02
feature: feature-07-02
epic: epic-07
status: ready
dependencies: [65-BACKEND-rbac-user-role-api]
---

# [UNIT-TEST] RBAC User Role API Test

## Description
Write Jest unit tests for user role retrieval covering role field inclusion in GET /api/auth/me response.

## Acceptance Criteria
- [ ] Unit test verifies GET /api/auth/me response includes role field with value ADMIN or USER
- [ ] Unit test verifies user role matches authenticated user's actual role from IAM or database
