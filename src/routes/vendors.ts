import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'
import { getVendorUsageAnalysis, listVendorsMinimal } from '../services/vendorUsageService.js'
import { handleRouteError } from '../utils/apiError.js'

const router = Router()

// GET /api/vendors — minimal read-only list (id, name) to populate the
// vendor dropdown/filter in the Reports UI. Full Vendor master CRUD
// (POST/PUT/DELETE /api/vendors) is implemented by 21-24-BACKEND-vendor-*-api,
// which are outside this batch's scope.
router.get('/', authenticate, async (_req, res) => {
  try {
    const vendors = await listVendorsMinimal()
    res.status(200).json({ data: vendors })
  } catch (error) {
    handleRouteError(res, error)
  }
})

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
