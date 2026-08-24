import React, { createContext, useContext, useMemo, useState } from 'react'

/**
 * Application user roles, matching `src/types/user.ts` on the backend
 * (Admin / User per the BRD).
 */
export type UserRole = 'ADMIN' | 'USER'

interface AuthContextValue {
  role: UserRole
  setRole: (role: UserRole) => void
}

const STORAGE_KEY = 'stationery-inventory:role'

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

/**
 * Minimal role-awareness provider for admin-only UI gating (e.g. the usage
 * record delete action, story-04-01-04).
 *
 * NOTE: This is a placeholder until the IAM/RBAC epic (epic-07 — IAM
 * authentication, login form, and route guards) is implemented. It has no
 * login flow of its own; it defaults to the least-privileged USER role and
 * only grants ADMIN when explicitly selected/stored, persisting the choice
 * in localStorage so admin-gated actions are inspectable/testable without a
 * full authentication flow.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole>(() => {
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null
    return stored === 'ADMIN' ? 'ADMIN' : 'USER'
  })

  const setRole = (next: UserRole) => {
    setRoleState(next)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, next)
    }
  }

  const value = useMemo(() => ({ role, setRole }), [role])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Hook exposing the current user's role for role-based UI rendering
 * (FR-024, FR-025, FR-026).
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
