import { prisma } from '../lib/prisma.js'
import { ApiError } from '../utils/apiError.js'
import { DEFAULT_LIMIT, DEFAULT_PAGE, buildPaginationMeta, parsePagination } from '../utils/pagination.js'

/** Shape accepted by create/update operations for a Branch. */
export interface BranchInput {
  name: string
  code: string
  regionalOfficeId: number
  address?: string | null
}

/**
 * Lists branches with pagination and optional filtering by regional office
 * (FR-006, FR-007).
 *
 * @param page - Requested page number.
 * @param limit - Requested page size.
 * @param regionalOfficeId - Optional regional office id to filter by.
 */
export async function listBranches(page?: unknown, limit?: unknown, regionalOfficeId?: unknown) {
  const { page: normalizedPage, limit: normalizedLimit } = parsePagination(
    page ?? DEFAULT_PAGE,
    limit ?? DEFAULT_LIMIT
  )

  const officeId = regionalOfficeId !== undefined ? Number(regionalOfficeId) : undefined
  const where = officeId !== undefined && Number.isFinite(officeId) ? { regionalOfficeId: officeId } : {}

  const [branches, total] = await Promise.all([
    prisma.branch.findMany({
      where,
      skip: (normalizedPage - 1) * normalizedLimit,
      take: normalizedLimit,
      orderBy: { name: 'asc' },
      include: { regionalOffice: true },
    }),
    prisma.branch.count({ where }),
  ])

  return {
    data: branches.map((branch) => ({
      id: branch.id,
      name: branch.name,
      code: branch.code,
      address: branch.address,
      regionalOfficeId: branch.regionalOfficeId,
      regionalOfficeName: branch.regionalOffice.name,
      createdAt: branch.createdAt,
      updatedAt: branch.updatedAt,
    })),
    pagination: buildPaginationMeta(normalizedPage, normalizedLimit, total),
  }
}

/**
 * Fetches a single branch by id, including its regional office.
 *
 * @param id - Branch primary key.
 * @throws {ApiError} 404 when no branch exists with the given id.
 */
export async function getBranchById(id: number) {
  const branch = await prisma.branch.findUnique({ where: { id }, include: { regionalOffice: true } })
  if (!branch) {
    throw new ApiError(404, `Branch ${id} not found`)
  }
  return branch
}

/**
 * Creates a new branch under an existing regional office.
 *
 * @param input - Branch fields; `code` must be unique, `regionalOfficeId` must reference an existing office.
 * @throws {ApiError} 400 when required fields are missing, the code is in use, or the regional office does not exist.
 */
export async function createBranch(input: BranchInput) {
  if (!input.name || !input.code || !input.regionalOfficeId) {
    throw new ApiError(400, 'name, code, and regionalOfficeId are required')
  }

  const office = await prisma.regionalOffice.findUnique({ where: { id: input.regionalOfficeId } })
  if (!office) {
    throw new ApiError(400, `Regional office ${input.regionalOfficeId} does not exist`)
  }

  const existingCode = await prisma.branch.findUnique({ where: { code: input.code } })
  if (existingCode) {
    throw new ApiError(400, `Branch code "${input.code}" is already in use`)
  }

  return prisma.branch.create({
    data: {
      name: input.name,
      code: input.code,
      regionalOfficeId: input.regionalOfficeId,
      address: input.address ?? null,
    },
  })
}

/**
 * Updates an existing branch.
 *
 * @param id - Branch primary key.
 * @param input - Fields to update.
 * @throws {ApiError} 404 if the branch does not exist, 400 for invalid code/regional office references.
 */
export async function updateBranch(id: number, input: Partial<BranchInput>) {
  const existing = await prisma.branch.findUnique({ where: { id } })
  if (!existing) {
    throw new ApiError(404, `Branch ${id} not found`)
  }

  if (input.code && input.code !== existing.code) {
    const codeOwner = await prisma.branch.findUnique({ where: { code: input.code } })
    if (codeOwner) {
      throw new ApiError(400, `Branch code "${input.code}" is already in use`)
    }
  }

  if (input.regionalOfficeId && input.regionalOfficeId !== existing.regionalOfficeId) {
    const office = await prisma.regionalOffice.findUnique({ where: { id: input.regionalOfficeId } })
    if (!office) {
      throw new ApiError(400, `Regional office ${input.regionalOfficeId} does not exist`)
    }
  }

  return prisma.branch.update({
    where: { id },
    data: {
      name: input.name ?? existing.name,
      code: input.code ?? existing.code,
      regionalOfficeId: input.regionalOfficeId ?? existing.regionalOfficeId,
      address: input.address ?? existing.address,
    },
  })
}

/**
 * Deletes a branch by id.
 *
 * @param id - Branch primary key.
 * @throws {ApiError} 404 when no branch exists with the given id.
 */
export async function deleteBranch(id: number): Promise<void> {
  const existing = await prisma.branch.findUnique({ where: { id } })
  if (!existing) {
    throw new ApiError(404, `Branch ${id} not found`)
  }
  await prisma.branch.delete({ where: { id } })
}
