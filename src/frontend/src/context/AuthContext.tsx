import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  ApiError,
  fetchCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
  type AuthenticatedUser,
  type UserRole,
} from '../services/api'

/** Value exposed by the authentication context. */
export interface AuthContextValue {
  /** Authenticated user, or `null` when the session is anonymous. */
  user: AuthenticatedUser | null
  /** `true` while the current session is being resolved. */
  loading: boolean
  /** Last authentication error message, if any. */
  error: string | null
  /** Authenticates a user through the IAM framework. */
  login(email: string, password: string): Promise<void>
  /** Ends the session and clears the local state. */
  logout(): Promise<void>
  /** Indicates whether the authenticated user holds one of the given roles. */
  hasRole(...roles: UserRole[]): boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

/**
 * Provides the authenticated user and session actions to the component tree.
 *
 * On mount the provider resolves the existing session via `GET /api/auth/me`
 * so role based rendering reflects the current permissions after a refresh.
 *
 * @param props - React children rendered inside the provider.
 * @returns The auth context provider element.
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthenticatedUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    const resolveSession = async () => {
      try {
        const currentUser = await fetchCurrentUser()
        if (active) {
          setUser(currentUser)
        }
      } catch {
        if (active) {
          setUser(null)
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void resolveSession()

    return () => {
      active = false
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setError(null)
    try {
      setUser(await loginRequest(email, password))
    } catch (caught) {
      setUser(null)
      setError(caught instanceof ApiError ? caught.message : 'Unable to sign in')
      throw caught
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await logoutRequest()
    } finally {
      setUser(null)
      setError(null)
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      error,
      login,
      logout,
      hasRole: (...roles: UserRole[]) => Boolean(user && roles.includes(user.role)),
    }),
    [user, loading, error, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Reads the authentication context.
 *
 * @returns The current auth context value.
 * @throws When used outside of an {@link AuthProvider}.
 */
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
