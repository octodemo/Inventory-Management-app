import { prisma } from '../lib/prisma.js'
import { ApiError } from '../utils/apiError.js'
import { DEFAULT_LIMIT, DEFAULT_PAGE, buildPaginationMeta, parsePagination } from '../utils/pagination.js'

/** Shape accepted by create/update operations for a UsageRecord. */
export interface UsageRecordInput {
  itemId: number
  branchId: number
  quantity: number
  usageDate: string | Date
  notes?: string | null
}

/**
 * Query filters supported by GET /api/usage (FR-003, FR-021, FR-022).
 *
 * Accepts both the plural array forms (`itemIds`, `branchIds`,
 * `regionalOfficeIds` — as a comma-separated string or repeated query
 * params) and the singular/bracket forms (`itemId`, `branchId`,
 * `regionalOfficeId` — a single value, or an array via `itemId[]=1&itemId[]=2`
 * query syntax, which Express's query parser collapses onto the same key).
 * When both a plural and singular key are present for the same filter, the
 * plural key takes precedence.
 */
export interface UsageRecordFilters {
  page?: unknown
  limit?: unknown
  startDate?: unknown
  endDate?: unknown
  branchIds?: unknown
  branchId?: unknown
  itemIds?: unknown
  itemId?: unknown
  regionalOfficeIds?: unknown
  regionalOfficeId?: unknown
}

/**
 * Parses a comma-separated or array-valued query parameter into an array of
 * numeric ids. Express query parsing yields a string for a single value, an
 * array of strings for repeated params (e.g. `?branchIds=1&branchIds=2`), or
 * a comma-separated string (e.g. `?branchIds=1,2`).
 *
 * @param value - Raw query parameter value.
 */
function parseIdArray(value: unknown): number[] | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined
  }
  const raw = Array.isArray(value) ? value : String(value).split(',')
  const ids = raw.map((v) => Number(v)).filter((n) => Number.isFinite(n))
  return ids.length > 0 ? ids : undefined
}

/**
 * Validates that a set of item ids all reference existing InventoryItem rows.
 *
 * @param itemIds - Ids to validate.
 * @throws {ApiError} 400 if any id does not correspond to an existing item.
 */
async function assertItemsExist(itemIds: number[]): Promise<void> {
  const count = await prisma.inventoryItem.count({ where: { id: { in: itemIds } } })
  if (count !== itemIds.length) {
    throw new ApiError(400, `One or more itemIds do not reference existing inventory items`)
  }
}

/**
 * Validates that a set of branch ids all reference existing Branch rows.
 *
 * @param branchIds - Ids to validate.
 * @throws {ApiError} 400 if any id does not correspond to an existing branch.
 */
async function assertBranchesExist(branchIds: number[]): Promise<void> {
  const count = await prisma.branch.count({ where: { id: { in: branchIds } } })
  if (count !== branchIds.length) {
    throw new ApiError(400, `One or more branchIds do not reference existing branches`)
  }
}

/**
 * Lists usage records with pagination and optional filtering by date range,
 * branches, items, and regional offices (FR-003, FR-021, FR-022).
 *
 * @param filters - Raw filter values, typically sourced from `req.query`.
 */
export async function listUsageRecords(filters: UsageRecordFilters) {
  const { page, limit } = parsePagination(filters.page ?? DEFAULT_PAGE, filters.limit ?? DEFAULT_LIMIT)

  const branchIds = parseIdArray(filters.branchIds ?? filters.branchId)
  const itemIds = parseIdArray(filters.itemIds ?? filters.itemId)
  const regionalOfficeIds = parseIdArray(filters.regionalOfficeIds ?? filters.regionalOfficeId)

  const usageDate: Record<string, Date> = {}
  if (filters.startDate) usageDate.gte = new Date(String(filters.startDate))
  if (filters.endDate) usageDate.lte = new Date(String(filters.endDate))

  const where = {
    ...(branchIds ? { branchId: { in: branchIds } } : {}),
    ...(itemIds ? { itemId: { in: itemIds } } : {}),
    ...(Object.keys(usageDate).length > 0 ? { usageDate } : {}),
    ...(regionalOfficeIds ? { branch: { regionalOfficeId: { in: regionalOfficeIds } } } : {}),
  }

  const [records, total] = await Promise.all([
    prisma.usageRecord.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { usageDate: 'desc' },
      include: { item: true, branch: true },
    }),
    prisma.usageRecord.count({ where }),
  ])

  return {
    data: records,
    pagination: buildPaginationMeta(page, limit, total),
  }
}

