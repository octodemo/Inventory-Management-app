import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'
import {
  generateBranchWiseReport,
  generateHierarchyWiseReport,
  generateItemWiseReport,
  generateRegionalOfficeWiseReport,
  generateVendorWiseReport,
} from '../services/reportsService.js'
import { handleRouteError } from '../utils/apiError.js'

const router = Router()

// POST /api/reports/item-wise (FR-003, FR-013)
router.post('/item-wise', authenticate, async (req, res) => {
  try {
    const result = await generateItemWiseReport(req.body)
    res.status(200).json(result)
  } catch (error) {
    handleRouteError(res, error)
  }
})

// POST /api/reports/branch-wise (FR-011, FR-021)
router.post('/branch-wise', authenticate, async (req, res) => {
  try {
    const result = await generateBranchWiseReport(req.body)
    res.status(200).json(result)
  } catch (error) {
    handleRouteError(res, error)
  }
})

// POST /api/reports/regional-office-wise (FR-012, FR-022)
router.post('/regional-office-wise', authenticate, async (req, res) => {
  try {
    const result = await generateRegionalOfficeWiseReport(req.body)
    res.status(200).json(result)
  } catch (error) {
    handleRouteError(res, error)
  }
})

// POST /api/reports/hierarchy-wise (FR-023)
router.post('/hierarchy-wise', authenticate, async (req, res) => {
  try {
    const result = await generateHierarchyWiseReport(req.body)
    res.status(200).json(result)
  } catch (error) {
    handleRouteError(res, error)
  }
})

// POST /api/reports/vendor-wise (FR-015)
router.post('/vendor-wise', authenticate, async (req, res) => {
  try {
    const result = await generateVendorWiseReport(req.body)
    res.status(200).json(result)
  } catch (error) {
    handleRouteError(res, error)
  }
})

export default router
