import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/utils/password'

const prisma = new PrismaClient()

/**
 * Seeds the users mirrored from the IAM framework.
 *
 * Credentials are read from environment variables so that no password is
 * hardcoded in the repository.
 */
async function seedUsers() {
  const users = [
    {
      email: process.env.SEED_ADMIN_EMAIL,
      name: 'Inventory Administrator',
      role: 'ADMIN',
      password: process.env.SEED_ADMIN_PASSWORD,
    },
    {
      email: process.env.SEED_USER_EMAIL,
      name: 'Inventory User',
      role: 'USER',
      password: process.env.SEED_USER_PASSWORD,
    },
  ]

  for (const user of users) {
    if (!user.email || !user.password) {
      console.warn(`Skipping ${user.role} seed user — email or password env var is not set.`)
      continue
    }

    const passwordHash = await hashPassword(user.password)
    await prisma.user.upsert({
      where: { email: user.email.toLowerCase() },
      update: { name: user.name, role: user.role, passwordHash },
      create: { email: user.email.toLowerCase(), name: user.name, role: user.role, passwordHash },
    })
  }
}

async function main() {
  console.log('Seeding database...')

  await seedUsers()

  console.log('Seeding complete.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
