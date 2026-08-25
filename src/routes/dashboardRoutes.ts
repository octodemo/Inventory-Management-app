import { NextFunction, Request, Response, Router } from 'express'
import { DashboardService } from '../services/dashboardService'

const parseDate = (value: unknown, field: string, endOfDay = false): Date | undefined => {
  if (value === undefined) {
    return undefined
  }
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error(`${field} must be a valid ISO date (YYYY-MM-DD).`)
  }
  const date = new Date(`${value}T${endOfDay ? '23:59:59.999' : '00:00:00.000'}Z`)
  if (Number.isNaN(date.getTime())) {
    throw new Error(`${field} must be a valid ISO date (YYYY-MM-DD).`)
  }
  return date
}

/**
 * Handles dashboard summary requests.
 */
export const getDashboardHandler = (dashboardService: DashboardService) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const startDate = parseDate(req.query.startDate, 'startDate')
      const endDate = parseDate(req.query.endDate, 'endDate', true)
      if (startDate && endDate && startDate > endDate) {
        res.status(400).json({ message: 'startDate must be on or before endDate.', status: 400, timestamp: new Date().toISOString() })
        return
      }
      res.json(await dashboardService.getDashboard({ startDate, endDate }))
    } catch (error) {
      if (error instanceof Error && error.message.includes('must be a valid ISO date')) {
        res.status(400).json({ message: error.message, status: 400, timestamp: new Date().toISOString() })
        return
      }
      next(error)
    }
  }

/**
 * Creates routes for dashboard analytics.
 */
export const createDashboardRouter = (dashboardService: DashboardService): Router => {
  const router = Router()
  const handler = getDashboardHandler(dashboardService)
  router.get('/', handler)
  router.get('/widgets', handler)
  return router
}
