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

  it('returns 400 when inventory id is invalid on update', async () => {
    const model = {
      findUnique: jest.fn(),
      update: jest.fn(),
    }

    const handlers = createInventoryHandlers(model)
    const req = {
      params: { id: 'abc' },
      body: {
        name: 'Blue Pen',
        vendorId: 2,
        hierarchyId: 3,
        unit: 'PCS',
      },
    }
    const res = createMockResponse()

    await handlers.updateInventoryById(req as never, res as never)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Invalid inventory id',
        status: 400,
      }),
    )
    expect(model.update).not.toHaveBeenCalled()
  })

  it('returns 400 when vendorId or hierarchyId is non-numeric on update', async () => {
    const model = {
      findUnique: jest.fn(),
      update: jest.fn(),
    }

    const handlers = createInventoryHandlers(model)
    const req = {
      params: { id: '1' },
      body: {
        name: 'Blue Pen',
        vendorId: 'abc',
        hierarchyId: 3,
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

  it('returns 404 when update fails with not found error', async () => {
    const model = {
      findUnique: jest.fn(),
      update: jest.fn().mockRejectedValue({ code: 'P2025' }),
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

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Inventory item not found',
        status: 404,
      }),
    )
  })

  it('returns inventory item details when id is valid', async () => {
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

  it('returns 400 when inventory id is invalid on get', async () => {
    const model = {
      findUnique: jest.fn(),
      update: jest.fn(),
    }

    const handlers = createInventoryHandlers(model)
    const req = {
      params: { id: '1e2' },
    }
    const res = createMockResponse()

    await handlers.getInventoryById(req as never, res as never)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Invalid inventory id',
        status: 400,
      }),
    )
    expect(model.findUnique).not.toHaveBeenCalled()
  })

  it('returns 404 when inventory item does not exist', async () => {
    const model = {
      findUnique: jest.fn().mockResolvedValue(null),
      update: jest.fn(),
    }

    const handlers = createInventoryHandlers(model)
    const req = {
      params: { id: '5' },
    }
    const res = createMockResponse()

    await handlers.getInventoryById(req as never, res as never)

    expect(model.findUnique).toHaveBeenCalledWith({ where: { id: 5 } })
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Inventory item not found',
        status: 404,
      }),
    )
  })
})
