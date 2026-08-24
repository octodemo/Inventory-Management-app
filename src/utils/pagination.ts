import { ApiError } from './apiError.js'

/** Standard pagination metadata included in every paginated API response. */
export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export const DEFAULT_PAGE = 1
export const DEFAULT_LIMIT = 20
export const MAX_LIMIT = 100

/**
 * Parses and normalizes `page`/`limit` values coming from either query
 * parameters (GET requests) or a request body (POST report requests).
 *
 * Falls back to the documented defaults (page=1, limit=20) and clamps the
 * limit to the documented maximum of 100 (see docs/design/design-doc.md,
 * "Query Parameters for GET /api/inventory").
 *
 * @param page - Raw page value from the request.
 * @param limit - Raw limit value from the request.
 * @returns Normalized `{ page, limit }` values, both >= 1 and limit <= 100.
 */
export function parsePagination(page: unknown, limit: unknown): { page: number; limit: number } {
  let parsedPage = Number(page)
  let parsedLimit = Number(limit)

  if (!Number.isFinite(parsedPage) || parsedPage < 1) {
    parsedPage = DEFAULT_PAGE
  }
  if (!Number.isFinite(parsedLimit) || parsedLimit < 1) {
    parsedLimit = DEFAULT_LIMIT
  }
  if (parsedLimit > MAX_LIMIT) {
    parsedLimit = MAX_LIMIT
  }

  return { page: Math.floor(parsedPage), limit: Math.floor(parsedLimit) }
}

/**
 * Builds the standard pagination metadata object for a response.
 *
 * @param page - Current page number.
 * @param limit - Page size.
 * @param total - Total number of records across all pages.
 */
export function buildPaginationMeta(page: number, limit: number, total: number): PaginationMeta {
  return {
    page,
    limit,
    total,
    totalPages: total === 0 ? 0 : Math.ceil(total / limit),
  }
}

/**
 * Slices an in-memory array of rows to the requested page.
 *
 * Reports in this system aggregate usage records in application code (see
 * `src/services/reportsService.ts`), so pagination is applied to the final
 * aggregated row set rather than at the database query level.
 *
 * @param rows - Full, already-sorted array of rows.
 * @param page - Current page number.
 * @param limit - Page size.
 */
export function paginateArray<T>(rows: T[], page: number, limit: number): T[] {
  const start = (page - 1) * limit
  return rows.slice(start, start + limit)
}

/**
 * Validates a requested sort column against an allow-list and normalizes the
 * sort direction to `asc` or `desc`.
 *
 * @param orderBy - Requested column name to sort by (may be undefined).
 * @param direction - Requested sort direction (`asc` | `desc`, may be undefined).
 * @param allowedColumns - Column names permitted for this report/list endpoint.
 * @throws {ApiError} 400 Bad Request when `orderBy` is not in `allowedColumns`.
 */
export function parseSort(
  orderBy: unknown,
  direction: unknown,
  allowedColumns: string[]
): { orderBy: string | null; direction: 'asc' | 'desc' } {
  const normalizedDirection = direction === 'desc' ? 'desc' : 'asc'

  if (orderBy === undefined || orderBy === null || orderBy === '') {
    return { orderBy: null, direction: normalizedDirection }
  }

  if (typeof orderBy !== 'string' || !allowedColumns.includes(orderBy)) {
    throw new ApiError(
      400,
      `Invalid orderBy column "${String(orderBy)}". Allowed columns: ${allowedColumns.join(', ')}`
    )
  }

  return { orderBy, direction: normalizedDirection }
}

/**
 * Generic in-memory sort helper applied after aggregation.
 *
 * @param rows - Rows to sort (mutated copy is returned, original untouched).
 * @param orderBy - Column to sort by, or null to leave the input order unchanged.
 * @param direction - Sort direction.
 */
export function sortRows<T extends Record<string, unknown>>(
  rows: T[],
  orderBy: string | null,
  direction: 'asc' | 'desc'
): T[] {
  if (!orderBy) {
    return rows
  }
  const sorted = [...rows].sort((a, b) => {
    const aValue = a[orderBy]
    const bValue = b[orderBy]
    if (aValue === bValue) return 0
    if (aValue === null || aValue === undefined) return 1
    if (bValue === null || bValue === undefined) return -1
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return aValue - bValue
    }
    return String(aValue).localeCompare(String(bValue))
  })
  return direction === 'desc' ? sorted.reverse() : sorted
}
