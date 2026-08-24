import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'
import { inventoryHandlers } from '../services/inventoryService.js'

const inventoryRouter = Router()

inventoryRouter.get('/:id', authenticate, inventoryHandlers.getInventoryById)
inventoryRouter.put('/:id', authenticate, inventoryHandlers.updateInventoryById)

export default inventoryRouter
