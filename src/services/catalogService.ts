/**
 * Domain services for inventory catalogue master data.  The small Prisma-facing
 * interfaces make the services independently testable and keep Express out of
 * business-rule code.
 */

export class CatalogError extends Error {
  constructor(
    message: string,
    public readonly status: number = 400,
  ) {
    super(message)
    this.name = 'CatalogError'
  }
}

type Delegate = {
  create(args: unknown): Promise<any>
  findUnique(args: unknown): Promise<any>
  findMany(args: unknown): Promise<any[]>
  findFirst(args: unknown): Promise<any>
  findManyAndCount?: never
  count(args?: unknown): Promise<number>
  update(args: unknown): Promise<any>
  delete(args: unknown): Promise<any>
}

export interface CatalogPrisma {
  vendor: Delegate
  inventoryItem: Delegate
  itemHierarchy: Delegate
  itemRate: Delegate
}

export interface Pagination {
  page?: unknown
  limit?: unknown
}

export interface InventoryInput {
  name?: unknown
  description?: unknown
  vendorId?: unknown
  hierarchyId?: unknown
  unit?: unknown
}

export interface VendorInput {
  name?: unknown
  contactName?: unknown
  contactEmail?: unknown
  contactPhone?: unknown
  address?: unknown
}

export interface HierarchyInput {
  name?: unknown
  parentId?: unknown
}

export interface RateInput {
  itemId?: unknown
  rate?: unknown
  effectiveFrom?: unknown
  effectiveTo?: unknown
}

const detailInclude = { vendor: true, hierarchy: true }

/** Normalises externally supplied numeric IDs without accepting partial numbers. */
export function toId(value: unknown, field = 'id'): number {
  const parsed = typeof value === 'number' ? value : Number(value)
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new CatalogError(`${field} must be a positive integer`)
  }
  return parsed
}

/** Bounds public pagination values to prevent unbounded catalogue queries. */
export function getPagination(input: Pagination = {}) {
  const page = Math.max(1, Number(input.page) || 1)
  const limit = Math.min(100, Math.max(1, Number(input.limit) || 20))
  return { page, limit, skip: (page - 1) * limit }
}

function requiredText(value: unknown, field: string): string {
  if (typeof value !== 'string' || !value.trim()) {
    throw new CatalogError(`${field} is required`)
  }
  return value.trim()
}

function optionalText(value: unknown): string | null {
  if (value === undefined || value === null || value === '') return null
  return typeof value === 'string' ? value.trim() : String(value)
}

function validDate(value: unknown, field: string): Date {
  const date = new Date(String(value))
  if (Number.isNaN(date.getTime())) throw new CatalogError(`${field} must be a valid date`)
  return date
}

function isForeignKeyError(error: unknown): boolean {
  return typeof error === 'object' && error !== null && (error as { code?: string }).code === 'P2003'
}

export class VendorService {
  constructor(private readonly prisma: CatalogPrisma) {}

  /** Creates a vendor after enforcing its mandatory name and email format. */
  async create(input: VendorInput) {
    return this.prisma.vendor.create({ data: this.data(input) })
  }

  /** Returns a vendor and its inventory items, or a consistent 404 response. */
  async get(id: unknown) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { id: toId(id) },
      include: { items: true },
    })
    if (!vendor) throw new CatalogError('Vendor not found', 404)
    return vendor
  }

  /** Lists vendors with bounded pagination and case-insensitive name search. */
  async list(query: Pagination & { search?: unknown }) {
    const { page, limit, skip } = getPagination(query)
    const search = typeof query.search === 'string' ? query.search.trim() : ''
    const where = search ? { name: { contains: search } } : {}
    const [data, total] = await Promise.all([
      this.prisma.vendor.findMany({ where, skip, take: limit, orderBy: { name: 'asc' } }),
      this.prisma.vendor.count({ where }),
    ])
    return { data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } }
  }

  /** Replaces editable vendor details. */
  async update(id: unknown, input: VendorInput) {
    await this.get(id)
    return this.prisma.vendor.update({ where: { id: toId(id) }, data: this.data(input) })
  }

  /** Deletes a vendor only when no inventory item references it. */
  async delete(id: unknown) {
    const vendorId = toId(id)
    await this.get(vendorId)
    const items = await this.prisma.inventoryItem.count({ where: { vendorId } })
    if (items > 0) throw new CatalogError('Vendor cannot be deleted while inventory items are assigned', 409)
    await this.prisma.vendor.delete({ where: { id: vendorId } })
  }

  private data(input: VendorInput) {
    const contactEmail = optionalText(input.contactEmail)
    if (contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
      throw new CatalogError('contactEmail must be a valid email address')
    }
    return {
      name: requiredText(input.name, 'name'),
      contactName: optionalText(input.contactName),
      contactEmail,
      contactPhone: optionalText(input.contactPhone),
      address: optionalText(input.address),
    }
  }
}

