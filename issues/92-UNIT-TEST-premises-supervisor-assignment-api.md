---
id: 92-UNIT-TEST-premises-supervisor-assignment-api
title: [UNIT-TEST] Premises Supervisor Assignment API Test
type: task
taskType: UNIT-TEST
userStory: story-03-02-02
feature: feature-03-02
epic: epic-03
status: ready
dependencies: [32-BACKEND-premises-supervisor-assignment-api]
---

# [UNIT-TEST] Premises Supervisor Assignment API Test

## Description
Write Jest unit tests for premises creation and update with supervisor assignment covering validation and assignment changes.

## Acceptance Criteria
- [ ] Unit test verifies POST /api/premises creates premises with supervisor assignment and returns 201 Created
- [ ] Unit test verifies PUT /api/premises/:id allows changing assigned supervisor and returns 200 OK
