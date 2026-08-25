import type { UserRole } from '../types/auth'

/** A single navigation menu entry. */
export interface MenuItem {
  id: string
  label: string
  path: string
  /** Role required to see the item. When omitted the item is visible to every role. */
  requiredRole?: UserRole
  /** Nested menu items, used for hierarchical navigation. */
  children?: MenuItem[]
}

/** A logical grouping of menu items, rendered with a section label. */
export interface MenuSection {
  id: string
  label: string
  /** Display order of the section within the menu. */
  order: number
  requiredRole?: UserRole
  items: MenuItem[]
}

const MENU_DEFINITION: MenuSection[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    order: 1,
    items: [{ id: 'dashboard', label: 'Dashboard', path: '/dashboard' }],
  },
  {
    id: 'inventory',
    label: 'Inventory',
    order: 2,
    items: [
      { id: 'inventory-items', label: 'Items', path: '/inventory' },
      { id: 'usage', label: 'Usage', path: '/usage' },
      { id: 'branches', label: 'Branches', path: '/branches' },
    ],
  },
  {
    id: 'reports',
    label: 'Reports',
    order: 3,
    items: [
      {
        id: 'reports',
        label: 'Reports',
        path: '/reports',
        children: [
          { id: 'reports-item-wise', label: 'Item-wise', path: '/reports/item-wise' },
          { id: 'reports-branch-wise', label: 'Branch-wise', path: '/reports/branch-wise' },
          {
            id: 'reports-vendor-wise',
            label: 'Vendor-wise',
            path: '/reports/vendor-wise',
            requiredRole: 'ADMIN',
          },
        ],
      },
    ],
  },
  {
    id: 'admin',
    label: 'Admin',
    order: 4,
    requiredRole: 'ADMIN',
    items: [
      { id: 'vendors', label: 'Vendor Management', path: '/vendors', requiredRole: 'ADMIN' },
      { id: 'hierarchies', label: 'Item Hierarchy', path: '/hierarchies', requiredRole: 'ADMIN' },
      { id: 'rates', label: 'Item Rates', path: '/rates', requiredRole: 'ADMIN' },
      { id: 'users', label: 'User Management', path: '/users', requiredRole: 'ADMIN' },
      { id: 'upload', label: 'Bulk Upload', path: '/upload', requiredRole: 'ADMIN' },
    ],
  },
]

const isVisibleTo = (role: UserRole, requiredRole?: UserRole): boolean =>
  requiredRole === undefined || requiredRole === role

const filterItems = (items: MenuItem[], role: UserRole): MenuItem[] =>
  items
    .filter((item) => isVisibleTo(role, item.requiredRole))
    .map((item) =>
      item.children ? { ...item, children: filterItems(item.children, role) } : { ...item },
    )

/** Service producing the navigation menu structure for a given role. */
export class MenuService {
  private readonly definition: MenuSection[]

  /**
   * Creates the menu service.
   *
   * @param definition - Menu definition to serve. Defaults to the application menu.
   */
  constructor(definition: MenuSection[] = MENU_DEFINITION) {
    this.definition = definition
  }

  /**
   * Returns the menu sections a role is allowed to see, in display order.
   *
   * Sections and items that require a different role are removed, and sections
   * left without any visible item are omitted entirely.
   *
   * @param role - Role of the authenticated user.
   * @returns The filtered, ordered menu structure.
   */
  getMenuForRole(role: UserRole): MenuSection[] {
    return this.definition
      .filter((section) => isVisibleTo(role, section.requiredRole))
      .map((section) => ({ ...section, items: filterItems(section.items, role) }))
      .filter((section) => section.items.length > 0)
      .sort((a, b) => a.order - b.order)
  }
}
