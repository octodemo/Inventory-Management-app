---
id: 55-BACKEND-bulk-upload-api
title: [BACKEND] Bulk Upload API
type: task
taskType: BACKEND
userStory: story-06-01-01
feature: feature-06-01
epic: epic-06
status: ready
dependencies: [01-DATABASE-inventory-item-model,04-DATABASE-vendor-model,06-DATABASE-branch-model,09-DATABASE-usage-record-model]
---

# [BACKEND] Bulk Upload API

## Description
Implement POST /api/upload/{type} endpoints (inventory, vendors, branches, usage) accepting multipart/form-data CSV/Excel files and returning import results with success/failure counts.

## Acceptance Criteria
- [ ] POST /api/upload/inventory accepts CSV/Excel file, validates data, imports valid records, and returns summary with imported, failed, and errors array
- [ ] Bulk upload endpoints validate file format and return 400 Bad Request for invalid file types
