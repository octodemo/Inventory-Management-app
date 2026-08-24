import { Router } from 'express'
import { authenticate, authorize } from '../middleware/auth.js'
import {
  createRegionalOffice,
  deleteRegionalOffice,
  getRegionalOfficeById,
  listRegionalOffices,
  updateRegionalOffice,
} from '../services/regionalOfficeService.js'
import { handleRouteError } from '../utils/apiError.js'

const router = Router()

router.get('/', authenticate, async (req, res) => {
  try {
    const result = await listRegionalOffices(req.query.page, req.query.limit)
    res.status(200).json(result)
  } catch (error) {
    handleRouteError(res, error)
  }
})

router.get('/:id', authenticate, async (req, res) => {
  try {
    const office = await getRegionalOfficeById(Number(req.params.id))
    res.status(200).json(office)
  } catch (error) {
    handleRouteError(res, error)
  }
})

router.post('/', authenticate, authorize('ADMIN'), async (req, res) => {
  try {
    const office = await createRegionalOffice(req.body)
    res.status(201).json(office)
  } catch (error) {
    handleRouteError(res, error)
  }
})

router.put('/:id', authenticate, authorize('ADMIN'), async (req, res) => {
  try {
    const office = await updateRegionalOffice(Number(req.params.id), req.body)
    res.status(200).json(office)
  } catch (error) {
    handleRouteError(res, error)
  }
})

router.delete('/:id', authenticate, authorize('ADMIN'), async (req, res) => {
  try {
    await deleteRegionalOffice(Number(req.params.id))
    res.status(204).send()
  } catch (error) {
    handleRouteError(res, error)
  }
})

export default router
