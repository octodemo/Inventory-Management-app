---
id: 27-BACKEND-vendor-drill-down-api
title: [BACKEND] Vendor Drill-Down API
type: task
taskType: BACKEND
userStory: story-02-02-03
feature: feature-02-02
epic: epic-02
status: done
dependencies: [04-DATABASE-vendor-model,01-DATABASE-inventory-item-model,09-DATABASE-usage-record-model]
---

# [BACKEND] Vendor Drill-Down API

## Description
Extend vendor-wise report response to include item-level details within each vendor's data, enabling drill-down from vendor to item usage details.

## Acceptance Criteria
- [ ] POST /api/reports/vendor-wise response includes items array for each vendor with itemId, itemName, and usage details
- [ ] POST /api/reports/vendor-wise allows filtering drill-down results by specific items within a vendor
