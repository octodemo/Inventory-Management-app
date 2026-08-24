---
id: 22-BACKEND-vendor-list-search-api
title: [BACKEND] Vendor List and Search API
type: task
taskType: BACKEND
userStory: story-02-01-02
feature: feature-02-01
epic: epic-02
status: ready
dependencies: [04-DATABASE-vendor-model]
---

# [BACKEND] Vendor List and Search API

## Description
Implement GET /api/vendors endpoint with pagination and search by name. Returns paginated vendor list with default page size of 20.

## Acceptance Criteria
- [ ] GET /api/vendors returns a paginated list of vendors with default page=1 and limit=20
- [ ] GET /api/vendors with search parameter filters vendors by name containing the search term
