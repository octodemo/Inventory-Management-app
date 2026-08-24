---
id: story-01-01-02
title: View and search inventory items
type: user-story
feature: feature-01-01
epic: epic-01
status: ready
priority: must-have
source: FR-001
dependencies: []
tasks: [11-BACKEND-inventory-list-search-api, 71-UNIT-TEST-inventory-list-search-api, 131-FRONTEND-inventory-list-search, 191-E2E-TEST-inventory-list-and-search]
---

# Story 01-01-02: View and search inventory items

## User Story
As an Admin,
I can view a paginated list of all inventory items with search and filter capabilities,
so that I can locate and review items efficiently across the entire inventory.

## Business Context
Core inventory master viewing capability required by FR-001. This story enables administrators to browse, search, and filter the inventory master across all 1,500 branches, supporting efficient item management and review operations.

## Acceptance Criteria
- [ ] Given I navigate to the inventory page, when the page loads, then I see a paginated table of inventory items displaying item name, vendor name, hierarchy category, and unit
- [ ] Given I am viewing the inventory list, when there are more than 20 items, then I see pagination controls to navigate through multiple pages
- [ ] Given I am viewing the inventory list, when I enter a search term in the search box, then the list filters to show only items whose name or description contains the search term
- [ ] Given I am viewing the inventory list, when I select a vendor from the vendor filter dropdown, then the list shows only items from that vendor
- [ ] Given I am viewing the inventory list, when I select a hierarchy category from the hierarchy filter dropdown, then the list shows only items in that category
- [ ] Given the inventory list is empty, when the page loads, then I see a message indicating no inventory items exist

## Definition of Done
- All acceptance criteria above are verified and passing
- All tasks under this story are complete
- Behaviour is demonstrable in the running application
- No known defects for this story

## Technical Notes
- API: GET /api/inventory with query parameters (page, limit, vendorId, hierarchyId, search)
- Domain: InventoryItem entity joined with Vendor and ItemHierarchy for display
- Component: InventoryItemList (data-testid: inventory-item-list)
- Pagination: Default 20 items per page, max 100 items per page (NFR-014)
- Performance: Page load time under 3 seconds for up to 1,000 records (NFR-004)
