import { Request, Response, Router, RequestHandler } from 'express'
import type { UserRepository } from '../services/userRepository'

/** Collaborators required by the users router. */
export interface UserRouterDependencies {
  userRepository: UserRepository
  /** Authentication middleware protecting the users endpoints. */
  authenticate: RequestHandler
  /** RBAC middleware restricting the users endpoints to ADMIN users. */
  authorizeAdmin: RequestHandler
}

/**
 * Creates the admin-only users router.
 *
 * The route demonstrates and enforces role based access control: authenticated
 * USER accounts receive 403 Forbidden, while ADMIN accounts receive the list.
 *
 * @param dependencies - Injected repository, authentication and RBAC middleware.
 * @returns An Express router mounted at `/api/users`.
 */
export const createUserRouter = ({
  userRepository,
  authenticate,
  authorizeAdmin,
}: UserRouterDependencies): Router => {
  const router = Router()

  router.get(
    '/',
    authenticate,
    authorizeAdmin,
    async (_req: Request, res: Response): Promise<void> => {
      const users = await userRepository.findAll()
      res.status(200).json({
        users: users.map(({ id, email, name, role }) => ({ id, email, name, role })),
      })
    },
  )

  return router
}
