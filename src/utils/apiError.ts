import { Response } from 'express'

/**
 * Standard API error shape used across all routes, as defined in
 * workshop-stack.md (`api_error_format`) and docs/design/design-doc.md
 * (section 3 — API Contracts).
 */
export interface ApiErrorBody {
  message: string
  status: number
  timestamp: string
}

/**
 * Error class used to signal a business-rule or validation failure that
 * should be surfaced to the client with a specific HTTP status code.
 */
export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
    this.name = 'ApiError'
  }
}

/**
 * Builds the standard API error response body.
 *
 * @param status - HTTP status code for the error.
 * @param message - Human-readable error message.
 * @returns The error payload in the shape `{ message, status, timestamp }`.
 */
export function buildApiError(status: number, message: string): ApiErrorBody {
  return {
    message,
    status,
    timestamp: new Date().toISOString(),
  }
}

/**
 * Sends a standard-format error response and ends the request.
 *
 * @param res - Express response object.
 * @param status - HTTP status code for the error.
 * @param message - Human-readable error message.
 */
export function sendApiError(res: Response, status: number, message: string): void {
  res.status(status).json(buildApiError(status, message))
}

/**
 * Central error handler used by route handlers' catch blocks. Recognizes
 * `ApiError` instances (thrown deliberately by services for validation or
 * business-rule failures) and responds with their intended status code;
 * anything else is treated as an unexpected server error (500).
 *
 * @param res - Express response object.
 * @param error - The error thrown/caught in a route handler.
 */
export function handleRouteError(res: Response, error: unknown): void {
  if (error instanceof ApiError) {
    sendApiError(res, error.status, error.message)
    return
  }
  const message = error instanceof Error ? error.message : 'Internal server error'
  sendApiError(res, 500, message)
}
