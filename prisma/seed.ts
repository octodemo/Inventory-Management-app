import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  const vendors = [
    {
      name: 'Office Supplies Co',
      contactName: 'John Doe',
      contactEmail: 'john@officesupplies.com',
      contactPhone: '+91-1234567890',
      address: '12 Nehru Place, New Delhi',
    },
    {
      name: 'Stationery Plus',
      contactName: 'Jane Smith',
      contactEmail: 'jane@stationeryplus.com',
      contactPhone: '+91-9876543210',
      address: '45 MG Road, Bengaluru',
    },
    {
      name: 'Paper World',
      contactName: 'Bob Johnson',
      contactEmail: 'bob@paperworld.com',
      contactPhone: '+91-5555555555',
      address: '78 Park Street, Kolkata',
    },
  ]

  for (const vendor of vendors) {
    const existingVendor = await prisma.vendor.findFirst({
      where: { name: vendor.name },
    })

    if (!existingVendor) {
      await prisma.vendor.create({ data: vendor })
    }
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
