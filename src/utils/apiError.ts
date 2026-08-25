import { Response } from 'express'

/**
 * Standard API error payload helpers.
 *
 * The shape is defined by `api_error_format` in workshop-stack.md:
 * `{ message: string, status: number, timestamp: string }`.
 */

/** Standard error response body returned by every API route. */
export interface ApiErrorBody {
  message: string
  status: number
  timestamp: string
}

/**
 * Builds a standard API error body.
 *
 * @param message - Human readable error message.
 * @param status - HTTP status code associated with the error.
 * @returns The error payload in the standard format.
 */
export const buildApiError = (message: string, status: number): ApiErrorBody => ({
  message,
  status,
  timestamp: new Date().toISOString(),
})

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
 * Sends a standard-format error response and ends the request.
 *
 * @param res - Express response object.
 * @param status - HTTP status code for the error.
 * @param message - Human-readable error message.
 */
export function sendApiError(res: Response, status: number, message: string): void {
  res.status(status).json(buildApiError(message, status))
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
