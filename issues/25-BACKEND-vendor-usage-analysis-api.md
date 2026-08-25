---
id: 25-BACKEND-vendor-usage-analysis-api
title: [BACKEND] Vendor Usage Analysis API
type: task
taskType: BACKEND
userStory: story-02-02-01
feature: feature-02-02
epic: epic-02
status: done
dependencies: [04-DATABASE-vendor-model,01-DATABASE-inventory-item-model,09-DATABASE-usage-record-model]
---

# [BACKEND] Vendor Usage Analysis API

## Description
Implement GET /api/vendors/:id/usage-analysis endpoint returning vendor-wise usage report with total quantity across all items from that vendor, broken down by branch.

## Acceptance Criteria
- [ ] GET /api/vendors/:id/usage-analysis returns vendor details, list of items with usage by branch, and total usage quantity
- [ ] GET /api/vendors/:id/usage-analysis aggregates usage data correctly across all items supplied by the vendor
