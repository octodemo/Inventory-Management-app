import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { UserRole } from '../services/api'

/** Props accepted by {@link ProtectedRoute}. */
export interface ProtectedRouteProps {
  /** Roles allowed to view the route. When omitted any authenticated role may view it. */
  allowedRoles?: UserRole[]
  children: React.ReactNode
}

/**
 * Guards a route by authentication and role.
 *
 * Unauthenticated visitors are redirected to the login page, and authenticated
 * users whose role is not allowed are redirected to the access denied page.
 *
 * @param props - Allowed roles and the guarded children.
 * @returns The guarded element, or a redirect.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <p data-testid="auth-loading">Checking your session…</p>
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/access-denied" replace />
  }

  return <>{children}</>
}
