import { prisma } from '../lib/prisma.js'
import { ApiError } from '../utils/apiError.js'
import { DEFAULT_LIMIT, DEFAULT_PAGE, buildPaginationMeta, parsePagination } from '../utils/pagination.js'

/** Shape accepted by create/update operations for a RegionalOffice. */
export interface RegionalOfficeInput {
  name: string
  code: string
  address?: string | null
}

/**
 * Lists regional offices with pagination and includes each office's branch
 * count (FR-007), so the frontend can render totals without a second call.
 *
 * @param page - Requested page number (defaults to 1).
 * @param limit - Requested page size (defaults to 20, capped at 100).
 */
export async function listRegionalOffices(page?: unknown, limit?: unknown) {
  const { page: normalizedPage, limit: normalizedLimit } = parsePagination(
    page ?? DEFAULT_PAGE,
    limit ?? DEFAULT_LIMIT
  )

  const [offices, total] = await Promise.all([
    prisma.regionalOffice.findMany({
      skip: (normalizedPage - 1) * normalizedLimit,
      take: normalizedLimit,
      orderBy: { name: 'asc' },
      include: { _count: { select: { branches: true } } },
    }),
    prisma.regionalOffice.count(),
  ])

  return {
    data: offices.map((office) => ({
      id: office.id,
      name: office.name,
      code: office.code,
      address: office.address,
      branchCount: office._count.branches,
      createdAt: office.createdAt,
      updatedAt: office.updatedAt,
    })),
    pagination: buildPaginationMeta(normalizedPage, normalizedLimit, total),
  }
}

/**
 * Fetches a single regional office by id, including its branch count.
 *
 * @param id - Regional office primary key.
 * @throws {ApiError} 404 when no regional office exists with the given id.
 */
export async function getRegionalOfficeById(id: number) {
  const office = await prisma.regionalOffice.findUnique({
    where: { id },
    include: { _count: { select: { branches: true } } },
  })
  if (!office) {
    throw new ApiError(404, `Regional office ${id} not found`)
  }
  return {
    id: office.id,
    name: office.name,
    code: office.code,
    address: office.address,
    branchCount: office._count.branches,
    createdAt: office.createdAt,
    updatedAt: office.updatedAt,
  }
}

/**
 * Creates a new regional office.
 *
 * @param input - Regional office fields; `code` must be unique (FR-007).
 * @throws {ApiError} 400 when required fields are missing or the code is already in use.
 */
export async function createRegionalOffice(input: RegionalOfficeInput) {
  if (!input.name || !input.code) {
    throw new ApiError(400, 'name and code are required')
  }

  const existing = await prisma.regionalOffice.findUnique({ where: { code: input.code } })
  if (existing) {
    throw new ApiError(400, `Regional office code "${input.code}" is already in use`)
  }

  return prisma.regionalOffice.create({
    data: { name: input.name, code: input.code, address: input.address ?? null },
  })
}

/**
 * Updates an existing regional office.
 *
 * @param id - Regional office primary key.
 * @param input - Fields to update.
 * @throws {ApiError} 404 if the office does not exist, 400 if the new code collides with another office.
 */
export async function updateRegionalOffice(id: number, input: RegionalOfficeInput) {
  const existing = await prisma.regionalOffice.findUnique({ where: { id } })
  if (!existing) {
    throw new ApiError(404, `Regional office ${id} not found`)
  }

  if (input.code && input.code !== existing.code) {
    const codeOwner = await prisma.regionalOffice.findUnique({ where: { code: input.code } })
    if (codeOwner) {
      throw new ApiError(400, `Regional office code "${input.code}" is already in use`)
    }
  }

  return prisma.regionalOffice.update({
    where: { id },
    data: {
      name: input.name ?? existing.name,
      code: input.code ?? existing.code,
      address: input.address ?? existing.address,
    },
  })
}

/**
 * Deletes a regional office, enforcing the dependency rule that a regional
 * office with associated branches cannot be removed (FR-007 business rule).
 *
 * @param id - Regional office primary key.
 * @throws {ApiError} 404 if the office does not exist.
 * @throws {ApiError} 409 if the office still has branches assigned to it.
 */
export async function deleteRegionalOffice(id: number): Promise<void> {
  const existing = await prisma.regionalOffice.findUnique({
    where: { id },
    include: { _count: { select: { branches: true } } },
  })
  if (!existing) {
    throw new ApiError(404, `Regional office ${id} not found`)
  }

  if (existing._count.branches > 0) {
    throw new ApiError(
      409,
      `Cannot delete regional office ${id}: ${existing._count.branches} branch(es) are still assigned to it`
    )
  }

  await prisma.regionalOffice.delete({ where: { id } })
}
