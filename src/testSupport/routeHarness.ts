import type { Router } from 'express'

/**
 * Test-only harness for exercising Express route handlers without booting a
 * real HTTP server or adding a supertest dependency. All Prisma access is
 * mocked at the module level (see individual `*.test.ts` files), so this
 * harness only needs to simulate the Express request/response contract.
 */

/** Minimal mutable mock of an Express `Response`. */
export interface MockResponse {
  statusCode: number
  body: unknown
  status: jest.Mock
  json: jest.Mock
  send: jest.Mock
}

/** Creates a chainable mock Express response (`res.status(x).json(y)`). */
export function createMockResponse(): MockResponse {
  const res = {} as MockResponse
  res.statusCode = 200
  res.body = undefined
  res.status = jest.fn((code: number) => {
    res.statusCode = code
    return res
  })
  res.json = jest.fn((body: unknown) => {
    res.body = body
    return res
  })
  res.send = jest.fn((body?: unknown) => {
    res.body = body
    return res
  })
  return res
}

/** Creates a minimal mock Express request with sensible defaults. */
export function createMockRequest(overrides: Record<string, unknown> = {}) {
  return {
    params: {},
    query: {},
    body: {},
    headers: {},
    ...overrides,
  }
}

interface RouteLayer {
  route?: {
    path: string
    methods: Record<string, boolean>
    stack: Array<{ handle: (...args: any[]) => any }>
  }
}

/**
 * Looks up the ordered list of middleware/handler functions registered for
 * a given method + path on an Express Router (e.g. `authenticate`,
 * `authorize('ADMIN')`, and the final async route handler).
 *
 * @param router - The Express Router exported by a `src/routes/*.ts` module.
 * @param method - HTTP method (case-insensitive), e.g. 'get', 'post'.
 * @param path - Route path as registered on the router (relative, e.g. '/:id').
 */
export function getRouteHandlers(
  router: Router,
  method: string,
  path: string
): Array<(req: any, res: any, next: () => void) => any> {
  const layer = (router.stack as unknown as RouteLayer[]).find(
    (l) => l.route?.path === path && l.route.methods[method.toLowerCase()]
  )
  if (!layer?.route) {
    throw new Error(`No route registered for ${method.toUpperCase()} ${path}`)
  }
  return layer.route.stack.map((s) => s.handle)
}

/**
 * Runs a chain of Express middleware/handlers sequentially against a mock
 * request/response, stopping as soon as a handler does not call `next()`
 * (i.e. it terminated the response, whether via a normal `res.json(...)` or
 * an early `403`/error short-circuit).
 *
 * @param handlers - Ordered middleware/handler chain from `getRouteHandlers`.
 * @param req - Mock request object.
 * @param res - Mock response object.
 */
export async function invokeRoute(
  handlers: Array<(req: any, res: any, next: () => void) => any>,
  req: any,
  res: any
): Promise<void> {
  for (const handler of handlers) {
    let calledNext = false
    await handler(req, res, () => {
      calledNext = true
    })
    if (!calledNext) {
      break
    }
  }
}
