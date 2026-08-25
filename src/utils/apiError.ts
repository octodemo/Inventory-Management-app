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
