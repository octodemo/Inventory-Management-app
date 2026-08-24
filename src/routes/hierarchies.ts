import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'
import { listItemHierarchiesMinimal } from '../services/itemHierarchyService.js'
import { handleRouteError } from '../utils/apiError.js'

const router = Router()

// GET /api/hierarchies — minimal read-only list (id, name, parentId) to
// populate the hierarchy dropdown/filter in the Reports UI. Full
// ItemHierarchy CRUD (tree management) is implemented by
// 14/15/16/17-BACKEND-hierarchy-*-api, which are outside this batch's scope.
router.get('/', authenticate, async (_req, res) => {
  try {
    const hierarchies = await listItemHierarchiesMinimal()
    res.status(200).json({ data: hierarchies })
  } catch (error) {
    handleRouteError(res, error)
  }
})

export default router
