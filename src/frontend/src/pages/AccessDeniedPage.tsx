import React from 'react'
import { Link } from 'react-router-dom'
import { ACCESS_DENIED_MESSAGE } from '../services/api'

/**
 * Page shown when an authenticated user attempts to open a route their role is
 * not allowed to access.
 *
 * @returns The access denied page element.
 */
export const AccessDeniedPage: React.FC = () => (
  <main data-testid="access-denied-page">
    <h1>403 — Forbidden</h1>
    <p data-testid="access-denied-message">{ACCESS_DENIED_MESSAGE}</p>
    <Link to="/dashboard" data-testid="access-denied-back">
      Back to dashboard
    </Link>
  </main>
)
