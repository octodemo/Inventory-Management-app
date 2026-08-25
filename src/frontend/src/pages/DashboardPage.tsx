import React from 'react'
import { RoleAwareButton } from '../components/RoleGate'
import { useAuth } from '../context/AuthContext'

/**
 * Dashboard landing page.
 *
 * Demonstrates role gated controls: administrative actions are rendered only
 * for the ADMIN role.
 *
 * @returns The dashboard page element.
 */
export const DashboardPage: React.FC = () => {
  const { user } = useAuth()

  return (
    <section data-testid="dashboard-page">
      <h1>Dashboard</h1>
      <p data-testid="dashboard-greeting">Welcome, {user?.name}</p>
      <RoleAwareButton allowedRoles={['ADMIN']} testId="dashboard-admin-action">
        Manage masters
      </RoleAwareButton>
    </section>
  )
}
