/**
 * Application user roles.
 *
 * SQLite (the configured Prisma datasource) does not support native enum
 * columns, so `User.role` is persisted as a plain `String` in
 * `prisma/schema.prisma`. This union type is the application-level source of
 * truth for the two roles defined in the BRD (Admin, User) and should be used
 * everywhere a role is read from or written to the database.
 */
export type UserRole = 'ADMIN' | 'USER'

export const USER_ROLES: UserRole[] = ['ADMIN', 'USER']
