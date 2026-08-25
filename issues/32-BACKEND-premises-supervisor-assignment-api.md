---
id: 32-BACKEND-premises-supervisor-assignment-api
title: [BACKEND] Premises Supervisor Assignment API
type: task
taskType: BACKEND
userStory: story-03-02-02
feature: feature-03-02
epic: epic-03
status: done
dependencies: [08-DATABASE-premises-model,07-DATABASE-supervisor-model]
---

# [BACKEND] Premises Supervisor Assignment API

## Description
Implement POST and PUT /api/premises endpoints allowing premises creation and update with supervisor assignment via supervisorId field. Validates supervisor exists.

## Acceptance Criteria
- [ ] POST /api/premises creates premises with supervisor assignment and returns 201 Created
- [ ] PUT /api/premises/:id allows changing the assigned supervisor and returns 200 OK with updated details
