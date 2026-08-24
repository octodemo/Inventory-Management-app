import { prisma } from '../lib/prisma.js'
import { ApiError } from '../utils/apiError.js'
import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  buildPaginationMeta,
  paginateArray,
  parsePagination,
  parseSort,
  sortRows,
} from '../utils/pagination.js'

/** Column metadata describing a report's tabular shape (FR-014). */
export interface ReportColumn {
  field: string
  label: string
  type: 'string' | 'number' | 'date'
}

/** Common filter/pagination/sort request body shared by all report endpoints. */
export interface ReportRequestBody {
  itemIds?: number[]
  branchIds?: number[]
  regionalOfficeIds?: number[]
  vendorIds?: number[]
  hierarchyIds?: number[]
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
  orderBy?: string
  direction?: 'asc' | 'desc'
}

/**
 * Validates that every id in `ids` corresponds to an existing row for the
 * given Prisma model, used to enforce the "invalid filter id" 400 responses
 * required by the multi-select report tasks (FR-011, FR-012, FR-013).
 *
 * @param ids - Ids supplied by the client for a given filter (e.g. itemIds).
 * @param count - Number of matching rows found in the database for those ids.
 * @param label - Human-readable name of the filter, used in the error message.
 * @throws {ApiError} 400 when `count` does not match `ids.length`.
 */
function assertAllIdsExist(ids: number[] | undefined, count: number, label: string): void {
  if (ids && count !== ids.length) {
    throw new ApiError(400, `One or more ${label} do not reference existing records`)
  }
}

/**
 * Validates filter id arrays (itemIds, branchIds, vendorIds, regionalOfficeIds,
 * hierarchyIds) against the database before running a report, returning 400
 * Bad Request when any id is invalid.
 *
 * @param body - Parsed report request body.
 */
async function validateFilterIds(body: ReportRequestBody): Promise<void> {
  const [itemCount, branchCount, vendorCount, officeCount, hierarchyCount] = await Promise.all([
    body.itemIds ? prisma.inventoryItem.count({ where: { id: { in: body.itemIds } } }) : Promise.resolve(0),
    body.branchIds ? prisma.branch.count({ where: { id: { in: body.branchIds } } }) : Promise.resolve(0),
    body.vendorIds ? prisma.vendor.count({ where: { id: { in: body.vendorIds } } }) : Promise.resolve(0),
    body.regionalOfficeIds
      ? prisma.regionalOffice.count({ where: { id: { in: body.regionalOfficeIds } } })
      : Promise.resolve(0),
    body.hierarchyIds
      ? prisma.itemHierarchy.count({ where: { id: { in: body.hierarchyIds } } })
      : Promise.resolve(0),
  ])

  assertAllIdsExist(body.itemIds, itemCount, 'itemIds')
  assertAllIdsExist(body.branchIds, branchCount, 'branchIds')
  assertAllIdsExist(body.vendorIds, vendorCount, 'vendorIds')
  assertAllIdsExist(body.regionalOfficeIds, officeCount, 'regionalOfficeIds')
  assertAllIdsExist(body.hierarchyIds, hierarchyCount, 'hierarchyIds')
}

/**
 * Fetches all UsageRecord rows matching the report filters, with the
 * relations (item -> vendor/hierarchy, branch -> regionalOffice) needed to
 * aggregate by every report dimension.
 *
 * @param body - Parsed report request body.
 */
async function fetchFilteredUsageRecords(body: ReportRequestBody) {
  const usageDate: Record<string, Date> = {}
  if (body.startDate) usageDate.gte = new Date(body.startDate)
  if (body.endDate) usageDate.lte = new Date(body.endDate)

  return prisma.usageRecord.findMany({
    where: {
      ...(body.itemIds ? { itemId: { in: body.itemIds } } : {}),
      ...(body.branchIds ? { branchId: { in: body.branchIds } } : {}),
      ...(Object.keys(usageDate).length > 0 ? { usageDate } : {}),
      ...(body.vendorIds || body.hierarchyIds
        ? {
            item: {
              ...(body.vendorIds ? { vendorId: { in: body.vendorIds } } : {}),
              ...(body.hierarchyIds ? { hierarchyId: { in: body.hierarchyIds } } : {}),
            },
          }
        : {}),
      ...(body.regionalOfficeIds ? { branch: { regionalOfficeId: { in: body.regionalOfficeIds } } } : {}),
    },
    include: {
      item: { include: { vendor: true, hierarchy: true } },
      branch: { include: { regionalOffice: true } },
    },
  })
}

