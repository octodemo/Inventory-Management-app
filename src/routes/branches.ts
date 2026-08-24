import { Router } from 'express'
import { authenticate, authorize } from '../middleware/auth.js'
import { createBranch, deleteBranch, getBranchById, listBranches, updateBranch } from '../services/branchService.js'
import { handleRouteError } from '../utils/apiError.js'

const router = Router()

router.get('/', authenticate, async (req, res) => {
  try {
    const result = await listBranches(req.query.page, req.query.limit, req.query.regionalOfficeId)
    res.status(200).json(result)
  } catch (error) {
    handleRouteError(res, error)
  }
})

router.get('/:id', authenticate, async (req, res) => {
  try {
    const branch = await getBranchById(Number(req.params.id))
    res.status(200).json(branch)
  } catch (error) {
    handleRouteError(res, error)
  }
})

router.post('/', authenticate, authorize('ADMIN'), async (req, res) => {
  try {
    const branch = await createBranch(req.body)
    res.status(201).json(branch)
  } catch (error) {
    handleRouteError(res, error)
  }
})

router.put('/:id', authenticate, authorize('ADMIN'), async (req, res) => {
  try {
    const branch = await updateBranch(Number(req.params.id), req.body)
    res.status(200).json(branch)
  } catch (error) {
    handleRouteError(res, error)
  }
})

router.delete('/:id', authenticate, authorize('ADMIN'), async (req, res) => {
  try {
    await deleteBranch(Number(req.params.id))
    res.status(204).send()
  } catch (error) {
    handleRouteError(res, error)
  }
})

export default router
