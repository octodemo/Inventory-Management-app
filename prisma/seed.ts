import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  await Promise.all(
    [
      {
        name: 'Amit Kumar',
        email: 'amit.kumar@company.com',
        phone: '+91-9999999991',
      },
      {
        name: 'Priya Sharma',
        email: 'priya.sharma@company.com',
        phone: '+91-9999999992',
      },
      {
        name: 'Rajesh Gupta',
        email: 'rajesh.gupta@company.com',
        phone: '+91-9999999993',
      },
    ].map(({ email, ...data }) =>
      prisma.supervisor.upsert({
        where: { email },
        create: { email, ...data },
        update: data,
      }),
    ),
  )
  
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
