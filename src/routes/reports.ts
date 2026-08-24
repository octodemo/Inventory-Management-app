import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'
import {
  ReportRequestBody,
  generateBranchWiseReport,
  generateHierarchyWiseReport,
  generateItemWiseReport,
  generateRegionalOfficeWiseReport,
  generateVendorWiseReport,
} from '../services/reportsService.js'
import { parseIdArray } from '../services/usageRecordService.js'
import { handleRouteError } from '../utils/apiError.js'

const router = Router()

/**
 * Converts GET query-string parameters into the `ReportRequestBody` shape
 * accepted by the report generator functions (the same shape used by the
 * POST `*-wise` routes), so alias `GET /api/reports/hierarchy` and
 * `GET /api/reports/vendor` routes can reuse the existing generators without
 * duplicating filter/pagination/sort parsing logic.
 *
 * @param query - Express `req.query` object.
 */
function parseReportQuery(query: Record<string, unknown>): ReportRequestBody {
  return {
    itemIds: parseIdArray(query.itemIds ?? query.itemId),
    branchIds: parseIdArray(query.branchIds ?? query.branchId),
    regionalOfficeIds: parseIdArray(query.regionalOfficeIds ?? query.regionalOfficeId),
    vendorIds: parseIdArray(query.vendorIds ?? query.vendorId),
    hierarchyIds: parseIdArray(query.hierarchyIds ?? query.hierarchyId),
    startDate: query.startDate ? String(query.startDate) : undefined,
    endDate: query.endDate ? String(query.endDate) : undefined,
    page: query.page ? Number(query.page) : undefined,
    limit: query.limit ? Number(query.limit) : undefined,
    orderBy: query.orderBy ? String(query.orderBy) : undefined,
    direction: query.direction === 'desc' ? 'desc' : query.direction === 'asc' ? 'asc' : undefined,
  }
}

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

// GET /api/reports/hierarchy — compatibility alias for POST
// /api/reports/hierarchy-wise, accepting filters/pagination/sort as query
// parameters instead of a JSON body (FR-023).
router.get('/hierarchy', authenticate, async (req, res) => {
  try {
    const result = await generateHierarchyWiseReport(parseReportQuery(req.query))
    res.status(200).json(result)
  } catch (error) {
    handleRouteError(res, error)
  }
})

// GET /api/reports/vendor — compatibility alias for POST
// /api/reports/vendor-wise, accepting filters/pagination/sort as query
// parameters instead of a JSON body (FR-015).
router.get('/vendor', authenticate, async (req, res) => {
  try {
    const result = await generateVendorWiseReport(parseReportQuery(req.query))
    res.status(200).json(result)
  } catch (error) {
    handleRouteError(res, error)
  }
})

export default router
