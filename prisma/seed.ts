import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  await prisma.usageRecord.deleteMany()
  await prisma.itemRate.deleteMany()
  await prisma.inventoryItem.deleteMany()
  await prisma.branch.deleteMany()
  await prisma.regionalOffice.deleteMany()
  await prisma.itemHierarchy.deleteMany()
  await prisma.vendor.deleteMany()

  const [officeSupplies, paperProducts, stationeryHub] = await Promise.all([
    prisma.vendor.create({ data: { name: 'Office Supplies Co' } }),
    prisma.vendor.create({ data: { name: 'Paper Products Ltd' } }),
    prisma.vendor.create({ data: { name: 'Stationery Hub' } }),
  ])
  const supplies = await prisma.itemHierarchy.create({ data: { name: 'Office Supplies' } })
  const [pens, paper, notebooks] = await Promise.all([
    prisma.itemHierarchy.create({ data: { name: 'Pens', parentId: supplies.id } }),
    prisma.itemHierarchy.create({ data: { name: 'Paper', parentId: supplies.id } }),
    prisma.itemHierarchy.create({ data: { name: 'Notebooks', parentId: supplies.id } }),
  ])
  const [bluePen, copyPaper, notebook] = await Promise.all([
    prisma.inventoryItem.create({ data: { name: 'Blue Ballpoint Pen', vendorId: officeSupplies.id, hierarchyId: pens.id, unit: 'piece' } }),
    prisma.inventoryItem.create({ data: { name: 'A4 Copy Paper', vendorId: paperProducts.id, hierarchyId: paper.id, unit: 'ream' } }),
    prisma.inventoryItem.create({ data: { name: 'Spiral Notebook', vendorId: stationeryHub.id, hierarchyId: notebooks.id, unit: 'piece' } }),
  ])
  await prisma.itemRate.createMany({
    data: [
      { itemId: bluePen.id, rate: 5, effectiveFrom: new Date('2026-01-01') },
      { itemId: copyPaper.id, rate: 275, effectiveFrom: new Date('2026-01-01') },
      { itemId: notebook.id, rate: 45, effectiveFrom: new Date('2026-01-01') },
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
      { itemId: bluePen.id, branchId: northBranch.id, quantity: 150 + index * 10, usageDate: new Date(`${month}-10`) },
      { itemId: copyPaper.id, branchId: southBranch.id, quantity: 30 + index * 5, usageDate: new Date(`${month}-15`) },
      { itemId: notebook.id, branchId: northBranch.id, quantity: 50 + index * 3, usageDate: new Date(`${month}-20`) },
    ]),
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
