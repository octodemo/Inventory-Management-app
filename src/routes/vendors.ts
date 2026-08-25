import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'
import { getVendorUsageAnalysis } from '../services/vendorUsageService.js'
import { handleRouteError } from '../utils/apiError.js'

const router = Router()

// GET /api/vendors/:id/usage-analysis (FR-015)
router.get('/:id/usage-analysis', authenticate, async (req, res) => {
  try {
    const result = await getVendorUsageAnalysis(Number(req.params.id))
    res.status(200).json(result)
  } catch (error) {
    handleRouteError(res, error)
  }
})

export default router
