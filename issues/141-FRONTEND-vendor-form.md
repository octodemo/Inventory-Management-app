---
id: 141-FRONTEND-vendor-form
title: [FRONTEND] Vendor Form
type: task
taskType: FRONTEND
userStory: story-02-01-01
feature: feature-02-01
epic: epic-02
status: done
dependencies: [21-BACKEND-vendor-api]
---

# [FRONTEND] Vendor Form

## Description
Create React component for vendor creation form with name, contact, and address fields.

## Acceptance Criteria
- [ ] Component renders form with data-testid="vendor-form" including fields for name, contact details, address
- [ ] Form calls POST /api/vendors on submit and displays validation errors for required fields
