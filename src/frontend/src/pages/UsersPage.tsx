import React, { useEffect, useState } from 'react'
import { apiFetch, type AuthenticatedUser } from '../services/api'

/**
 * Admin-only page listing the users mirrored from the IAM framework.
 *
 * The page is reachable only through an admin route guard, and the API applies
 * the same restriction server side.
 *
 * @returns The users page element.
 */
export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<AuthenticatedUser[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    const loadUsers = async () => {
      try {
        const body = await apiFetch<{ users: AuthenticatedUser[] }>('/api/users')
        if (active) {
          setUsers(body.users)
        }
      } catch (caught) {
        if (active) {
          setError(caught instanceof Error ? caught.message : 'Unable to load users')
        }
      }
    }

    void loadUsers()

    return () => {
      active = false
    }
  }, [])

  return (
    <section data-testid="users-page">
      <h1>User Management</h1>
      {error && <p data-testid="users-error">{error}</p>}
      <table data-testid="users-table">
        <tbody>
          {users.map((user) => (
            <tr key={user.id} data-testid="users-row">
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
