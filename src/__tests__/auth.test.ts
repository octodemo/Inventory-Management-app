import { NextFunction, Request, Response } from 'express'

import { authenticate } from '../middleware/auth'

interface SessionRequest extends Request {
  session?: {
    token: string
    expiresAt: Date
  }
}

const createRequest = (
  authorization?: string,
  session?: SessionRequest['session'],
): SessionRequest => {
  const readHeader = jest.fn((name: string) =>
    name.toLowerCase() === 'authorization' ? authorization : undefined,
  )

  return {
    headers: authorization ? { authorization } : {},
    get: readHeader,
    header: readHeader,
    session,
  } as unknown as SessionRequest
}

const createResponse = () => {
  const status = jest.fn()
  const json = jest.fn()
  const response = { status, json } as unknown as Response

  status.mockReturnValue(response)
  json.mockReturnValue(response)

  return { response, status, json }
}

const expectUnauthorized = (
  status: jest.Mock,
  json: jest.Mock,
  next: jest.MockedFunction<NextFunction>,
) => {
  expect(status).toHaveBeenCalledWith(401)
  expect(json).toHaveBeenCalledTimes(1)
  expect(next).not.toHaveBeenCalled()

  const error = json.mock.calls[0][0]
  expect(error).toEqual({
    message: expect.any(String),
    status: 401,
    timestamp: expect.any(String),
  })
  expect(error.message).not.toHaveLength(0)
  expect(Number.isNaN(Date.parse(error.timestamp))).toBe(false)
}

describe('authenticate middleware error handling', () => {
  it('returns 401 Unauthorized when authentication is missing', () => {
    const request = createRequest()
    const { response, status, json } = createResponse()
    const next = jest.fn() as jest.MockedFunction<NextFunction>

    authenticate(request, response, next)

    expectUnauthorized(status, json, next)
  })

  it('returns 401 Unauthorized when authentication is invalid', () => {
    const request = createRequest('Malformed authorization value')
    const { response, status, json } = createResponse()
    const next = jest.fn() as jest.MockedFunction<NextFunction>

    authenticate(request, response, next)

    expectUnauthorized(status, json, next)
  })

  it('returns 401 Unauthorized when the session is expired', () => {
    const expiredToken = 'expired-session-token'
    const request = createRequest(['Bearer', expiredToken].join(' '), {
      token: expiredToken,
      expiresAt: new Date(Date.now() - 60_000),
    })
    const { response, status, json } = createResponse()
    const next = jest.fn() as jest.MockedFunction<NextFunction>

    authenticate(request, response, next)

    expectUnauthorized(status, json, next)
  })
})
