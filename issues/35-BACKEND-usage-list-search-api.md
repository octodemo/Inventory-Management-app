---
id: 35-BACKEND-usage-list-search-api
title: [BACKEND] Usage List and Search API
type: task
taskType: BACKEND
userStory: story-04-01-02
feature: feature-04-01
epic: epic-04
status: ready
dependencies: [09-DATABASE-usage-record-model]
---

# [BACKEND] Usage List and Search API

## Description
Implement GET /api/usage endpoint with pagination and filtering by date range, branchIds, itemIds, and regionalOfficeIds.

## Acceptance Criteria
- [ ] GET /api/usage returns paginated list of usage records with default page=1 and limit=20
- [ ] GET /api/usage with filter parameters (startDate, endDate, branchIds, itemIds) returns only matching records
