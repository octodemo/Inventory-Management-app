import React, { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Login page authenticating the user through the IAM framework.
 *
 * On success the session cookie issued by the API is stored by the browser and
 * the user is redirected to the dashboard; on failure the error returned by the
 * IAM framework is displayed and the user remains on the page.
 *
 * @returns The login page element.
 */
export const LoginPage: React.FC = () => {
  const { user, loading, login, error } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  if (loading) {
    return <p data-testid="auth-loading">Checking your session…</p>
  }

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    try {
      await login(email, password)
      navigate('/dashboard', { replace: true })
    } catch {
      // The error message is surfaced through the auth context.
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main data-testid="login-page">
      <h1>Sign in</h1>
      <form data-testid="login-form" onSubmit={(event) => void handleSubmit(event)}>
        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
          data-testid="login-email"
          type="email"
          value={email}
          autoComplete="username"
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          data-testid="login-password"
          type="password"
          value={password}
          autoComplete="current-password"
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <button type="submit" data-testid="login-submit" disabled={submitting}>
          Sign in
        </button>
      </form>

      {error && <p data-testid="login-error">{error}</p>}
    </main>
  )
}
