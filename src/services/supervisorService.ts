import { prisma } from '../lib/prisma.js'
import { ApiError } from '../utils/apiError.js'
import { DEFAULT_LIMIT, DEFAULT_PAGE, buildPaginationMeta, parsePagination } from '../utils/pagination.js'

/** Shape accepted by create/update operations for a Supervisor. */
export interface SupervisorInput {
  name: string
  email: string
  phone?: string | null
}

/**
 * Lists supervisors with pagination (FR-009).
 *
 * @param page - Requested page number.
 * @param limit - Requested page size.
 */
export async function listSupervisors(page?: unknown, limit?: unknown) {
  const { page: normalizedPage, limit: normalizedLimit } = parsePagination(
    page ?? DEFAULT_PAGE,
    limit ?? DEFAULT_LIMIT
  )

  const [supervisors, total] = await Promise.all([
    prisma.supervisor.findMany({
      skip: (normalizedPage - 1) * normalizedLimit,
      take: normalizedLimit,
      orderBy: { name: 'asc' },
      include: { _count: { select: { premises: true } } },
    }),
    prisma.supervisor.count(),
  ])

  return {
    data: supervisors.map((supervisor) => ({
      id: supervisor.id,
      name: supervisor.name,
      email: supervisor.email,
      phone: supervisor.phone,
      premisesCount: supervisor._count.premises,
      createdAt: supervisor.createdAt,
      updatedAt: supervisor.updatedAt,
    })),
    pagination: buildPaginationMeta(normalizedPage, normalizedLimit, total),
  }
}

/**
 * Fetches a supervisor by id, including the full list of assigned premises
 * (FR-009 acceptance criteria: "returns supervisor details including list of
 * assigned premises").
 *
 * @param id - Supervisor primary key.
 * @throws {ApiError} 404 when no supervisor exists with the given id.
 */
export async function getSupervisorById(id: number) {
  const supervisor = await prisma.supervisor.findUnique({
    where: { id },
    include: { premises: true },
  })
  if (!supervisor) {
    throw new ApiError(404, `Supervisor ${id} not found`)
  }
  return supervisor
}

/**
 * Creates a new supervisor.
 *
 * @param input - Supervisor fields; `email` must be unique.
 * @throws {ApiError} 400 when required fields are missing or the email is already in use.
 */
export async function createSupervisor(input: SupervisorInput) {
  if (!input.name || !input.email) {
    throw new ApiError(400, 'name and email are required')
  }

  const existing = await prisma.supervisor.findUnique({ where: { email: input.email } })
  if (existing) {
    throw new ApiError(400, `Supervisor email "${input.email}" is already in use`)
  }

  return prisma.supervisor.create({
    data: { name: input.name, email: input.email, phone: input.phone ?? null },
  })
}

/**
 * Updates an existing supervisor.
 *
 * @param id - Supervisor primary key.
 * @param input - Fields to update.
 * @throws {ApiError} 404 if the supervisor does not exist, 400 if the new email collides with another supervisor.
 */
export async function updateSupervisor(id: number, input: Partial<SupervisorInput>) {
  const existing = await prisma.supervisor.findUnique({ where: { id } })
  if (!existing) {
    throw new ApiError(404, `Supervisor ${id} not found`)
  }

  if (input.email && input.email !== existing.email) {
    const emailOwner = await prisma.supervisor.findUnique({ where: { email: input.email } })
    if (emailOwner) {
      throw new ApiError(400, `Supervisor email "${input.email}" is already in use`)
    }
  }

  return prisma.supervisor.update({
    where: { id },
    data: {
      name: input.name ?? existing.name,
      email: input.email ?? existing.email,
      phone: input.phone ?? existing.phone,
    },
  })
}

/**
 * Deletes a supervisor, enforcing the dependency rule that a supervisor with
 * assigned premises cannot be removed (FR-010 business rule).
 *
 * @param id - Supervisor primary key.
 * @throws {ApiError} 404 if the supervisor does not exist.
 * @throws {ApiError} 409 if the supervisor still has premises assigned to it.
 */
export async function deleteSupervisor(id: number): Promise<void> {
  const existing = await prisma.supervisor.findUnique({
    where: { id },
    include: { _count: { select: { premises: true } } },
  })
  if (!existing) {
    throw new ApiError(404, `Supervisor ${id} not found`)
  }

  if (existing._count.premises > 0) {
    throw new ApiError(
      409,
      `Cannot delete supervisor ${id}: ${existing._count.premises} premises are still assigned to it`
    )
  }

  await prisma.supervisor.delete({ where: { id } })
}
