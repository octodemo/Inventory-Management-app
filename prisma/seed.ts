import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  const regionalOffices = [
    {
      name: 'North Region',
      code: 'NR-01',
      address: '123 North Street, Delhi',
    },
    {
      name: 'South Region',
      code: 'SR-01',
      address: '456 South Avenue, Bangalore',
    },
    {
      name: 'East Region',
      code: 'ER-01',
      address: '789 East Road, Kolkata',
    },
    {
      name: 'West Region',
      code: 'WR-01',
      address: '321 West Boulevard, Mumbai',
    },
  ]

  for (const regionalOffice of regionalOffices) {
    await prisma.regionalOffice.upsert({
      where: { code: regionalOffice.code },
      update: {
        name: regionalOffice.name,
        address: regionalOffice.address,
      },
      create: regionalOffice,
    })
  }

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
