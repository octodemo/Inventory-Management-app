import type { AuthenticatedUser, UserRole } from '../types/auth'

/** User record as stored by the identity provider mirror in the database. */
export interface UserRecord extends AuthenticatedUser {
  /** Scrypt hash of the user credential, in `salt:hash` form. */
  passwordHash: string
}

/** Read access to User records required by the IAM integration. */
export interface UserRepository {
  /** Finds a user by email address, or returns `null` when unknown. */
  findByEmail(email: string): Promise<UserRecord | null>
  /** Finds a user by id, or returns `null` when unknown. */
  findById(id: number): Promise<UserRecord | null>
  /** Lists every user, ordered by email. */
  findAll(): Promise<UserRecord[]>
}

/** Minimal Prisma client surface used by {@link PrismaUserRepository}. */
export interface UserDelegateClient {
  user: {
    findUnique(args: {
      where: { email: string } | { id: number }
    }): Promise<{
      id: number
      email: string
      name: string
      role: string
      passwordHash: string
    } | null>
    findMany(args: { orderBy: { email: 'asc' } }): Promise<
      {
        id: number
        email: string
        name: string
        role: string
        passwordHash: string
      }[]
    >
  }
}

/** Prisma backed implementation of {@link UserRepository}. */
export class PrismaUserRepository implements UserRepository {
  private readonly prisma: UserDelegateClient

  /**
   * Creates a repository bound to a Prisma client.
   *
   * @param prisma - Prisma client instance injected by the caller.
   */
  constructor(prisma: UserDelegateClient) {
    this.prisma = prisma
  }

  /**
   * Finds a user by email address.
   *
   * @param email - Email address to look up.
   * @returns The user record, or `null` when no user matches.
   */
  async findByEmail(email: string): Promise<UserRecord | null> {
    const user = await this.prisma.user.findUnique({ where: { email } })
    return user ? { ...user, role: user.role as UserRole } : null
  }

  /**
   * Finds a user by id.
   *
   * @param id - User identifier to look up.
   * @returns The user record, or `null` when no user matches.
   */
  async findById(id: number): Promise<UserRecord | null> {
    const user = await this.prisma.user.findUnique({ where: { id } })
    return user ? { ...user, role: user.role as UserRole } : null
  }

  /**
   * Lists every user, ordered by email.
   *
   * @returns All user records.
   */
  async findAll(): Promise<UserRecord[]> {
    const users = await this.prisma.user.findMany({ orderBy: { email: 'asc' } })
    return users.map((user) => ({ ...user, role: user.role as UserRole }))
  }
}
