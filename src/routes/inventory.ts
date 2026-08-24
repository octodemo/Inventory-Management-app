import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'
import { listInventoryItemsMinimal } from '../services/inventoryItemService.js'
import { handleRouteError } from '../utils/apiError.js'

const router = Router()

// GET /api/inventory — minimal read-only list (id, name, unit, vendorId,
// hierarchyId) to populate item dropdowns/filters in the Usage and Reports
// UI. Full InventoryItem CRUD (search, pagination, vendor/hierarchy
// filtering) is implemented by 10/11/12/13-BACKEND-inventory-*-api, which
// are outside this batch's scope.
router.get('/', authenticate, async (_req, res) => {
  try {
    const items = await listInventoryItemsMinimal()
    res.status(200).json({ data: items })
  } catch (error) {
    handleRouteError(res, error)
  }
})

export default router
