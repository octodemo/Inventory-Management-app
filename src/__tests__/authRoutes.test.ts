import {
  authHeader,
  login,
  readJson,
  startTestApp,
  TEST_CREDENTIALS,
  type TestHarness,
} from '../testing/testApp'

describe('auth routes', () => {
  let harness: TestHarness

  beforeEach(async () => {
    harness = await startTestApp()
  })

  afterEach(async () => {
    await harness.close()
  })

  describe('POST /api/auth/login', () => {
    it('authenticates a user via IAM and returns the user with a session token', async () => {
      const response = await fetch(`${harness.baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(TEST_CREDENTIALS.admin),
      })
      const body = await readJson(response)

      expect(response.status).toBe(200)
      expect(body.user).toEqual({
        id: 1,
        email: TEST_CREDENTIALS.admin.email,
        name: 'Inventory Administrator',
        role: 'ADMIN',
      })
      expect(typeof body.token).toBe('string')
      expect(response.headers.get('set-cookie')).toContain('session_token=')
      expect(response.headers.get('set-cookie')).toContain('HttpOnly')
    })

    it('rejects invalid credentials with 401 in the standard error format', async () => {
      const response = await fetch(`${harness.baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: TEST_CREDENTIALS.admin.email, password: 'wrong' }),
      })
      const body = await readJson(response)

      expect(response.status).toBe(401)
      expect(body).toMatchObject({ message: 'Invalid credentials', status: 401 })
      expect(typeof body.timestamp).toBe('string')
    })

    it('rejects a request without credentials with 400', async () => {
      const response = await fetch(`${harness.baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })

      expect(response.status).toBe(400)
    })
  })

  describe('GET /api/auth/me', () => {
    it('returns the authenticated user profile including the role', async () => {
      const token = await login(harness.baseUrl, TEST_CREDENTIALS.user)

      const response = await fetch(`${harness.baseUrl}/api/auth/me`, {
        headers: { Authorization: authHeader(token) },
      })
      const body = await readJson(response)

      expect(response.status).toBe(200)
      expect(body.user).toEqual({
        id: 2,
        email: TEST_CREDENTIALS.user.email,
        name: 'Inventory User',
        role: 'USER',
      })
    })

    it('returns 401 when no session token is presented', async () => {
      const response = await fetch(`${harness.baseUrl}/api/auth/me`)
      const body = await readJson(response)

      expect(response.status).toBe(401)
      expect(body).toMatchObject({ message: 'Authentication required', status: 401 })
    })

    it('accepts the session cookie issued at login', async () => {
      const token = await login(harness.baseUrl, TEST_CREDENTIALS.admin)

      const response = await fetch(`${harness.baseUrl}/api/auth/me`, {
        headers: { Cookie: `session_token=${token}` },
      })

      expect(response.status).toBe(200)
    })
  })

  describe('POST /api/auth/logout', () => {
    it('clears the session and returns 200 OK', async () => {
      const token = await login(harness.baseUrl, TEST_CREDENTIALS.admin)

      const response = await fetch(`${harness.baseUrl}/api/auth/logout`, {
        method: 'POST',
        headers: { Authorization: authHeader(token) },
      })
      const body = await readJson(response)

      expect(response.status).toBe(200)
      expect(body).toEqual({ message: 'Logged out successfully' })
      expect(response.headers.get('set-cookie')).toContain('session_token=;')
    })

    it('makes subsequent requests to protected endpoints return 401', async () => {
      const token = await login(harness.baseUrl, TEST_CREDENTIALS.admin)

      await fetch(`${harness.baseUrl}/api/auth/logout`, {
        method: 'POST',
        headers: { Authorization: authHeader(token) },
      })

      const response = await fetch(`${harness.baseUrl}/api/auth/me`, {
        headers: { Authorization: authHeader(token) },
      })
      const body = await readJson(response)

      expect(response.status).toBe(401)
      expect(body).toMatchObject({ message: 'Invalid or expired session', status: 401 })
    })

    it('requires authentication', async () => {
      const response = await fetch(`${harness.baseUrl}/api/auth/logout`, { method: 'POST' })

      expect(response.status).toBe(401)
    })
  })
})
