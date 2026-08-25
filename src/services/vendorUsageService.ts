import { prisma } from '../lib/prisma.js'
import { ApiError } from '../utils/apiError.js'

/**
 * Builds the vendor-wise usage analysis report for a single vendor
 * (FR-015): vendor details, a per-item breakdown with usage by branch, and
 * the vendor's total usage quantity across all its items.
 *
 * GET /api/vendors/:id/usage-analysis
 *
 * @param vendorId - Vendor primary key.
 * @throws {ApiError} 404 when no vendor exists with the given id.
 */
export async function getVendorUsageAnalysis(vendorId: number) {
  const vendor = await prisma.vendor.findUnique({ where: { id: vendorId } })
  if (!vendor) {
    throw new ApiError(404, `Vendor ${vendorId} not found`)
  }

  const records = await prisma.usageRecord.findMany({
    where: { item: { vendorId } },
    include: { item: true, branch: true },
  })

  const byItem = new Map<
    number,
    { itemId: number; itemName: string; totalQuantity: number; usageByBranch: Map<number, { branchId: number; branchName: string; quantity: number }> }
  >()

  let totalUsage = 0
  for (const record of records) {
    totalUsage += record.quantity
    const entry = byItem.get(record.itemId) ?? {
      itemId: record.itemId,
      itemName: record.item.name,
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

  return {
    vendor: { id: vendor.id, name: vendor.name },
    items: Array.from(byItem.values()).map((entry) => ({
      itemId: entry.itemId,
      itemName: entry.itemName,
      totalQuantity: entry.totalQuantity,
      usageByBranch: Array.from(entry.usageByBranch.values()),
    })),
    totalUsage,
  }
}
