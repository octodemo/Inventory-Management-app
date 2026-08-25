import {
  CatalogError,
  type CatalogPrisma,
  HierarchyService,
  InventoryService,
  RateService,
  VendorService,
} from '../services/catalogService'

const delegate = () => ({
  create: jest.fn(),
  findUnique: jest.fn(),
  findMany: jest.fn(),
  findFirst: jest.fn(),
  count: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
})

const prisma = (): CatalogPrisma => ({
  vendor: delegate(),
  inventoryItem: delegate(),
  itemHierarchy: delegate(),
  itemRate: delegate(),
}) as unknown as CatalogPrisma

describe('InventoryService', () => {
  it('requires all mandatory fields before creating an item', async () => {
    await expect(new InventoryService(prisma()).create({ name: 'Pen' }))
      .rejects.toEqual(expect.objectContaining<Partial<CatalogError>>({ message: 'vendorId must be a positive integer', status: 400 }))
  })

  it('returns a conflict when a usage-record foreign key prevents deletion', async () => {
    const client = prisma()
    ;(client.inventoryItem.findUnique as jest.Mock).mockResolvedValue({ id: 4 })
    ;(client.inventoryItem.delete as jest.Mock).mockRejectedValue({ code: 'P2003' })

    await expect(new InventoryService(client).delete(4))
      .rejects.toEqual(expect.objectContaining<Partial<CatalogError>>({ status: 409 }))
  })

  it('includes vendor and hierarchy details in an item list', async () => {
    const client = prisma()
    ;(client.inventoryItem.findMany as jest.Mock).mockResolvedValue([{ id: 1, vendor: { name: 'Office Supplies Co' }, hierarchy: { name: 'Pens' } }])
    ;(client.inventoryItem.count as jest.Mock).mockResolvedValue(1)

    await expect(new InventoryService(client).list({ vendorId: '1', search: 'pen' }))
      .resolves.toMatchObject({ data: [{ vendor: { name: 'Office Supplies Co' }, hierarchy: { name: 'Pens' } }], pagination: { page: 1, limit: 20, total: 1 } })
  })
})

describe('HierarchyService', () => {
  it('rejects creating a fifth hierarchy level', async () => {
    const client = prisma()
    ;(client.itemHierarchy.findUnique as jest.Mock)
      .mockResolvedValueOnce({ id: 4, parentId: 3 })
      .mockResolvedValueOnce({ id: 3, parentId: 2 })
      .mockResolvedValueOnce({ id: 2, parentId: 1 })
      .mockResolvedValueOnce({ id: 1, parentId: null })

    await expect(new HierarchyService(client).create({ name: 'Too deep', parentId: 4 }))
      .rejects.toEqual(expect.objectContaining<Partial<CatalogError>>({ status: 400, message: 'Maximum hierarchy nesting depth of 4 exceeded' }))
  })

  it('creates a nested tree from flat hierarchy records', async () => {
    const client = prisma()
    ;(client.itemHierarchy.findMany as jest.Mock).mockResolvedValue([
      { id: 1, name: 'Writing', parentId: null },
      { id: 2, name: 'Pens', parentId: 1 },
    ])

    await expect(new HierarchyService(client).tree()).resolves.toEqual([
      { id: 1, name: 'Writing', parentId: null, children: [{ id: 2, name: 'Pens', parentId: 1, children: [] }] },
    ])
  })
})

describe('RateService', () => {
  it('rejects overlapping effective rate ranges for an item', async () => {
    const client = prisma()
    ;(client.inventoryItem.findUnique as jest.Mock).mockResolvedValue({ id: 1 })
    ;(client.itemRate.findFirst as jest.Mock).mockResolvedValue({ id: 3 })

    await expect(new RateService(client).create({ itemId: 1, rate: 10, effectiveFrom: '2026-06-01', effectiveTo: '2026-12-01' }))
      .rejects.toEqual(expect.objectContaining<Partial<CatalogError>>({ status: 400, message: 'Rate effective dates overlap an existing rate for this item' }))
  })

  it('allows contiguous, non-overlapping rate ranges', async () => {
    const client = prisma()
    ;(client.inventoryItem.findUnique as jest.Mock).mockResolvedValue({ id: 1 })
    ;(client.itemRate.findFirst as jest.Mock).mockResolvedValue(null)
    ;(client.itemRate.create as jest.Mock).mockResolvedValue({ id: 4 })

    await expect(new RateService(client).create({ itemId: 1, rate: 12, effectiveFrom: '2026-07-01', effectiveTo: null }))
      .resolves.toEqual({ id: 4 })
  })
})

describe('VendorService', () => {
  it('validates vendor contact email format', async () => {
    await expect(new VendorService(prisma()).create({ name: 'Vendor A', contactEmail: 'invalid' }))
      .rejects.toEqual(expect.objectContaining<Partial<CatalogError>>({ message: 'contactEmail must be a valid email address', status: 400 }))
  })

  it('blocks deleting a vendor assigned to an inventory item', async () => {
    const client = prisma()
    ;(client.vendor.findUnique as jest.Mock).mockResolvedValue({ id: 1, items: [] })
    ;(client.inventoryItem.count as jest.Mock).mockResolvedValue(1)

    await expect(new VendorService(client).delete(1))
      .rejects.toEqual(expect.objectContaining<Partial<CatalogError>>({ status: 409 }))
  })
})
