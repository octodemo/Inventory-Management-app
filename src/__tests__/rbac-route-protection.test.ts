import { Request, Response, NextFunction } from 'express'
import { authorize, AuthenticatedRequest } from '../middleware/auth'

const createResponse = () => {
  const res: Partial<Response> = {}
  res.status = jest.fn().mockReturnValue(res) as unknown as Response['status']
  res.json = jest.fn().mockReturnValue(res) as unknown as Response['json']
  return res as Response
}

const createRequest = (role?: string): Request => {
  const req: AuthenticatedRequest = {} as AuthenticatedRequest
  if (role) {
    req.user = { id: '1', email: `${role.toLowerCase()}@stationery.local`, role }
  }
  return req as Request
}

describe('RBAC route protection middleware', () => {
  it('returns 403 Forbidden when a non-admin user accesses an admin-only endpoint', () => {
    const req = createRequest('USER')
    const res = createResponse()
    const next: NextFunction = jest.fn()

    authorize('ADMIN')(req, res, next)

    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Forbidden', status: 403 })
    )
    expect(next).not.toHaveBeenCalled()
  })

  it('returns 403 Forbidden when no authenticated user is present', () => {
    const req = createRequest()
    const res = createResponse()
    const next: NextFunction = jest.fn()

    authorize('ADMIN')(req, res, next)

    expect(res.status).toHaveBeenCalledWith(403)
    expect(next).not.toHaveBeenCalled()
  })

  it('allows admin users access to protected endpoints', () => {
    const req = createRequest('ADMIN')
    const res = createResponse()
    const next: NextFunction = jest.fn()

    authorize('ADMIN')(req, res, next)

    expect(next).toHaveBeenCalledTimes(1)
    expect(res.status).not.toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()
  })
})
