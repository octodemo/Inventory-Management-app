---
id: 143-FRONTEND-vendor-update-form
title: [FRONTEND] Vendor Update Form
type: task
taskType: FRONTEND
userStory: story-02-01-03
feature: feature-02-01
epic: epic-02
status: ready
dependencies: [23-BACKEND-vendor-update-api]
---

# [FRONTEND] Vendor Update Form

## Description
Create React component for editing vendors with pre-populated fields.

## Acceptance Criteria
- [ ] Component loads vendor details via GET /api/vendors/:id and pre-populates form
- [ ] Form calls PUT /api/vendors/:id on submit and navigates back to list on success
