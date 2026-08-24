import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  const ensureHierarchyNode = async (name: string, parentId: number | null) => {
    const existingNode = await prisma.itemHierarchy.findFirst({
      where: { name, parentId },
    })

    return existingNode ?? prisma.itemHierarchy.create({
      data: { name, parentId },
    })
  }

  const writingInstruments = await ensureHierarchyNode('Writing Instruments', null)
  await ensureHierarchyNode('Pens', writingInstruments.id)
  await ensureHierarchyNode('Pencils', writingInstruments.id)

  const paperProducts = await ensureHierarchyNode('Paper Products', null)
  const copyPaper = await ensureHierarchyNode('Copy Paper', paperProducts.id)
  await ensureHierarchyNode('A4 Paper', copyPaper.id)
  await ensureHierarchyNode('Legal Paper', copyPaper.id)
  await ensureHierarchyNode('Notebooks', paperProducts.id)

  const officeSupplies = await ensureHierarchyNode('Office Supplies', null)
  await ensureHierarchyNode('Staplers', officeSupplies.id)
  await ensureHierarchyNode('Files & Folders', officeSupplies.id)

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
