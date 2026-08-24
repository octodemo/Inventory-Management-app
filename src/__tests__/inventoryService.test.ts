import { createInventoryHandlers } from '../services/inventoryService'

const createMockResponse = () => {
  const res = {
    status: jest.fn(),
    json: jest.fn(),
  }

  res.status.mockReturnValue(res)

  return res
}

describe('inventory handlers', () => {
  it('returns 400 when required fields are missing on update', async () => {
    const model = {
      findUnique: jest.fn(),
      update: jest.fn(),
    }

    const handlers = createInventoryHandlers(model)
    const req = {
      params: { id: '1' },
      body: {
        vendorId: 1,
        hierarchyId: 1,
        unit: 'PCS',
      },
    }
    const res = createMockResponse()

    await handlers.updateInventoryById(req as never, res as never)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Missing required fields: name, vendorId, hierarchyId, unit',
        status: 400,
      }),
    )
    expect(model.update).not.toHaveBeenCalled()
  })

  it('updates inventory item and returns 200', async () => {
    const updated = {
      id: 1,
      name: 'Blue Pen',
      description: 'Updated description',
      vendorId: 2,
      hierarchyId: 3,
      unit: 'PCS',
    }

    const model = {
      findUnique: jest.fn(),
      update: jest.fn().mockResolvedValue(updated),
    }

    const handlers = createInventoryHandlers(model)
    const req = {
      params: { id: '1' },
      body: {
        name: 'Blue Pen',
        description: 'Updated description',
        vendorId: 2,
        hierarchyId: 3,
        unit: 'PCS',
      },
    }
    const res = createMockResponse()

    await handlers.updateInventoryById(req as never, res as never)

    expect(model.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: {
        name: 'Blue Pen',
        description: 'Updated description',
        vendorId: 2,
        hierarchyId: 3,
        unit: 'PCS',
      },
    })
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(updated)
  })

  it('returns item details by id for edit flow', async () => {
    const item = {
      id: 5,
      name: 'A4 Paper',
      description: null,
      vendorId: 1,
      hierarchyId: 4,
      unit: 'REAM',
    }

    const model = {
      findUnique: jest.fn().mockResolvedValue(item),
      update: jest.fn(),
    }

    const handlers = createInventoryHandlers(model)
    const req = {
      params: { id: '5' },
    }
    const res = createMockResponse()

    await handlers.getInventoryById(req as never, res as never)

    expect(model.findUnique).toHaveBeenCalledWith({ where: { id: 5 } })
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(item)
  })
})
