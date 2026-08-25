import type { Request } from 'express'

/** Name of the cookie carrying the session token. */
export const SESSION_COOKIE_NAME = 'session_token'

/**
 * Reads a cookie value from the incoming request without extra dependencies.
 *
 * @param req - Incoming Express request.
 * @param name - Cookie name to read.
 * @returns The decoded cookie value, or `undefined` when it is not present.
 */
export const readCookie = (req: Request, name: string): string | undefined => {
  const header = req.headers?.cookie
  if (!header) {
    return undefined
  }

  for (const part of header.split(';')) {
    const separatorIndex = part.indexOf('=')
    if (separatorIndex === -1) {
      continue
    }
    if (part.slice(0, separatorIndex).trim() === name) {
      return decodeURIComponent(part.slice(separatorIndex + 1).trim())
    }
  }

  return undefined
}

/**
 * Extracts the session token from either the `Authorization: Bearer` header
 * or the session cookie.
 *
 * @param req - Incoming Express request.
 * @returns The raw session token, or `undefined` when no token is present.
 */
export const extractSessionToken = (req: Request): string | undefined => {
  const authorization = req.headers?.authorization
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const token = authorization.slice('bearer '.length).trim()
    if (token) {
      return token
    }
  }

  return readCookie(req, SESSION_COOKIE_NAME)
}
