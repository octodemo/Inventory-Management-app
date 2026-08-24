---
id: 89-UNIT-TEST-branch-api
title: [UNIT-TEST] Branch API Test
type: task
taskType: UNIT-TEST
userStory: story-03-01-02
feature: feature-03-01
epic: epic-03
status: ready
dependencies: [29-BACKEND-branch-api]
---

# [UNIT-TEST] Branch API Test

## Description
Write Jest unit tests for Branch CRUD endpoints covering creation, filtering, and unique code validation.

## Acceptance Criteria
- [ ] Unit test verifies POST /api/branches creates branch linked to regional office and returns 201 Created
- [ ] Unit test verifies GET /api/branches with regionalOfficeId filter returns only matching branches
