import { Router } from 'express'
import { authenticate, authorize } from '../middleware/auth.js'
import {
  createUsageRecord,
  deleteUsageRecord,
  getUsageRecordById,
  listUsageRecords,
  updateUsageRecord,
} from '../services/usageRecordService.js'
import { handleRouteError } from '../utils/apiError.js'

const router = Router()

// GET /api/usage — list with pagination + filtering by date range, branches,
// items, and regional offices (FR-003, FR-021, FR-022). Accepts both plural
// array forms (branchIds, itemIds, regionalOfficeIds — comma-separated or
// repeated) and singular/bracket forms (branchId, itemId, regionalOfficeId).
router.get('/', authenticate, async (req, res) => {
  try {
    const result = await listUsageRecords({
      page: req.query.page,
      limit: req.query.limit,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      branchIds: req.query.branchIds,
      branchId: req.query.branchId,
      itemIds: req.query.itemIds,
      itemId: req.query.itemId,
      regionalOfficeIds: req.query.regionalOfficeIds,
      regionalOfficeId: req.query.regionalOfficeId,
    })
    res.status(200).json(result)
  } catch (error) {
    handleRouteError(res, error)
  }
})

router.get('/:id', authenticate, async (req, res) => {
  try {
    const record = await getUsageRecordById(Number(req.params.id))
    res.status(200).json(record)
  } catch (error) {
    handleRouteError(res, error)
  }
})

// POST /api/usage — any authenticated user can record usage (not admin-only,
// per docs/design/design-doc.md API Contracts table).
router.post('/', authenticate, async (req, res) => {
  try {
    const record = await createUsageRecord(req.body)
    res.status(201).json(record)
  } catch (error) {
    handleRouteError(res, error)
  }
})

// PUT /api/usage/:id — any authenticated user can update a usage record
// (not admin-only; only DELETE is restricted to Admin per FR-024, FR-025).
router.put('/:id', authenticate, async (req, res) => {
  try {
    const record = await updateUsageRecord(Number(req.params.id), req.body)
    res.status(200).json(record)
  } catch (error) {
    handleRouteError(res, error)
  }
})

// DELETE /api/usage/:id — Admin-only (FR-024, FR-025; story-04-01-04).
router.delete('/:id', authenticate, authorize('ADMIN'), async (req, res) => {
  try {
    await deleteUsageRecord(Number(req.params.id))
    res.status(204).send()
  } catch (error) {
    handleRouteError(res, error)
  }
})

export default router
