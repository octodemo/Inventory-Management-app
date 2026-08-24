import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  await prisma.inventoryItem.deleteMany()
  await prisma.itemHierarchy.deleteMany()
  await prisma.vendor.deleteMany()

  const officeSupplies = await prisma.vendor.create({
    data: {
      name: 'Office Supplies Co',
      contactName: 'John Doe',
      contactEmail: 'john@officesupplies.com',
      contactPhone: '+91-1234567890',
    },
  })
  const stationeryPlus = await prisma.vendor.create({
    data: {
      name: 'Stationery Plus',
      contactName: 'Jane Smith',
      contactEmail: 'jane@stationeryplus.com',
      contactPhone: '+91-9876543210',
    },
  })
  const paperWorld = await prisma.vendor.create({
    data: {
      name: 'Paper World',
      contactName: 'Bob Johnson',
      contactEmail: 'bob@paperworld.com',
      contactPhone: '+91-5555555555',
    },
  })

  const writingInstruments = await prisma.itemHierarchy.create({
    data: { name: 'Writing Instruments' },
  })
  const pens = await prisma.itemHierarchy.create({
    data: { name: 'Pens', parentId: writingInstruments.id },
  })
  const pencils = await prisma.itemHierarchy.create({
    data: { name: 'Pencils', parentId: writingInstruments.id },
  })
  const paperProducts = await prisma.itemHierarchy.create({
    data: { name: 'Paper Products' },
  })
  const copyPaper = await prisma.itemHierarchy.create({
    data: { name: 'Copy Paper', parentId: paperProducts.id },
  })
  const a4Paper = await prisma.itemHierarchy.create({
    data: { name: 'A4 Paper', parentId: copyPaper.id },
  })
  const legalPaper = await prisma.itemHierarchy.create({
    data: { name: 'Legal Paper', parentId: copyPaper.id },
  })
  const notebooks = await prisma.itemHierarchy.create({
    data: { name: 'Notebooks', parentId: paperProducts.id },
  })
  const officeSuppliesHierarchy = await prisma.itemHierarchy.create({
    data: { name: 'Office Supplies' },
  })
  const staplers = await prisma.itemHierarchy.create({
    data: { name: 'Staplers', parentId: officeSuppliesHierarchy.id },
  })
  const filesAndFolders = await prisma.itemHierarchy.create({
    data: { name: 'Files & Folders', parentId: officeSuppliesHierarchy.id },
  })

  await prisma.inventoryItem.createMany({
    data: [
      { name: 'Blue Ballpoint Pen', description: 'Blue ink ballpoint pen', vendorId: officeSupplies.id, hierarchyId: pens.id, unit: 'piece' },
      { name: 'Black Gel Pen', description: 'Black ink gel pen', vendorId: stationeryPlus.id, hierarchyId: pens.id, unit: 'piece' },
      { name: 'HB Pencil', description: 'Standard HB graphite pencil', vendorId: officeSupplies.id, hierarchyId: pencils.id, unit: 'piece' },
      { name: 'Mechanical Pencil', description: '0.5 mm mechanical pencil', vendorId: stationeryPlus.id, hierarchyId: pencils.id, unit: 'piece' },
      { name: 'A4 Copy Paper (500 sheets)', description: 'A4 white copy paper ream', vendorId: paperWorld.id, hierarchyId: a4Paper.id, unit: 'ream' },
      { name: 'Legal Copy Paper (500 sheets)', description: 'Legal-size white copy paper ream', vendorId: paperWorld.id, hierarchyId: legalPaper.id, unit: 'ream' },
      { name: 'Stapler (Standard)', description: 'Standard desktop stapler', vendorId: stationeryPlus.id, hierarchyId: staplers.id, unit: 'piece' },
      { name: 'Stapler Pins No. 10', description: 'No. 10 staples pack', vendorId: officeSupplies.id, hierarchyId: staplers.id, unit: 'box' },
      { name: 'Spiral Notebook (200 pages)', description: 'A4 spiral-bound notebook', vendorId: stationeryPlus.id, hierarchyId: notebooks.id, unit: 'piece' },
      { name: 'Lever Arch File', description: 'A4 lever arch document file', vendorId: officeSupplies.id, hierarchyId: filesAndFolders.id, unit: 'piece' },
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
