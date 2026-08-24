import express from 'express'
import { createDashboardRouter } from './routes/dashboardRoutes'
import { DashboardService, PrismaDashboardDataSource } from './services/dashboardService'
import { PrismaClient } from '@prisma/client'

const PORT = process.env.PORT || 3000

export const createApp = () => {
  const app = express()
  app.use(express.json())
  const dashboardService = new DashboardService(new PrismaDashboardDataSource(new PrismaClient()))
  app.use('/api/dashboard', createDashboardRouter(dashboardService))
  return app
}

const app = createApp()

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
}
