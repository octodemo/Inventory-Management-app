import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Top navigation bar showing the authenticated user, their role badge and the
 * logout action.
 *
 * @returns The navigation bar element.
 */
export const NavBar: React.FC = () => {
  const { user, logout } = useAuth()
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()

  const handleLogout = async () => {
    setBusy(true)
    try {
      await logout()
      navigate('/login', { replace: true })
    } finally {
      setBusy(false)
    }
  }

  return (
    <header data-testid="nav-bar">
      <span data-testid="app-title">Stationery Inventory Management</span>
      {user && (
        <>
          <span data-testid="user-name">{user.name}</span>
          <span data-testid="user-role-badge">{user.role}</span>
          <button
            type="button"
            data-testid="logout-button"
            disabled={busy}
            onClick={() => void handleLogout()}
          >
            Logout
          </button>
        </>
      )}
    </header>
  )
}
