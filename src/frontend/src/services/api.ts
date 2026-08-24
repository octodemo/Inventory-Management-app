/**
 * API service module.
 *
 * All network access goes through {@link apiFetch}, which sends the session
 * cookie, normalises the standard API error format and surfaces authentication
 * (401) and authorisation (403) failures as typed errors.
 */

/** Roles supported by the application. */
export type UserRole = 'ADMIN' | 'USER'

/** Authenticated user profile returned by the API. */
export interface AuthenticatedUser {
  id: number
  email: string
  name: string
  role: UserRole
}

/** A navigation menu entry returned by `GET /api/menu/items`. */
export interface MenuItem {
  id: string
  label: string
  path: string
  children?: MenuItem[]
}

/** A logical grouping of menu items. */
export interface MenuSection {
  id: string
  label: string
  order: number
  items: MenuItem[]
}

/** Error carrying the HTTP status of a failed API call. */
export class ApiError extends Error {
  readonly status: number

  /**
   * Creates an API error.
   *
   * @param message - Message returned by the API.
   * @param status - HTTP status code of the failed response.
   */
  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

/** Message displayed when the API rejects a request with 403 Forbidden. */
export const ACCESS_DENIED_MESSAGE = 'Access denied'

/**
 * Performs an authenticated API request.
 *
 * @param path - API path, for example `/api/auth/me`.
 * @param init - Optional fetch options.
 * @returns The parsed JSON response body.
 * @throws {ApiError} When the API responds with a non-2xx status.
 */
export const apiFetch = async <T>(path: string, init: RequestInit = {}): Promise<T> => {
  const response = await fetch(path, {
    ...init,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(init.headers ?? {}) },
  })

  if (!response.ok) {
    let message = response.statusText
    try {
      const body = (await response.json()) as { message?: string }
      message = body.message ?? message
    } catch {
      // Response had no JSON body — fall back to the status text.
    }
    throw new ApiError(response.status === 403 ? ACCESS_DENIED_MESSAGE : message, response.status)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

/**
 * Authenticates a user through the IAM framework.
 *
 * @param email - Corporate email address.
 * @param password - Credential supplied by the user.
 * @returns The authenticated user profile.
 */
export const login = async (email: string, password: string): Promise<AuthenticatedUser> => {
  const body = await apiFetch<{ user: AuthenticatedUser }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  return body.user
}

/**
 * Ends the current session on the server and in the IAM framework.
 */
export const logout = async (): Promise<void> => {
  await apiFetch<{ message: string }>('/api/auth/logout', { method: 'POST' })
}

/**
 * Fetches the profile of the currently authenticated user.
 *
 * @returns The authenticated user profile, including the role.
 */
export const fetchCurrentUser = async (): Promise<AuthenticatedUser> => {
  const body = await apiFetch<{ user: AuthenticatedUser }>('/api/auth/me')
  return body.user
}

/**
 * Fetches the navigation menu allowed for the authenticated user's role.
 *
 * @returns The role filtered menu sections.
 */
export const fetchMenu = async (): Promise<MenuSection[]> => {
  const body = await apiFetch<{ sections: MenuSection[] }>('/api/menu/items')
  return body.sections
}
