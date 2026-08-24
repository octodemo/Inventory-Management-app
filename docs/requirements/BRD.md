# Business Requirements Document
**Project:** Stationery Usage Analysis / Inventory Management
**Date:** 2026-08-24
**Source:** BUSINESS-REQUIREMENTS.txt

## 1. Summary
This application enables a large MicroFinance company with approximately 1,500 branches to track and analyze stationery inventory usage across all locations. The system provides inventory master management, vendor-wise analysis, item-wise usage tracking with hierarchical categorization, rate maintenance, and organizational structure management (branches, regional offices, premises, supervisors). Users interact through a React-based interface with menu navigation, dashboards, widgets, tabular reports with pagination, upload/download capabilities, and PDF export functionality. The application enforces role-based access control and administrative oversight for secure distributed operations.

## 2. User Roles
| Role | Description |
|------|-------------|
| Admin | Full system access to manage inventory masters, vendors, items, hierarchies, rates, branches, regional offices, premises, supervisors, and configure access controls |
| User | Restricted access based on role-based permissions; can view reports, track usage, and perform operations within assigned scope |

## 3. In Scope
- Inventory master management
- Vendor master management and vendor-wise analysis
- Item master management and item-wise usage tracking
- Item hierarchy management (categorization and grouping)
- Item rate maintenance
- Branch master management
- Regional office master management
- Premises master management
- Supervisor master management
- Mapping of premises to supervisors
- Checkbox-based multi-selection for branches, regional offices, and items
- Tabular reports with pagination
- Data upload capability
- Data download capability
- PDF export of reports
- Dashboard with widgets displaying usage insights
- Menu-based navigation
- IAM framework integration
- Role-based access control (RBAC)
- Admin access management
- Branch-level and regional-office-level usage tracking
- Vendor-based reporting
- Item-based reporting
- Hierarchy-based reporting

## 4. Out of Scope
- Integration with external financial systems (not mentioned)
- Real-time inventory alerts or notifications (not specified)
- Supplier ordering or procurement workflows (not included in functional scope)
- Mobile native applications (React web UI specified only)
- Multi-language support (not mentioned)
- Audit trail and change history (not explicitly required)
- Barcode or QR code scanning for inventory (not mentioned)
- Automated reordering or stock replenishment (not specified)

## 5. Functional Requirements

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| FR-001 | System shall maintain an Inventory master with all stationery items | Admin can create, view, update, and delete inventory items; Each item has a unique identifier |
| FR-002 | System shall maintain a Vendor master with vendor details | Admin can create, view, update, and delete vendor records; Each vendor has a unique identifier |
| FR-003 | System shall track item-wise usage across all branches | Users can view usage data filtered by specific items; Usage data displays consumption quantities per item |
| FR-004 | System shall maintain an Item hierarchy for categorization | Admin can define parent-child relationships between item categories; Hierarchy supports multiple levels of nesting |
| FR-005 | System shall maintain item rates | Admin can set and update rates for each inventory item; Rate history is preserved for reporting |
| FR-006 | System shall maintain a Branch master with details of all ~1,500 branches | Admin can create, view, update, and delete branch records; Each branch has a unique identifier |
| FR-007 | System shall maintain a Regional Office master | Admin can create, view, update, and delete regional office records; Each regional office has a unique identifier |
| FR-008 | System shall maintain a Premises master | Admin can create, view, update, and delete premises records; Each premises has a unique identifier |
| FR-009 | System shall maintain a Supervisor master | Admin can create, view, update, and delete supervisor records; Each supervisor has a unique identifier |
| FR-010 | System shall support mapping of premises to supervisors | Admin can assign one or more premises to a supervisor; Mapping can be updated or removed |
| FR-011 | System shall provide checkbox-based multi-selection for branches in reports | Users can select multiple branches using checkboxes; Selection persists during report generation |
| FR-012 | System shall provide checkbox-based multi-selection for regional offices in reports | Users can select multiple regional offices using checkboxes; Selection persists during report generation |
| FR-013 | System shall provide checkbox-based multi-selection for items in reports | Users can select multiple items using checkboxes; Selection persists during report generation |
| FR-014 | System shall display reports in tabular format with pagination | Reports render as tables; Pagination controls allow navigation through large datasets |
| FR-015 | System shall provide vendor-wise analysis reports | Users can generate reports showing inventory usage grouped by vendor; Reports display vendor name, items supplied, and usage quantities |
| FR-016 | System shall support data upload capability | Admin can upload data files (CSV or Excel format assumed); System validates and imports data into appropriate masters |
| FR-017 | System shall support data download capability | Users can download report data in standard formats (CSV or Excel assumed); Downloaded data matches displayed report content |
| FR-018 | System shall support PDF export of reports | Users can export any report to PDF format; PDF maintains tabular layout and formatting |
| FR-019 | System shall provide a dashboard with widgets displaying usage insights | Dashboard displays key metrics such as total usage, top items, top vendors; Widgets are interactive and support drill-down |
| FR-020 | System shall provide menu-based navigation | Main menu provides access to all functional areas; Navigation hierarchy is intuitive and role-appropriate |
| FR-021 | System shall support branch-level usage tracking | Users can filter and view usage data specific to individual branches; Branch-level totals are calculated correctly |
| FR-022 | System shall support regional-office-level usage tracking | Users can filter and view usage data aggregated by regional office; Regional office totals include all associated branches |
| FR-023 | System shall support hierarchy-based reporting | Users can generate reports organized by item hierarchy; Reports support drill-down from parent to child categories |
| FR-024 | System shall enforce role-based access control (RBAC) | Each user is assigned one or more roles; Access to features and data is restricted based on role permissions |
| FR-025 | System shall provide Admin access with full system privileges | Admin role can access all masters, reports, and configuration features; Admin can manage user roles and permissions |
| FR-026 | System shall restrict user access based on assigned permissions | Users without appropriate permissions cannot access restricted features; Unauthorized access attempts are blocked |
| FR-027 | System shall integrate with an IAM framework for authentication | Users authenticate through the IAM framework; Authentication tokens are validated on each request |

