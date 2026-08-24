---
id: 49-BACKEND-hierarchy-drill-down-api
title: [BACKEND] Hierarchy Drill-Down API
type: task
taskType: BACKEND
userStory: story-05-03-02
feature: feature-05-03
epic: epic-05
status: done
dependencies: [02-DATABASE-item-hierarchy-model,01-DATABASE-inventory-item-model,09-DATABASE-usage-record-model]
---

# [BACKEND] Hierarchy Drill-Down API

## Description
Extend POST /api/reports/hierarchy-wise response to include items array within each hierarchy node showing item-level usage details.

## Acceptance Criteria
- [ ] POST /api/reports/hierarchy-wise response includes items array for each hierarchy node with item details and usage
- [ ] Hierarchy drill-down response allows filtering to specific items within a hierarchy node
