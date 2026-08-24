import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

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