/** Applies pagination + sorting to an aggregated row set and builds the final envelope. */
function paginateAndSort<T extends Record<string, unknown>>(
  rows: T[],
  columns: ReportColumn[],
  body: ReportRequestBody,
  sortableColumns: string[]
) {
  const { orderBy, direction } = parseSort(body.orderBy, body.direction, sortableColumns)
  const sorted = sortRows(rows, orderBy, direction)
  const { page, limit } = parsePagination(body.page ?? DEFAULT_PAGE, body.limit ?? DEFAULT_LIMIT)
  const paged = paginateArray(sorted, page, limit)

  return {
    data: paged,
    columns,
    pagination: buildPaginationMeta(page, limit, sorted.length),
  }
}

/**
 * Generates the item-wise usage report (FR-003, FR-013): usage totals per
 * inventory item, broken down by branch (POST /api/reports/item-wise).
 *
 * @param body - Report filters, pagination, and sort options.
 */
export async function generateItemWiseReport(body: ReportRequestBody) {
  await validateFilterIds(body)
  const records = await fetchFilteredUsageRecords(body)

  const byItem = new Map<
    number,
    {
      itemId: number
      itemName: string
      vendor: string
      totalQuantity: number
      usageByBranch: Map<number, { branchId: number; branchName: string; quantity: number }>
    }
  >()

  for (const record of records) {
    const entry = byItem.get(record.itemId) ?? {
      itemId: record.itemId,
      itemName: record.item.name,
      vendor: record.item.vendor.name,
      totalQuantity: 0,
      usageByBranch: new Map(),
    }
    entry.totalQuantity += record.quantity
    const branchEntry = entry.usageByBranch.get(record.branchId) ?? {
      branchId: record.branchId,
      branchName: record.branch.name,
      quantity: 0,
    }
    branchEntry.quantity += record.quantity
    entry.usageByBranch.set(record.branchId, branchEntry)
    byItem.set(record.itemId, entry)
  }

  const rows = Array.from(byItem.values()).map((entry) => ({
    itemId: entry.itemId,
    itemName: entry.itemName,
    vendor: entry.vendor,
    totalQuantity: entry.totalQuantity,
    usageByBranch: Array.from(entry.usageByBranch.values()),
  }))

  const columns: ReportColumn[] = [
    { field: 'itemName', label: 'Item', type: 'string' },
    { field: 'vendor', label: 'Vendor', type: 'string' },
    { field: 'totalQuantity', label: 'Total Quantity', type: 'number' },
  ]

  return paginateAndSort(rows, columns, body, ['itemName', 'vendor', 'totalQuantity'])
}

/**
 * Generates the branch-wise usage report (FR-011, FR-021), including
 * per-branch summary statistics and an overall summary across all selected
 * branches (POST /api/reports/branch-wise).
 *
 * @param body - Report filters, pagination, and sort options.
 */
export async function generateBranchWiseReport(body: ReportRequestBody) {
  await validateFilterIds(body)
  const records = await fetchFilteredUsageRecords(body)

  const byBranch = new Map<
    number,
    {
      branchId: number
      branchName: string
      regionalOffice: string
      totalQuantity: number
      items: Map<number, { itemId: number; itemName: string; quantity: number }>
    }
  >()

  for (const record of records) {
    const entry = byBranch.get(record.branchId) ?? {
      branchId: record.branchId,
      branchName: record.branch.name,
      regionalOffice: record.branch.regionalOffice.name,
      totalQuantity: 0,
      items: new Map(),
    }
    entry.totalQuantity += record.quantity
    const itemEntry = entry.items.get(record.itemId) ?? {
      itemId: record.itemId,
      itemName: record.item.name,
      quantity: 0,
    }
    itemEntry.quantity += record.quantity
    entry.items.set(record.itemId, itemEntry)
    byBranch.set(record.branchId, entry)
  }

  const rows = Array.from(byBranch.values()).map((entry) => ({
    branchId: entry.branchId,
    branchName: entry.branchName,
    regionalOffice: entry.regionalOffice,
    totalQuantity: entry.totalQuantity,
    itemCount: entry.items.size,
    items: Array.from(entry.items.values()),
  }))

  const columns: ReportColumn[] = [
    { field: 'branchName', label: 'Branch', type: 'string' },
    { field: 'regionalOffice', label: 'Regional Office', type: 'string' },
    { field: 'totalQuantity', label: 'Total Quantity', type: 'number' },
    { field: 'itemCount', label: 'Item Count', type: 'number' },
  ]

  const result = paginateAndSort(rows, columns, body, [
    'branchName',
    'regionalOffice',
    'totalQuantity',
    'itemCount',
  ])

  return {
    ...result,
    summary: {
      totalQuantity: rows.reduce((sum, row) => sum + row.totalQuantity, 0),
      branchCount: rows.length,
    },
  }
}

