import { Link } from 'react-router-dom'

interface AccessDeniedMessageProps {
  onDismiss?: () => void
}

/**
 * Presents a safe, actionable message after an unauthorized request.
 */
export function AccessDeniedMessage({ onDismiss }: AccessDeniedMessageProps) {
  return (
    <section className="access-denied" data-testid="access-denied-message" role="alert">
      <h1>Access Denied</h1>
      <p>You do not have permission to perform this action.</p>
      <Link to="/">Back to Dashboard</Link>
      {onDismiss && <button type="button" onClick={onDismiss}>Dismiss</button>}
    </section>
  )
}
