import { NavLink } from 'react-router-dom'

export type UserRole = 'ADMIN' | 'USER'

interface MenuItem {
  label: string
  path: string
  adminOnly?: boolean
}

const sections: Array<{ label: string; items: MenuItem[] }> = [
  { label: 'Inventory', items: [{ label: 'Items', path: '/items' }, { label: 'Hierarchy', path: '/hierarchy' }, { label: 'Rates', path: '/rates' }] },
  { label: 'Vendors', items: [{ label: 'Vendor List', path: '/vendors', adminOnly: true }] },
  { label: 'Usage', items: [{ label: 'Usage Records', path: '/usage' }, { label: 'Reports', path: '/reports' }] },
  {
    label: 'Admin',
    items: [
      { label: 'Regional Offices', path: '/regional-offices', adminOnly: true },
      { label: 'Branches', path: '/branches', adminOnly: true },
      { label: 'Supervisors', path: '/supervisors', adminOnly: true },
      { label: 'Users', path: '/users', adminOnly: true },
    ],
  },
]

/**
 * Renders role-appropriate navigation grouped into functional sections.
 */
export function NavigationMenu({ role }: { role: UserRole }) {
  return (
    <aside className="sidebar" data-testid="sidebar">
      <nav aria-label="Main navigation" data-testid="navigation-menu">
        <NavLink className={({ isActive }) => isActive ? 'menu-item active-menu-item' : 'menu-item'} data-testid="menu-item" to="/">
          Dashboard
        </NavLink>
        {sections.map((section) => {
          const items = section.items.filter((item) => !item.adminOnly || role === 'ADMIN')
          if (items.length === 0) return null
          return (
            <section data-testid="menu-section" key={section.label}>
              <h2>{section.label}</h2>
              {items.map((item) => (
                <NavLink
                  className={({ isActive }) => isActive ? 'menu-item active-menu-item' : 'menu-item'}
                  data-testid="menu-item"
                  key={item.path}
                  to={item.path}
                >
                  {item.label}
                </NavLink>
              ))}
            </section>
          )
        })}
      </nav>
    </aside>
  )
}