/**
 * Generates the regional-office-wise usage report (FR-012, FR-022),
 * aggregating usage across all branches within each regional office, with a
 * breakdown by branch (POST /api/reports/regional-office-wise).
 *
 * @param body - Report filters, pagination, and sort options.
 */
export async function generateRegionalOfficeWiseReport(body: ReportRequestBody) {
  await validateFilterIds(body)
  const records = await fetchFilteredUsageRecords(body)

  const byOffice = new Map<
    number,
    {
      regionalOfficeId: number
      regionalOfficeName: string
      totalQuantity: number
      branches: Map<number, { branchId: number; branchName: string; quantity: number }>
    }
  >()

  for (const record of records) {
    const officeId = record.branch.regionalOfficeId
    const entry = byOffice.get(officeId) ?? {
      regionalOfficeId: officeId,
      regionalOfficeName: record.branch.regionalOffice.name,
      totalQuantity: 0,
      branches: new Map(),
    }
    entry.totalQuantity += record.quantity
    const branchEntry = entry.branches.get(record.branchId) ?? {
      branchId: record.branchId,
      branchName: record.branch.name,
      quantity: 0,
    }
    branchEntry.quantity += record.quantity
    entry.branches.set(record.branchId, branchEntry)
    byOffice.set(officeId, entry)
  }

  const rows = Array.from(byOffice.values()).map((entry) => ({
    regionalOfficeId: entry.regionalOfficeId,
    regionalOfficeName: entry.regionalOfficeName,
    totalQuantity: entry.totalQuantity,
    branchCount: entry.branches.size,
    branches: Array.from(entry.branches.values()),
  }))

  const columns: ReportColumn[] = [
    { field: 'regionalOfficeName', label: 'Regional Office', type: 'string' },
    { field: 'totalQuantity', label: 'Total Quantity', type: 'number' },
    { field: 'branchCount', label: 'Branch Count', type: 'number' },
  ]

  const result = paginateAndSort(rows, columns, body, ['regionalOfficeName', 'totalQuantity', 'branchCount'])

  return {
    ...result,
    summary: {
      totalQuantity: rows.reduce((sum, row) => sum + row.totalQuantity, 0),
      regionalOfficeCount: rows.length,
    },
  }
}

/**
 * Computes the nesting depth (1-based level) of a hierarchy node by walking
 * up its `parentId` chain, used to label rows in the hierarchy-wise report.
 *
 * @param hierarchyId - Node to compute the level for.
 * @param cache - Memoization map shared across a single report generation call.
 */
async function computeHierarchyLevel(hierarchyId: number, cache: Map<number, number>): Promise<number> {
  if (cache.has(hierarchyId)) {
    return cache.get(hierarchyId) as number
  }
  const node = await prisma.itemHierarchy.findUnique({ where: { id: hierarchyId } })
  if (!node) {
    cache.set(hierarchyId, 1)
    return 1
  }
  const level = node.parentId ? (await computeHierarchyLevel(node.parentId, cache)) + 1 : 1
  cache.set(hierarchyId, level)
  return level
}

/**
 * Generates the hierarchy-wise usage report (FR-023), aggregating usage by
 * item-hierarchy node with item-level drill-down details within each node
 * (POST /api/reports/hierarchy-wise).
 *
 * @param body - Report filters, pagination, and sort options.
 */
