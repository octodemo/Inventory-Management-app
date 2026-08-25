import { PrismaClient } from '@prisma/client'

/**
 * Shared singleton Prisma client for the Express API.
 *
 * A single instance is reused across all services/routes so requests share
 * one SQLite connection pool instead of opening a new client per module.
 */
export const prisma = new PrismaClient()
