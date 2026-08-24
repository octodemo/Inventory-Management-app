import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'

interface InventoryUpdateInput {
  name: string
  description?: string
  vendorId: number
  hierarchyId: number
  unit: string
}

interface InventoryRecord extends InventoryUpdateInput {
  id: number
  createdAt?: Date
  updatedAt?: Date
}

interface InventoryModel {
  findUnique(args: { where: { id: number } }): Promise<InventoryRecord | null>
  update(args: { where: { id: number }; data: InventoryUpdateInput }): Promise<InventoryRecord>
}

let inventoryModel: InventoryModel | null = null
let defaultHandlers: ReturnType<typeof createInventoryHandlers> | null = null
let prismaClient: PrismaClient | null = null

const getInventoryModel = () => {
  if (!inventoryModel) {
    if (!prismaClient) {
      prismaClient = new PrismaClient()
    }

    inventoryModel = (prismaClient as unknown as { inventoryItem: InventoryModel }).inventoryItem
  }

  return inventoryModel
}

const parseInventoryId = (id: string) => {
  if (!/^\d+$/.test(id)) {
    return null
  }

  const parsed = Number(id)
  if (!Number.isSafeInteger(parsed) || parsed <= 0) {
    return null
  }

  return parsed
}

const sendError = (res: Response, status: number, message: string) => {
  return res.status(status).json({
    message,
    status,
    timestamp: new Date().toISOString(),
  })
}

const hasMissingRequiredField = (body: Record<string, unknown>) => {
  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const unit = typeof body.unit === 'string' ? body.unit.trim() : ''
  const vendorId = Number(body.vendorId)
  const hierarchyId = Number(body.hierarchyId)

  return (
    name.length === 0 ||
    unit.length === 0 ||
    !Number.isFinite(vendorId) ||
    !Number.isFinite(hierarchyId) ||
    vendorId <= 0 ||
    hierarchyId <= 0
  )
}

const isPrismaNotFoundError = (error: unknown) => {
  return Boolean(
    error &&
      typeof error === 'object' &&
      'code' in error &&
      (error as { code?: string }).code === 'P2025',
  )
}

export const createInventoryHandlers = (model: InventoryModel) => {
  const getInventoryById = async (req: Request, res: Response) => {
    const id = parseInventoryId(req.params.id)

    if (id === null) {
      return sendError(res, 400, 'Invalid inventory id')
    }

    try {
      const item = await model.findUnique({ where: { id } })

      if (!item) {
        return sendError(res, 404, 'Inventory item not found')
      }

      return res.status(200).json(item)
    } catch (error) {
      if (isPrismaNotFoundError(error)) {
        return sendError(res, 404, 'Inventory item not found')
      }

      throw error
    }
  }

  const updateInventoryById = async (req: Request, res: Response) => {
    const id = parseInventoryId(req.params.id)

    if (id === null) {
      return sendError(res, 400, 'Invalid inventory id')
    }

    if (hasMissingRequiredField(req.body as Record<string, unknown>)) {
      return sendError(res, 400, 'Missing required fields: name, vendorId, hierarchyId, unit')
    }

    const data: InventoryUpdateInput = {
      name: String(req.body.name).trim(),
      description:
        req.body.description === undefined || req.body.description === null
          ? undefined
          : String(req.body.description),
      vendorId: Number(req.body.vendorId),
      hierarchyId: Number(req.body.hierarchyId),
      unit: String(req.body.unit).trim(),
    }

    try {
      const updatedItem = await model.update({
        where: { id },
        data,
      })

      return res.status(200).json(updatedItem)
    } catch (error) {
      if (isPrismaNotFoundError(error)) {
        return sendError(res, 404, 'Inventory item not found')
      }

      throw error
    }
  }

  return {
    getInventoryById,
    updateInventoryById,
  }
}

export const inventoryHandlers = {
  getInventoryById: (req: Request, res: Response) => {
    if (!defaultHandlers) {
      defaultHandlers = createInventoryHandlers(getInventoryModel())
    }

    return defaultHandlers.getInventoryById(req, res)
  },
  updateInventoryById: (req: Request, res: Response) => {
    if (!defaultHandlers) {
      defaultHandlers = createInventoryHandlers(getInventoryModel())
    }

    return defaultHandlers.updateInventoryById(req, res)
  },
}
