---
id: 121-UNIT-TEST-iam-authentication-api
title: [UNIT-TEST] IAM Authentication API Test
type: task
taskType: UNIT-TEST
userStory: story-07-01-01
feature: feature-07-01
epic: epic-07
status: ready
dependencies: [61-BACKEND-iam-authentication-api]
---

# [UNIT-TEST] IAM Authentication API Test

## Description
Write Jest unit tests for POST /api/auth/login and GET /api/auth/me endpoints covering authentication flow and user profile.

## Acceptance Criteria
- [ ] Unit test verifies POST /api/auth/login authenticates user via IAM and returns user details with token
- [ ] Unit test verifies GET /api/auth/me returns authenticated user profile when valid session exists
