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

  await prisma.usageRecord.deleteMany()
  await prisma.branch.deleteMany()
  await prisma.regionalOffice.deleteMany()
  await prisma.itemRate.deleteMany()
  await prisma.inventoryItem.deleteMany()
  const existingHierarchies = await prisma.itemHierarchy.findMany({ orderBy: { id: 'desc' } })
  for (const hierarchy of existingHierarchies) {
    await prisma.itemHierarchy.delete({ where: { id: hierarchy.id } })
  }
  await prisma.vendor.deleteMany()

  const [officeSupplies, stationeryPlus, paperWorld] = await Promise.all([
    prisma.vendor.create({ data: { name: 'Office Supplies Co', contactName: 'John Doe', contactEmail: 'john@officesupplies.com', contactPhone: '+91-1234567890', address: '12 MG Road, Mumbai' } }),
    prisma.vendor.create({ data: { name: 'Stationery Plus', contactName: 'Jane Smith', contactEmail: 'jane@stationeryplus.com', contactPhone: '+91-9876543210', address: '44 Park Street, Kolkata' } }),
    prisma.vendor.create({ data: { name: 'Paper World', contactName: 'Bob Johnson', contactEmail: 'bob@paperworld.com', contactPhone: '+91-5555555555', address: '7 Residency Road, Bengaluru' } }),
  ])

  const writing = await prisma.itemHierarchy.create({ data: { name: 'Writing Instruments' } })
  const pens = await prisma.itemHierarchy.create({ data: { name: 'Pens', parentId: writing.id } })
  const pencils = await prisma.itemHierarchy.create({ data: { name: 'Pencils', parentId: writing.id } })
  const paper = await prisma.itemHierarchy.create({ data: { name: 'Paper Products' } })
  const copyPaper = await prisma.itemHierarchy.create({ data: { name: 'Copy Paper', parentId: paper.id } })
  const a4Paper = await prisma.itemHierarchy.create({ data: { name: 'A4 Paper', parentId: copyPaper.id } })
  const notebooks = await prisma.itemHierarchy.create({ data: { name: 'Notebooks', parentId: paper.id } })
  const office = await prisma.itemHierarchy.create({ data: { name: 'Office Supplies' } })
  const staplers = await prisma.itemHierarchy.create({ data: { name: 'Staplers', parentId: office.id } })
  const folders = await prisma.itemHierarchy.create({ data: { name: 'Files & Folders', parentId: office.id } })

  const items = await Promise.all([
    prisma.inventoryItem.create({ data: { name: 'Blue Ballpoint Pen', description: 'Blue ink ballpoint pen', vendorId: officeSupplies.id, hierarchyId: pens.id, unit: 'piece' } }),
    prisma.inventoryItem.create({ data: { name: 'Black Ballpoint Pen', description: 'Black ink ballpoint pen', vendorId: officeSupplies.id, hierarchyId: pens.id, unit: 'piece' } }),
    prisma.inventoryItem.create({ data: { name: 'A4 Copy Paper (500 sheets)', description: '80 GSM A4 copy paper', vendorId: paperWorld.id, hierarchyId: a4Paper.id, unit: 'ream' } }),
    prisma.inventoryItem.create({ data: { name: 'HB Pencil', description: 'Wooden HB pencil', vendorId: officeSupplies.id, hierarchyId: pencils.id, unit: 'piece' } }),
    prisma.inventoryItem.create({ data: { name: 'Stapler (Standard)', description: 'Standard desktop stapler', vendorId: stationeryPlus.id, hierarchyId: staplers.id, unit: 'piece' } }),
    prisma.inventoryItem.create({ data: { name: 'Spiral Notebook (200 pages)', description: 'Ruled spiral notebook', vendorId: stationeryPlus.id, hierarchyId: notebooks.id, unit: 'piece' } }),
    prisma.inventoryItem.create({ data: { name: 'Document Folder', description: 'A4 document folder', vendorId: stationeryPlus.id, hierarchyId: folders.id, unit: 'piece' } }),
    prisma.inventoryItem.create({ data: { name: 'Permanent Marker', description: 'Black permanent marker', vendorId: officeSupplies.id, hierarchyId: pens.id, unit: 'piece' } }),
    prisma.inventoryItem.create({ data: { name: 'Correction Pen', description: 'White correction pen', vendorId: officeSupplies.id, hierarchyId: pens.id, unit: 'piece' } }),
    prisma.inventoryItem.create({ data: { name: 'A4 Colour Paper', description: 'Assorted colour paper', vendorId: paperWorld.id, hierarchyId: copyPaper.id, unit: 'ream' } }),
  ])

  await prisma.itemRate.createMany({
    data: [
      { itemId: items[0].id, rate: 5, effectiveFrom: new Date('2026-01-01') },
      { itemId: items[2].id, rate: 250, effectiveFrom: new Date('2026-01-01'), effectiveTo: new Date('2026-06-30') },
      { itemId: items[2].id, rate: 275, effectiveFrom: new Date('2026-07-01') },
      { itemId: items[3].id, rate: 3, effectiveFrom: new Date('2026-01-01') },
      { itemId: items[4].id, rate: 150, effectiveFrom: new Date('2026-01-01') },
      { itemId: items[5].id, rate: 45, effectiveFrom: new Date('2026-01-01') },
    ],
  })

  const [north, south] = await Promise.all([
    prisma.regionalOffice.create({ data: { name: 'North Regional Office', code: 'NORTH' } }),
    prisma.regionalOffice.create({ data: { name: 'South Regional Office', code: 'SOUTH' } }),
  ])
  const [northBranch, southBranch] = await Promise.all([
    prisma.branch.create({ data: { name: 'Delhi Central Branch', code: 'DCB-001', regionalOfficeId: north.id } }),
    prisma.branch.create({ data: { name: 'Bangalore Main Branch', code: 'BMB-001', regionalOfficeId: south.id } }),
  ])
  const months = ['2026-03', '2026-04', '2026-05', '2026-06', '2026-07', '2026-08']
  await prisma.usageRecord.createMany({
    data: months.flatMap((month, index) => [
      { itemId: items[0].id, branchId: northBranch.id, quantity: 150 + index * 10, usageDate: new Date(`${month}-10`) },
      { itemId: items[2].id, branchId: southBranch.id, quantity: 30 + index * 5, usageDate: new Date(`${month}-15`) },
      { itemId: items[5].id, branchId: northBranch.id, quantity: 50 + index * 3, usageDate: new Date(`${month}-20`) },
    ]),
  })

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
