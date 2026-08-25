import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { fetchMenu, type MenuItem, type MenuSection } from '../services/api'

const isItemActive = (currentPath: string, itemPath: string): boolean =>
  currentPath === itemPath || currentPath.startsWith(`${itemPath}/`)

const renderItem = (item: MenuItem, currentPath: string, depth = 0): React.ReactElement => {
  const active = isItemActive(currentPath, item.path)

  return (
    <li key={item.id}>
      <Link
        to={item.path}
        data-testid={active ? 'active-menu-item' : 'menu-item'}
        data-menu-item-id={item.id}
        className={active ? 'menu-item menu-item--active' : 'menu-item'}
        style={{ paddingLeft: `${depth}rem` }}
        aria-current={active ? 'page' : undefined}
      >
        {item.label}
      </Link>
      {item.children && item.children.length > 0 && (
        <ul data-testid="menu-item-children">
          {item.children.map((child) => renderItem(child, currentPath, depth + 1))}
        </ul>
      )}
    </li>
  )
}

/**
 * Navigation sidebar rendering the role filtered menu returned by the API.
 *
 * The menu structure comes from `GET /api/menu/items`, so admin-only sections
 * are never sent to — or rendered for — non-admin users. The menu item matching
 * the current route is highlighted.
 *
 * @returns The sidebar element.
 */
export const Sidebar: React.FC = () => {
  const [sections, setSections] = useState<MenuSection[]>([])
  const [error, setError] = useState<string | null>(null)
  const { pathname } = useLocation()

  useEffect(() => {
    let active = true

    const loadMenu = async () => {
      try {
        const menuSections = await fetchMenu()
        if (active) {
          setSections(menuSections)
        }
      } catch {
        if (active) {
          setError('Unable to load the navigation menu')
        }
      }
    }

    void loadMenu()

    return () => {
      active = false
    }
  }, [])

  return (
    <aside data-testid="sidebar">
      <nav data-testid="navigation-menu">
        {error && <p data-testid="menu-error">{error}</p>}
        {sections.map((section) => (
          <section key={section.id} data-testid="menu-section" data-menu-section-id={section.id}>
            <h2 data-testid="menu-section-label">{section.label}</h2>
            <ul>{section.items.map((item) => renderItem(item, pathname))}</ul>
          </section>
        ))}
      </nav>
    </aside>
  )
}