export async function generateHierarchyWiseReport(body: ReportRequestBody) {
  await validateFilterIds(body)
  const records = await fetchFilteredUsageRecords(body)

  const byHierarchy = new Map<
    number,
    {
      hierarchyId: number
      hierarchyName: string
      totalQuantity: number
      items: Map<number, { itemId: number; itemName: string; quantity: number }>
    }
  >()

  for (const record of records) {
    const hierarchyId = record.item.hierarchyId
    const entry = byHierarchy.get(hierarchyId) ?? {
      hierarchyId,
      hierarchyName: record.item.hierarchy.name,
      totalQuantity: 0,
      items: new Map(),
    }
    entry.totalQuantity += record.quantity
    const itemEntry = entry.items.get(record.itemId) ?? {
      itemId: record.itemId,
      itemName: record.item.name,
      quantity: 0,
    }
    itemEntry.quantity += record.quantity
    entry.items.set(record.itemId, itemEntry)
    byHierarchy.set(hierarchyId, entry)
  }

  const levelCache = new Map<number, number>()
  const rows = []
  for (const entry of byHierarchy.values()) {
    rows.push({
      hierarchyId: entry.hierarchyId,
      hierarchyName: entry.hierarchyName,
      level: await computeHierarchyLevel(entry.hierarchyId, levelCache),
      totalQuantity: entry.totalQuantity,
      items: Array.from(entry.items.values()),
    })
  }

  const columns: ReportColumn[] = [
    { field: 'hierarchyName', label: 'Hierarchy Node', type: 'string' },
    { field: 'level', label: 'Level', type: 'number' },
    { field: 'totalQuantity', label: 'Total Quantity', type: 'number' },
  ]

  return paginateAndSort(rows, columns, body, ['hierarchyName', 'level', 'totalQuantity'])
}

/**
 * Generates the vendor-wise usage report (FR-015), aggregating usage by
 * vendor with item-level drill-down details within each vendor
 * (POST /api/reports/vendor-wise).
 *
 * @param body - Report filters, pagination, and sort options.
 */
export async function generateVendorWiseReport(body: ReportRequestBody) {
  await validateFilterIds(body)
  const records = await fetchFilteredUsageRecords(body)

  const byVendor = new Map<
    number,
    {
      vendorId: number
      vendorName: string
      totalQuantity: number
      items: Map<
        number,
        {
          itemId: number
          itemName: string
          totalQuantity: number
          usageByBranch: Map<number, { branchId: number; branchName: string; quantity: number }>
        }
      >
    }
  >()

  for (const record of records) {
    const vendorId = record.item.vendorId
    const entry = byVendor.get(vendorId) ?? {
      vendorId,
      vendorName: record.item.vendor.name,
      totalQuantity: 0,
      items: new Map(),
    }
    entry.totalQuantity += record.quantity

    const itemEntry = entry.items.get(record.itemId) ?? {
      itemId: record.itemId,
      itemName: record.item.name,
      totalQuantity: 0,
      usageByBranch: new Map(),
    }
    itemEntry.totalQuantity += record.quantity
    const branchEntry = itemEntry.usageByBranch.get(record.branchId) ?? {
      branchId: record.branchId,
      branchName: record.branch.name,
      quantity: 0,
    }
    branchEntry.quantity += record.quantity
    itemEntry.usageByBranch.set(record.branchId, branchEntry)
    entry.items.set(record.itemId, itemEntry)

    byVendor.set(vendorId, entry)
  }

  const rows = Array.from(byVendor.values()).map((entry) => ({
    vendorId: entry.vendorId,
    vendorName: entry.vendorName,
    totalQuantity: entry.totalQuantity,
    items: Array.from(entry.items.values()).map((item) => ({
      itemId: item.itemId,
      itemName: item.itemName,
      totalQuantity: item.totalQuantity,
      usageByBranch: Array.from(item.usageByBranch.values()),
    })),
  }))

  const columns: ReportColumn[] = [
    { field: 'vendorName', label: 'Vendor', type: 'string' },
    { field: 'totalQuantity', label: 'Total Quantity', type: 'number' },
  ]

  return paginateAndSort(rows, columns, body, ['vendorName', 'totalQuantity'])
}