/**
 * Fetches a single usage record by id, including its item and branch.
 *
 * @param id - Usage record primary key.
 * @throws {ApiError} 404 when no usage record exists with the given id.
 */
export async function getUsageRecordById(id: number) {
  const record = await prisma.usageRecord.findUnique({
    where: { id },
    include: { item: true, branch: true },
  })
  if (!record) {
    throw new ApiError(404, `Usage record ${id} not found`)
  }
  return record
}

/**
 * Creates a new usage record, validating that the referenced item and branch
 * exist (FR-003).
 *
 * @param input - Usage record fields.
 * @throws {ApiError} 400 when required fields are missing or itemId/branchId reference non-existent entities.
 */
export async function createUsageRecord(input: UsageRecordInput) {
  if (!input.itemId || !input.branchId || input.quantity === undefined || !input.usageDate) {
    throw new ApiError(400, 'itemId, branchId, quantity, and usageDate are required')
  }

  const [item, branch] = await Promise.all([
    prisma.inventoryItem.findUnique({ where: { id: input.itemId } }),
    prisma.branch.findUnique({ where: { id: input.branchId } }),
  ])
  if (!item) {
    throw new ApiError(400, `Item ${input.itemId} does not exist`)
  }
  if (!branch) {
    throw new ApiError(400, `Branch ${input.branchId} does not exist`)
  }

  return prisma.usageRecord.create({
    data: {
      itemId: input.itemId,
      branchId: input.branchId,
      quantity: input.quantity,
      usageDate: new Date(input.usageDate),
      notes: input.notes ?? null,
    },
  })
}

/**
 * Updates an existing usage record, re-validating item/branch references
 * when they are changed.
 *
 * @param id - Usage record primary key.
 * @param input - Fields to update.
 * @throws {ApiError} 404 if the record does not exist, 400 for missing/invalid fields.
 */
export async function updateUsageRecord(id: number, input: Partial<UsageRecordInput>) {
  const existing = await prisma.usageRecord.findUnique({ where: { id } })
  if (!existing) {
    throw new ApiError(404, `Usage record ${id} not found`)
  }

  if (input.quantity !== undefined && (typeof input.quantity !== 'number' || input.quantity < 0)) {
    throw new ApiError(400, 'quantity must be a non-negative number')
  }

  if (input.itemId) {
    const item = await prisma.inventoryItem.findUnique({ where: { id: input.itemId } })
    if (!item) {
      throw new ApiError(400, `Item ${input.itemId} does not exist`)
    }
  }
  if (input.branchId) {
    const branch = await prisma.branch.findUnique({ where: { id: input.branchId } })
    if (!branch) {
      throw new ApiError(400, `Branch ${input.branchId} does not exist`)
    }
  }

  return prisma.usageRecord.update({
    where: { id },
    data: {
      itemId: input.itemId ?? existing.itemId,
      branchId: input.branchId ?? existing.branchId,
      quantity: input.quantity ?? existing.quantity,
      usageDate: input.usageDate ? new Date(input.usageDate) : existing.usageDate,
      notes: input.notes ?? existing.notes,
    },
  })
}

/**
 * Deletes a usage record. Callers (routes) must enforce the admin-only
 * authorization rule (FR-024, FR-025) before invoking this function.
 *
 * @param id - Usage record primary key.
 * @throws {ApiError} 404 when no usage record exists with the given id.
 */
export async function deleteUsageRecord(id: number): Promise<void> {
  const existing = await prisma.usageRecord.findUnique({ where: { id } })
  if (!existing) {
    throw new ApiError(404, `Usage record ${id} not found`)
  }
  await prisma.usageRecord.delete({ where: { id } })
}

export { assertItemsExist, assertBranchesExist, parseIdArray }
