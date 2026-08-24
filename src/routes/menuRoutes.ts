import { Request, Response, Router, RequestHandler } from 'express'
import type { MenuService } from '../services/menuService'

/** Collaborators required by the menu router. */
export interface MenuRouterDependencies {
  menuService: MenuService
  /** Authentication middleware protecting the menu endpoints. */
  authenticate: RequestHandler
}

/**
 * Creates the menu router exposing the role filtered navigation structure.
 *
 * @param dependencies - Injected menu service and authentication middleware.
 * @returns An Express router mounted at `/api/menu`.
 */
export const createMenuRouter = ({
  menuService,
  authenticate,
}: MenuRouterDependencies): Router => {
  const router = Router()

  router.get('/items', authenticate, async (req: Request, res: Response): Promise<void> => {
    const role = req.user!.role
    res.status(200).json({ sections: menuService.getMenuForRole(role) })
  })

  return router
}