export class InventoryService {
  constructor(private readonly prisma: CatalogPrisma) {}

  /** Creates an item only when its required vendor and hierarchy exist. */
  async create(input: InventoryInput) {
    const data = await this.data(input)
    return this.prisma.inventoryItem.create({ data, include: detailInclude })
  }

  /** Retrieves an inventory item with its display relationships. */
  async get(id: unknown) {
    const item = await this.prisma.inventoryItem.findUnique({
      where: { id: toId(id) },
      include: detailInclude,
    })
    if (!item) throw new CatalogError('Inventory item not found', 404)
    return item
  }

  /** Lists inventory with its vendor and category and optional filters. */
  async list(query: Pagination & { vendorId?: unknown; hierarchyId?: unknown; search?: unknown }) {
    const { page, limit, skip } = getPagination(query)
    const filters: Record<string, unknown> = {}
    if (query.vendorId !== undefined && query.vendorId !== '') filters.vendorId = toId(query.vendorId, 'vendorId')
    if (query.hierarchyId !== undefined && query.hierarchyId !== '') filters.hierarchyId = toId(query.hierarchyId, 'hierarchyId')
    if (typeof query.search === 'string' && query.search.trim()) {
      filters.OR = [
        { name: { contains: query.search.trim() } },
        { description: { contains: query.search.trim() } },
      ]
    }
    const [data, total] = await Promise.all([
      this.prisma.inventoryItem.findMany({ where: filters, include: detailInclude, skip, take: limit, orderBy: { name: 'asc' } }),
      this.prisma.inventoryItem.count({ where: filters }),
    ])
    return { data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } }
  }

  /** Updates every required inventory master field. */
  async update(id: unknown, input: InventoryInput) {
    const itemId = toId(id)
    await this.get(itemId)
    const data = await this.data(input)
    return this.prisma.inventoryItem.update({ where: { id: itemId }, data, include: detailInclude })
  }

  /**
   * Deletes an item. A future UsageRecord foreign key is converted to the
   * documented conflict response instead of exposing a database error.
   */
  async delete(id: unknown) {
    const itemId = toId(id)
    await this.get(itemId)
    try {
      await this.prisma.inventoryItem.delete({ where: { id: itemId } })
    } catch (error) {
      if (isForeignKeyError(error)) {
        throw new CatalogError('Inventory item cannot be deleted while usage records exist', 409)
      }
      throw error
    }
  }

  private async data(input: InventoryInput) {
    const vendorId = toId(input.vendorId, 'vendorId')
    const hierarchyId = toId(input.hierarchyId, 'hierarchyId')
    const [vendor, hierarchy] = await Promise.all([
      this.prisma.vendor.findUnique({ where: { id: vendorId } }),
      this.prisma.itemHierarchy.findUnique({ where: { id: hierarchyId } }),
    ])
    if (!vendor) throw new CatalogError('Vendor not found')
    if (!hierarchy) throw new CatalogError('Item hierarchy not found')
    return {
      name: requiredText(input.name, 'name'),
      description: optionalText(input.description),
      vendorId,
      hierarchyId,
      unit: requiredText(input.unit, 'unit'),
    }
  }
}

export class HierarchyService {
  constructor(private readonly prisma: CatalogPrisma) {}

  /** Creates a root or child hierarchy node while enforcing the four-level limit. */
  async create(input: HierarchyInput) {
    const data = await this.data(input)
    return this.prisma.itemHierarchy.create({ data })
  }

  /** Returns a node with its immediate parent and children. */
  async get(id: unknown) {
    const node = await this.prisma.itemHierarchy.findUnique({
      where: { id: toId(id) },
      include: { parent: true, children: true },
    })
    if (!node) throw new CatalogError('Item hierarchy not found', 404)
    return node
  }

  /** Builds a nested tree from the catalogue's flat hierarchy records. */
  async tree() {
    const nodes = await this.prisma.itemHierarchy.findMany({ orderBy: { name: 'asc' } })
    const byId = new Map(nodes.map((node) => [node.id, { ...node, children: [] as any[] }]))
    const roots: any[] = []
    for (const node of byId.values()) {
      if (node.parentId && byId.has(node.parentId)) byId.get(node.parentId)!.children.push(node)
      else roots.push(node)
    }
    return roots
  }

  /** Updates a node and prevents it from becoming its own ancestor. */
  async update(id: unknown, input: HierarchyInput) {
    const nodeId = toId(id)
    await this.get(nodeId)
    const data = await this.data(input, nodeId)
    return this.prisma.itemHierarchy.update({ where: { id: nodeId }, data })
  }