## 6. Non-Functional Requirements

| ID | Category | Requirement |
|----|----------|-------------|
| NFR-001 | Security | All routes require authentication via IAM framework integration |
| NFR-002 | Security | Role-based access control (RBAC) enforced on all protected resources |
| NFR-003 | Security | Admin access requires elevated privileges and secure credential management |
| NFR-004 | Performance | Page load time under 3 seconds for standard reports (up to 1,000 records) |
| NFR-005 | Performance | Report generation completes within 10 seconds for datasets up to 10,000 records |
| NFR-006 | Performance | Dashboard widgets load within 2 seconds |
| NFR-007 | Scalability | System supports 1,500+ branches without performance degradation |
| NFR-008 | Scalability | System supports concurrent access by up to 500 users |
| NFR-009 | Usability | Responsive React-based interface works on desktop browsers (Chrome, Edge, Firefox, Safari) |
| NFR-010 | Usability | Intuitive menu-based navigation requires minimal training |
| NFR-011 | Usability | Tabular layouts with pagination support efficient data browsing |
| NFR-012 | Usability | Checkbox-based multi-selection is keyboard-accessible and mobile-friendly |
| NFR-013 | Data Integrity | Data validation on all upload operations prevents invalid data entry |
| NFR-014 | Data Integrity | Referential integrity enforced between masters (e.g., items reference vendors) |
| NFR-015 | Availability | System uptime of 99.5% during business hours (8 AM to 8 PM local time) |
| NFR-016 | Compatibility | PDF exports render correctly in standard PDF readers |
| NFR-017 | Compatibility | Upload/download features support CSV and Excel formats |

## 7. Assumptions
- **Authentication mechanism:** IAM framework provides standard OAuth2 or SAML-based authentication; no custom authentication logic required in the application
- **Data sources:** Initial data for branches, regional offices, vendors, and items will be provided via upload files; no real-time integration with external systems is required
- **User provisioning:** User accounts and role assignments are managed through the IAM framework; the application reads role claims but does not manage user lifecycle
- **Item rate currency:** All item rates are in a single currency (assumed INR for MicroFinance context); no multi-currency support required
- **Usage data entry:** Stationery usage data is entered manually or uploaded periodically; real-time inventory deduction is not required
- **Premises-supervisor relationship:** One premises can be assigned to exactly one supervisor at any time; supervisor can oversee multiple premises
- **Branch-regional office relationship:** Each branch belongs to exactly one regional office; regional offices form a single-level hierarchy (no nested regional offices)
- **Item hierarchy depth:** Item hierarchy supports up to 4 levels (e.g., Category → Subcategory → Item Type → Specific Item)
- **Report time range:** Usage reports are generated for user-selected date ranges; default range is current month
- **Data retention:** Historical usage data is retained indefinitely for trend analysis; no automatic archival or purging
- **Deployment model:** Application will be deployed on internal infrastructure or private cloud; internet access not required for users
- **Browser support:** Modern browsers only (Chrome 90+, Edge 90+, Firefox 88+, Safari 14+); no IE11 support
- **Mobile access:** Desktop-first design; mobile responsiveness is for tablets and larger devices, not smartphones
- **Widget customization:** Dashboard widgets display predefined metrics; user-customizable dashboards are out of scope for initial release
