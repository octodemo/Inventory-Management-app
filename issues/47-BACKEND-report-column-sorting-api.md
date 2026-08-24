---
id: 47-BACKEND-report-column-sorting-api
title: [BACKEND] Report Column Sorting API
type: task
taskType: BACKEND
userStory: story-05-02-03
feature: feature-05-02
epic: epic-05
status: ready
dependencies: [09-DATABASE-usage-record-model]
---

# [BACKEND] Report Column Sorting API

## Description
Extend all report endpoints to accept orderBy and direction parameters for column sorting (orderBy: column name, direction: asc/desc).

## Acceptance Criteria
- [ ] All report endpoints accept orderBy and direction parameters and return sorted results
- [ ] Report sorting returns 400 Bad Request when orderBy references invalid column name
