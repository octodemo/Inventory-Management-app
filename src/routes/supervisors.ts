import { Router } from 'express'
import { authenticate, authorize } from '../middleware/auth.js'
import {
  createSupervisor,
  deleteSupervisor,
  getSupervisorById,
  listSupervisors,
  updateSupervisor,
} from '../services/supervisorService.js'
import { handleRouteError } from '../utils/apiError.js'

const router = Router()

router.get('/', authenticate, async (req, res) => {
  try {
    const result = await listSupervisors(req.query.page, req.query.limit)
    res.status(200).json(result)
  } catch (error) {
    handleRouteError(res, error)
  }
})

router.get('/:id', authenticate, async (req, res) => {
  try {
    const supervisor = await getSupervisorById(Number(req.params.id))
    res.status(200).json(supervisor)
  } catch (error) {
    handleRouteError(res, error)
  }
})

router.post('/', authenticate, authorize('ADMIN'), async (req, res) => {
  try {
    const supervisor = await createSupervisor(req.body)
    res.status(201).json(supervisor)
  } catch (error) {
    handleRouteError(res, error)
  }
})

router.put('/:id', authenticate, authorize('ADMIN'), async (req, res) => {
  try {
    const supervisor = await updateSupervisor(Number(req.params.id), req.body)
    res.status(200).json(supervisor)
  } catch (error) {
    handleRouteError(res, error)
  }
})

router.delete('/:id', authenticate, authorize('ADMIN'), async (req, res) => {
  try {
    await deleteSupervisor(Number(req.params.id))
    res.status(204).send()
  } catch (error) {
    handleRouteError(res, error)
  }
})

export default router
