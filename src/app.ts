import express, { Express, NextFunction, Request, Response } from 'express'
import { createAuthenticate } from './middleware/auth'
import { createRateLimiter } from './middleware/rateLimit'
import { requireAdmin } from './middleware/rbac'
import branchesRouter from './routes/branches.js'
import premisesRouter from './routes/premises.js'
import regionalOfficesRouter from './routes/regionalOffices.js'
import reportsRouter from './routes/reports.js'
import supervisorsRouter from './routes/supervisors.js'
import usageRouter from './routes/usage.js'
import vendorsRouter from './routes/vendors.js'
import { createAuthRouter } from './routes/authRoutes'
import { createCatalogRouter } from './routes/catalogRoutes'
import { createMenuRouter } from './routes/menuRoutes'
import { createUserRouter } from './routes/userRoutes'
import { createDashboardRouter } from './routes/dashboardRoutes'
import { AuthService } from './services/authService'
import type { CatalogPrisma } from './services/catalogService'
import type { IamClient } from './services/iamClient'
import { MenuService } from './services/menuService'
import type { DashboardService } from './services/dashboardService'
import type { SessionStore } from './services/sessionStore'
import type { TokenService } from './services/tokenService'
import type { UserRepository } from './services/userRepository'
import { buildApiError } from './utils/apiError'

/** Collaborators required to build the Express application. */
export interface AppDependencies {
  catalogClient?: CatalogPrisma
  iamClient: IamClient
  tokenService: TokenService
  sessionStore: SessionStore
  userRepository: UserRepository
  menuService?: MenuService
  dashboardService?: DashboardService
  /** Session token lifetime in seconds, used for the session cookie max age. */
  sessionTtlSeconds: number
}

/**
 * Builds the Express application with all authentication and RBAC routes wired up.
 *
 * Every collaborator is injected so the application can be exercised in unit
 * tests without a database or a live IAM framework.
 *
 * @param dependencies - Injected services and configuration.
 * @returns The configured Express application.
 */
export const createApp = (dependencies: AppDependencies): Express => {
  const {
    iamClient,
    catalogClient,
    tokenService,
    sessionStore,
    userRepository,
    menuService = new MenuService(),
    dashboardService,
    sessionTtlSeconds,
  } = dependencies

  const app = express()
  app.use(express.json())

  const authenticate = createAuthenticate({ tokenService, sessionStore })
  const authService = new AuthService({ iamClient, tokenService, sessionStore })

  app.use(
    '/api/auth',
    createRateLimiter({ windowMs: 60_000, max: 10 }),
    createAuthRouter({ authService, authenticate, sessionTtlSeconds }),
  )
  app.use('/api/menu', createMenuRouter({ menuService, authenticate }))
  app.use(
    '/api/users',
    createUserRouter({ userRepository, authenticate, authorizeAdmin: requireAdmin() }),
  )
  if (dashboardService) {
    app.use(
      '/api/dashboard',
      createRateLimiter({ windowMs: 60_000, max: 600 }),
      authenticate,
      createDashboardRouter(dashboardService),
    )
  }
  if (catalogClient) {
    app.use(
      '/api',
      createCatalogRouter({ client: catalogClient, authenticate, authorizeAdmin: requireAdmin() }),
    )
  }

  // Feature Area 3 — organizational master data, usage tracking, and reporting.
  // These routers import the shared `authenticate`/`authorize` middleware from
  // `middleware/auth.js` directly rather than through dependency injection.
  app.use('/api/regional-offices', regionalOfficesRouter)
  app.use('/api/branches', branchesRouter)
  app.use('/api/supervisors', supervisorsRouter)
  app.use('/api/premises', premisesRouter)
  app.use('/api/usage', usageRouter)
  app.use('/api/reports', reportsRouter)
  app.use('/api/vendors', vendorsRouter)

  app.use('/api', (_req: Request, res: Response) => {
    res.status(404).json(buildApiError('Not found', 404))
  })

  app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(error)
    res.status(500).json(buildApiError('Internal server error', 500))
  })

  return app
}
