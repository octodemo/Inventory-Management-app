---
id: 21-BACKEND-vendor-api
title: [BACKEND] Vendor API
type: task
taskType: BACKEND
userStory: story-02-01-01
feature: feature-02-01
epic: epic-02
status: done
dependencies: [04-DATABASE-vendor-model]
---

# [BACKEND] Vendor API

## Description
Implement POST /api/vendors endpoint for creating vendor records with name and optional contact details (contactName, contactEmail, contactPhone, address). Validates required name field.

## Acceptance Criteria
- [ ] POST /api/vendors creates a new vendor with all provided fields and returns 201 Created with vendor details
- [ ] POST /api/vendors returns 400 Bad Request when name field is missing
