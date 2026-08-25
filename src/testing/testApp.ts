import type { AddressInfo } from 'node:net'
import type { Server } from 'node:http'
import type { Express } from 'express'
import { createApp } from '../app'
import { DatabaseIamClient } from '../services/iamClient'
import { MenuService } from '../services/menuService'
import { InMemorySessionStore } from '../services/sessionStore'
import { JwtTokenService } from '../services/tokenService'
import type { UserRecord, UserRepository } from '../services/userRepository'
import { hashPassword } from '../utils/password'

/** In-memory {@link UserRepository} used to exercise the API without a database. */
export class InMemoryUserRepository implements UserRepository {
  private readonly users: UserRecord[]

  /**
   * Creates the repository.
   *
   * @param users - Seed users held in memory.
   */
  constructor(users: UserRecord[]) {
    this.users = users
  }

  /**
   * Finds a user by email address.
   *
   * @param email - Email address to look up.
   * @returns The matching user, or `null`.
   */
  async findByEmail(email: string): Promise<UserRecord | null> {
    return this.users.find((user) => user.email === email) ?? null
  }

  /**
   * Finds a user by id.
   *
   * @param id - Identifier to look up.
   * @returns The matching user, or `null`.
   */
  async findById(id: number): Promise<UserRecord | null> {
    return this.users.find((user) => user.id === id) ?? null
  }

  /**
   * Lists every user ordered by email.
   *
   * @returns All seeded users.
   */
  async findAll(): Promise<UserRecord[]> {
    return [...this.users].sort((a, b) => a.email.localeCompare(b.email))
  }
}

/** Credentials of the users seeded into the test harness. */
export const TEST_CREDENTIALS = {
  admin: { email: 'admin@stationery.local', password: 'admin-test-password' },
  user: { email: 'user@stationery.local', password: 'user-test-password' },
}

/** Running test app plus the collaborators tests need to assert against. */
export interface TestHarness {
  app: Express
  server: Server
  baseUrl: string
  sessionStore: InMemorySessionStore
  tokenService: JwtTokenService
  close(): Promise<void>
}

/**
 * Starts the API on an ephemeral port with in-memory collaborators.
 *
 * @param sessionTtlSeconds - Session token lifetime used by the harness.
 * @returns The running harness; call `close()` when the test finishes.
 */
export const startTestApp = async (sessionTtlSeconds = 3600): Promise<TestHarness> => {
  const users: UserRecord[] = [
    {
      id: 1,
      email: TEST_CREDENTIALS.admin.email,
      name: 'Inventory Administrator',
      role: 'ADMIN',
      passwordHash: await hashPassword(TEST_CREDENTIALS.admin.password),
    },
    {
      id: 2,
      email: TEST_CREDENTIALS.user.email,
      name: 'Inventory User',
      role: 'USER',
      passwordHash: await hashPassword(TEST_CREDENTIALS.user.password),
    },
  ]

  const userRepository = new InMemoryUserRepository(users)
  const sessionStore = new InMemorySessionStore()
  const tokenService = new JwtTokenService({
    secret: 'test-signing-secret',
    ttlSeconds: sessionTtlSeconds,
  })

  const app = createApp({
    iamClient: new DatabaseIamClient(userRepository),
    tokenService,
    sessionStore,
    userRepository,
    menuService: new MenuService(),
    sessionTtlSeconds,
  })

  const server = await new Promise<Server>((resolve) => {
    const listener = app.listen(0, () => resolve(listener))
  })
  const { port } = server.address() as AddressInfo

  return {
    app,
    server,
    baseUrl: `http://127.0.0.1:${port}`,
    sessionStore,
    tokenService,
    close: () =>
      new Promise<void>((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()))
      }),
  }
}

/**
 * Reads a JSON response body as a loosely typed record for assertions.
 *
 * @param response - Fetch response returned by the API.
 * @returns The parsed JSON body.
 */
export const readJson = async (response: Response): Promise<Record<string, any>> =>
  (await response.json()) as Record<string, any>

/**
 * Builds an `Authorization` header value for a session token.
 *
 * @param token - Session token issued at login.
 * @returns The bearer header value.
 */
export const authHeader = (token: string): string => ['Bearer', token].join(' ')

/**
 * Logs a user in against the running test app.
 *
 * @param baseUrl - Base URL of the running test app.
 * @param credentials - Email and password to authenticate with.
 * @returns The issued session token.
 */
export const login = async (
  baseUrl: string,
  credentials: { email: string; password: string },
): Promise<string> => {
  const response = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  })
  const body = (await response.json()) as { token: string }
  return body.token
}
