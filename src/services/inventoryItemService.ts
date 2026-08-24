import { prisma } from '../lib/prisma.js'

/**
 * Minimal read-only listing of inventory items, used to populate item
 * dropdowns/filters in the Usage and Reports UI (FR-013).
 *
 * NOTE: This is intentionally a bare list (no create/update/delete, no
 * vendor/hierarchy filtering, no search). Full InventoryItem CRUD is owned by
 * 10/11/12/13-BACKEND-inventory-*-api, which are outside this batch's scope.
 *
 * @param limit - Maximum number of items to return (defaults to 200, enough
 * for the seeded catalog).
 */
export async function listInventoryItemsMinimal(limit = 200) {
  return prisma.inventoryItem.findMany({
    take: limit,
    orderBy: { name: 'asc' },
    select: { id: true, name: true, unit: true, vendorId: true, hierarchyId: true },
  })
}
