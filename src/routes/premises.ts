import { Router } from 'express'
import { authenticate, authorize } from '../middleware/auth.js'
import {
  createPremises,
  deletePremises,
  getPremisesById,
  listPremises,
  updatePremises,
} from '../services/premisesService.js'
import { handleRouteError } from '../utils/apiError.js'

const router = Router()

router.get('/', authenticate, async (req, res) => {
  try {
    const result = await listPremises(req.query.page, req.query.limit)
    res.status(200).json(result)
  } catch (error) {
    handleRouteError(res, error)
  }
})

router.get('/:id', authenticate, async (req, res) => {
  try {
    const premises = await getPremisesById(Number(req.params.id))
    res.status(200).json(premises)
  } catch (error) {
    handleRouteError(res, error)
  }
})

router.post('/', authenticate, authorize('ADMIN'), async (req, res) => {
  try {
    const premises = await createPremises(req.body)
    res.status(201).json(premises)
  } catch (error) {
    handleRouteError(res, error)
  }
})

router.put('/:id', authenticate, authorize('ADMIN'), async (req, res) => {
  try {
    const premises = await updatePremises(Number(req.params.id), req.body)
    res.status(200).json(premises)
  } catch (error) {
    handleRouteError(res, error)
  }
})

router.delete('/:id', authenticate, authorize('ADMIN'), async (req, res) => {
  try {
    await deletePremises(Number(req.params.id))
    res.status(204).send()
  } catch (error) {
    handleRouteError(res, error)
  }
})

export default router
