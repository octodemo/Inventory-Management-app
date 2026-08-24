import { prisma } from '../lib/prisma.js'
import { ApiError } from '../utils/apiError.js'
import { DEFAULT_LIMIT, DEFAULT_PAGE, buildPaginationMeta, parsePagination } from '../utils/pagination.js'

/** Shape accepted by create/update operations for Premises. */
export interface PremisesInput {
  name: string
  address?: string | null
  supervisorId: number
}

/**
 * Lists premises with pagination, including the assigned supervisor's name
 * (FR-008).
 *
 * @param page - Requested page number.
 * @param limit - Requested page size.
 */
export async function listPremises(page?: unknown, limit?: unknown) {
  const { page: normalizedPage, limit: normalizedLimit } = parsePagination(
    page ?? DEFAULT_PAGE,
    limit ?? DEFAULT_LIMIT
  )

  const [premises, total] = await Promise.all([
    prisma.premises.findMany({
      skip: (normalizedPage - 1) * normalizedLimit,
      take: normalizedLimit,
      orderBy: { name: 'asc' },
      include: { supervisor: true },
    }),
    prisma.premises.count(),
  ])

  return {
    data: premises.map((premise) => ({
      id: premise.id,
      name: premise.name,
      address: premise.address,
      supervisorId: premise.supervisorId,
      supervisorName: premise.supervisor.name,
      createdAt: premise.createdAt,
      updatedAt: premise.updatedAt,
    })),
    pagination: buildPaginationMeta(normalizedPage, normalizedLimit, total),
  }
}

/**
 * Fetches a single premises record by id, including its assigned supervisor.
 *
 * @param id - Premises primary key.
 * @throws {ApiError} 404 when no premises exists with the given id.
 */
export async function getPremisesById(id: number) {
  const premises = await prisma.premises.findUnique({ where: { id }, include: { supervisor: true } })
  if (!premises) {
    throw new ApiError(404, `Premises ${id} not found`)
  }
  return premises
}

/**
 * Creates a new premises record with a supervisor assignment (FR-008, FR-010).
 *
 * @param input - Premises fields; `supervisorId` must reference an existing supervisor.
 * @throws {ApiError} 400 when required fields are missing or the supervisor does not exist.
 */
export async function createPremises(input: PremisesInput) {
  if (!input.name || !input.supervisorId) {
    throw new ApiError(400, 'name and supervisorId are required')
  }

  const supervisor = await prisma.supervisor.findUnique({ where: { id: input.supervisorId } })
  if (!supervisor) {
    throw new ApiError(400, `Supervisor ${input.supervisorId} does not exist`)
  }

  return prisma.premises.create({
    data: { name: input.name, address: input.address ?? null, supervisorId: input.supervisorId },
  })
}

/**
 * Updates an existing premises record, allowing the supervisor assignment to
 * be changed (FR-010 acceptance criteria: "mapping can be updated").
 *
 * @param id - Premises primary key.
 * @param input - Fields to update.
 * @throws {ApiError} 404 if the premises does not exist, 400 if the new supervisorId does not exist.
 */
export async function updatePremises(id: number, input: Partial<PremisesInput>) {
  const existing = await prisma.premises.findUnique({ where: { id } })
  if (!existing) {
    throw new ApiError(404, `Premises ${id} not found`)
  }

  if (input.supervisorId && input.supervisorId !== existing.supervisorId) {
    const supervisor = await prisma.supervisor.findUnique({ where: { id: input.supervisorId } })
    if (!supervisor) {
      throw new ApiError(400, `Supervisor ${input.supervisorId} does not exist`)
    }
  }

  return prisma.premises.update({
    where: { id },
    data: {
      name: input.name ?? existing.name,
      address: input.address ?? existing.address,
      supervisorId: input.supervisorId ?? existing.supervisorId,
    },
  })
}

/**
 * Deletes a premises record.
 *
 * @param id - Premises primary key.
 * @throws {ApiError} 404 when no premises exists with the given id.
 */
export async function deletePremises(id: number): Promise<void> {
  const existing = await prisma.premises.findUnique({ where: { id } })
  if (!existing) {
    throw new ApiError(404, `Premises ${id} not found`)
  }
  await prisma.premises.delete({ where: { id } })
}
