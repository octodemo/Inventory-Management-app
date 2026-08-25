import React from 'react'
import { NavBar } from './NavBar'
import { Sidebar } from './Sidebar'

/**
 * Application shell rendering the navigation bar, the role filtered sidebar
 * and the active page.
 *
 * @param props - The page content rendered inside the shell.
 * @returns The layout element.
 */
export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div data-testid="app-layout">
    <NavBar />
    <div>
      <Sidebar />
      <main data-testid="main-content">{children}</main>
    </div>
  </div>
)