  /** Deletes hierarchy nodes only after children and item references are removed. */
  async delete(id: unknown) {
    const nodeId = toId(id)
    await this.get(nodeId)
    const [children, items] = await Promise.all([
      this.prisma.itemHierarchy.count({ where: { parentId: nodeId } }),
      this.prisma.inventoryItem.count({ where: { hierarchyId: nodeId } }),
    ])
    if (children || items) throw new CatalogError('Item hierarchy cannot be deleted while it has children or inventory items', 409)
    await this.prisma.itemHierarchy.delete({ where: { id: nodeId } })
  }

  private async data(input: HierarchyInput, nodeId?: number) {
    const parentId = input.parentId === undefined || input.parentId === null || input.parentId === ''
      ? null
      : toId(input.parentId, 'parentId')
    if (parentId !== null) {
      if (nodeId === parentId) throw new CatalogError('A hierarchy node cannot be its own parent')
      let parentDepth = 0
      let cursor = await this.prisma.itemHierarchy.findUnique({ where: { id: parentId } })
      if (!cursor) throw new CatalogError('Parent hierarchy not found')
      while (cursor) {
        if (cursor.id === nodeId) throw new CatalogError('A hierarchy node cannot be assigned to one of its descendants')
        parentDepth += 1
        if (!cursor.parentId) break
        cursor = await this.prisma.itemHierarchy.findUnique({ where: { id: cursor.parentId } })
        if (!cursor) throw new CatalogError('Parent hierarchy not found')
      }
      // parentDepth is the number of existing levels through the candidate
      // parent. Adding a node makes it parentDepth + 1, capped at four.
      if (parentDepth >= 4) throw new CatalogError('Maximum hierarchy nesting depth of 4 exceeded')
    }
    return { name: requiredText(input.name, 'name'), parentId }
  }
}

export class RateService {
  constructor(private readonly prisma: CatalogPrisma) {}

  /** Creates a rate after validating its date range and absence of overlap. */
  async create(input: RateInput) {
    const data = await this.data(input)
    await this.assertNoOverlap(data.itemId, data.effectiveFrom, data.effectiveTo)
    return this.prisma.itemRate.create({ data, include: { item: true } })
  }

  /** Retrieves one item rate with its inventory item. */
  async get(id: unknown) {
    const rate = await this.prisma.itemRate.findUnique({ where: { id: toId(id) }, include: { item: true } })
    if (!rate) throw new CatalogError('Item rate not found', 404)
    return rate
  }

  /** Returns chronological rate history, optionally for one inventory item. */
  async list(query: Pagination & { itemId?: unknown }) {
    const { page, limit, skip } = getPagination(query)
    const where = query.itemId === undefined || query.itemId === '' ? {} : { itemId: toId(query.itemId, 'itemId') }
    const [data, total] = await Promise.all([
      this.prisma.itemRate.findMany({ where, include: { item: true }, skip, take: limit, orderBy: { effectiveFrom: 'desc' } }),
      this.prisma.itemRate.count({ where }),
    ])
    return { data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } }
  }

  /** Updates an existing rate while excluding it from overlap validation. */
  async update(id: unknown, input: RateInput) {
    const rateId = toId(id)
    await this.get(rateId)
    const data = await this.data(input)
    await this.assertNoOverlap(data.itemId, data.effectiveFrom, data.effectiveTo, rateId)
    return this.prisma.itemRate.update({ where: { id: rateId }, data, include: { item: true } })
  }

  /** Deletes an item rate. */
  async delete(id: unknown) {
    const rateId = toId(id)
    await this.get(rateId)
    await this.prisma.itemRate.delete({ where: { id: rateId } })
  }

  private async data(input: RateInput) {
    const itemId = toId(input.itemId, 'itemId')
    const item = await this.prisma.inventoryItem.findUnique({ where: { id: itemId } })
    if (!item) throw new CatalogError('Inventory item not found')
    const rate = Number(input.rate)
    if (!Number.isFinite(rate) || rate <= 0) throw new CatalogError('rate must be greater than zero')
    const effectiveFrom = validDate(input.effectiveFrom, 'effectiveFrom')
    const effectiveTo = input.effectiveTo === undefined || input.effectiveTo === null || input.effectiveTo === ''
      ? null
      : validDate(input.effectiveTo, 'effectiveTo')
    if (effectiveTo && effectiveTo < effectiveFrom) throw new CatalogError('effectiveTo must be on or after effectiveFrom')
    return { itemId, rate, effectiveFrom, effectiveTo }
  }

  private async assertNoOverlap(itemId: number, start: Date, end: Date | null, excludedId?: number) {
    const conditions: Record<string, unknown>[] = [
      { OR: [{ effectiveTo: null }, { effectiveTo: { gte: start } }] },
    ]
    if (end) conditions.push({ effectiveFrom: { lte: end } })
    if (excludedId) conditions.push({ id: { not: excludedId } })
    const overlap = await this.prisma.itemRate.findFirst({ where: { itemId, AND: conditions } })
    if (overlap) throw new CatalogError('Rate effective dates overlap an existing rate for this item')
  }
}
