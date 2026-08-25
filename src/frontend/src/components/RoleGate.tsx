import React from 'react'
import { useAuth } from '../context/AuthContext'
import type { UserRole } from '../services/api'

/** Props accepted by {@link RoleGate}. */
export interface RoleGateProps {
  /** Roles allowed to see the wrapped controls. */
  allowedRoles: UserRole[]
  children: React.ReactNode
}

/**
 * Renders its children only when the authenticated user holds an allowed role.
 *
 * Used to hide create, edit and delete controls from non-admin users.
 *
 * @param props - Allowed roles and the gated children.
 * @returns The children, or `null` when the role is not allowed.
 */
export const RoleGate: React.FC<RoleGateProps> = ({ allowedRoles, children }) => {
  const { hasRole } = useAuth()
  return hasRole(...allowedRoles) ? <>{children}</> : null
}

/** Props accepted by {@link RoleAwareButton}. */
export interface RoleAwareButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Roles allowed to see the button. */
  allowedRoles: UserRole[]
  /** Optional test id override; defaults to `role-aware-button`. */
  testId?: string
}

/**
 * A button that is rendered only for the allowed roles.
 *
 * @param props - Allowed roles, optional test id and standard button props.
 * @returns The button element, or `null` when the role is not allowed.
 */
export const RoleAwareButton: React.FC<RoleAwareButtonProps> = ({
  allowedRoles,
  testId = 'role-aware-button',
  children,
  ...buttonProps
}) => (
  <RoleGate allowedRoles={allowedRoles}>
    <button type="button" data-testid={testId} {...buttonProps}>
      {children}
    </button>
  </RoleGate>
)
