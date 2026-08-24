import { prisma } from '../lib/prisma.js'

/**
 * Minimal read-only listing of item hierarchy nodes, used to populate
 * hierarchy dropdowns/filters in the Reports UI (FR-023).
 *
 * NOTE: Full ItemHierarchy CRUD (tree management) is owned by
 * 14/15/16/17-BACKEND-hierarchy-*-api, which are outside this batch's scope.
 *
 * @param limit - Maximum number of nodes to return.
 */
export async function listItemHierarchiesMinimal(limit = 200) {
  return prisma.itemHierarchy.findMany({
    take: limit,
    orderBy: { name: 'asc' },
    select: { id: true, name: true, parentId: true },
  })
}
