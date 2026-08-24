---
id: 61-BACKEND-iam-authentication-api
title: [BACKEND] IAM Authentication API
type: task
taskType: BACKEND
userStory: story-07-01-01
feature: feature-07-01
epic: epic-07
status: ready
dependencies: []
---

# [BACKEND] IAM Authentication API

## Description
Implement POST /api/auth/login endpoint integrating with IAM framework for authentication and GET /api/auth/me endpoint returning current user profile.

## Acceptance Criteria
- [ ] POST /api/auth/login authenticates user via IAM framework and returns user details with JWT token or session
- [ ] GET /api/auth/me returns authenticated user profile details when valid session exists
