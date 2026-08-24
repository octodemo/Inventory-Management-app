---
id: 138-FRONTEND-item-rate-form
title: [FRONTEND] Item Rate Form
type: task
taskType: FRONTEND
userStory: story-01-03-01
feature: feature-01-03
epic: epic-01
status: ready
dependencies: [18-BACKEND-item-rate-api]
---

# [FRONTEND] Item Rate Form

## Description
Create React component for adding item rates with item selection and date range validation.

## Acceptance Criteria
- [ ] Component renders form with item dropdown, rate input, and effective date picker
- [ ] Form calls POST /api/rates and displays overlap validation errors with existing rates
