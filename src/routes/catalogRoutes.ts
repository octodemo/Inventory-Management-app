import { Router, type NextFunction, type Request, type Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticate, authorize } from '../middleware/auth'
import {
  CatalogError,
  type CatalogPrisma,
  HierarchyService,
  InventoryService,
  RateService,
  VendorService,
} from '../services/catalogService'

type Handler = (request: Request, response: Response) => Promise<void>

/** Wraps async Express handlers and serialises domain failures consistently. */
const asyncHandler = (handler: Handler) => (request: Request, response: Response, next: NextFunction) => {
  handler(request, response).catch(next)
}

const noContent = (action: (id: string) => Promise<void>) => asyncHandler(async (request, response) => {
  await action(request.params.id)
  response.status(204).send()
})

/**
 * Creates all inventory catalogue routes.  Accepting the Prisma dependency
 * allows an application composition root (or a test) to supply its own client.
 */
export function createCatalogRouter(client: CatalogPrisma = new PrismaClient() as unknown as CatalogPrisma) {
  const router = Router()
  const inventory = new InventoryService(client)
  const vendors = new VendorService(client)
  const hierarchies = new HierarchyService(client)
  const rates = new RateService(client)
  const adminOnly = [authenticate, authorize('ADMIN')]

  router.get('/inventory', authenticate, asyncHandler(async (request, response) => {
    response.json(await inventory.list(request.query))
  }))
  router.get('/inventory/:id', authenticate, asyncHandler(async (request, response) => {
    response.json(await inventory.get(request.params.id))
  }))
  router.post('/inventory', ...adminOnly, asyncHandler(async (request, response) => {
    response.status(201).json(await inventory.create(request.body))
  }))
  router.put('/inventory/:id', ...adminOnly, asyncHandler(async (request, response) => {
    response.json(await inventory.update(request.params.id, request.body))
  }))
  router.delete('/inventory/:id', ...adminOnly, noContent((id) => inventory.delete(id)))

  router.get('/vendors', authenticate, asyncHandler(async (request, response) => {
    response.json(await vendors.list(request.query))
  }))
  router.get('/vendors/:id', authenticate, asyncHandler(async (request, response) => {
    response.json(await vendors.get(request.params.id))
  }))
  router.post('/vendors', ...adminOnly, asyncHandler(async (request, response) => {
    response.status(201).json(await vendors.create(request.body))
  }))
  router.put('/vendors/:id', ...adminOnly, asyncHandler(async (request, response) => {
    response.json(await vendors.update(request.params.id, request.body))
  }))
  router.delete('/vendors/:id', ...adminOnly, noContent((id) => vendors.delete(id)))

  router.get('/hierarchies', authenticate, asyncHandler(async (_request, response) => {
    response.json(await hierarchies.tree())
  }))
  router.get('/hierarchies/:id', authenticate, asyncHandler(async (request, response) => {
    response.json(await hierarchies.get(request.params.id))
  }))
  router.post('/hierarchies', ...adminOnly, asyncHandler(async (request, response) => {
    response.status(201).json(await hierarchies.create(request.body))
  }))
  router.put('/hierarchies/:id', ...adminOnly, asyncHandler(async (request, response) => {
    response.json(await hierarchies.update(request.params.id, request.body))
  }))
  router.delete('/hierarchies/:id', ...adminOnly, noContent((id) => hierarchies.delete(id)))

  router.get('/rates', authenticate, asyncHandler(async (request, response) => {
    response.json(await rates.list(request.query))
  }))
  router.get('/rates/:id', authenticate, asyncHandler(async (request, response) => {
    response.json(await rates.get(request.params.id))
  }))
  router.post('/rates', ...adminOnly, asyncHandler(async (request, response) => {
    response.status(201).json(await rates.create(request.body))
  }))
  router.put('/rates/:id', ...adminOnly, asyncHandler(async (request, response) => {
    response.json(await rates.update(request.params.id, request.body))
  }))
  router.delete('/rates/:id', ...adminOnly, noContent((id) => rates.delete(id)))

  router.use((error: unknown, _request: Request, response: Response, next: NextFunction) => {
    if (error instanceof CatalogError) {
      response.status(error.status).json({ message: error.message, status: error.status, timestamp: new Date().toISOString() })
      return
    }
    next(error)
  })

  return router
}
