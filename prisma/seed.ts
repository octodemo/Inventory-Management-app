import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Seeds Users (FR-024, FR-025) — one Admin and two standard Users, matching
 * the test credentials in workshop-stack.md.
 */
async function seedUsers() {
  const users = [
    { email: 'admin@stationery.local', name: 'System Admin', role: 'ADMIN' },
    { email: 'user@stationery.local', name: 'Branch User', role: 'USER' },
    { email: 'manager@stationery.local', name: 'Regional Manager', role: 'USER' },
  ]
  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    })
  }
}

/**
 * Seeds Vendors (FR-002).
 */
async function seedVendors() {
  const vendors = [
    {
      name: 'Office Supplies Co',
      contactName: 'John Doe',
      contactEmail: 'john@officesupplies.com',
      contactPhone: '+91-1234567890',
      address: 'Sector 18, Gurugram',
    },
    {
      name: 'Stationery Plus',
      contactName: 'Jane Smith',
      contactEmail: 'jane@stationeryplus.com',
      contactPhone: '+91-9876543210',
      address: 'MG Road, Pune',
    },
    {
      name: 'Paper World',
      contactName: 'Bob Johnson',
      contactEmail: 'bob@paperworld.com',
      contactPhone: '+91-5555555555',
      address: 'Anna Salai, Chennai',
    },
  ]
  const created: Record<string, number> = {}
  for (const vendor of vendors) {
    const record = await prisma.vendor.create({ data: vendor })
    created[vendor.name] = record.id
  }
  return created
}

/**
 * Seeds the 3-level Item Hierarchy (FR-004) matching the design doc's
 * seed data plan and returns a name -> id lookup map for downstream seeding.
 */
async function seedHierarchies() {
  const ids: Record<string, number> = {}

  const writingInstruments = await prisma.itemHierarchy.create({
    data: { name: 'Writing Instruments' },
  })
  ids['Writing Instruments'] = writingInstruments.id

  const pens = await prisma.itemHierarchy.create({
    data: { name: 'Pens', parentId: writingInstruments.id },
  })
  ids['Pens'] = pens.id

  const pencils = await prisma.itemHierarchy.create({
    data: { name: 'Pencils', parentId: writingInstruments.id },
  })
  ids['Pencils'] = pencils.id

  const paperProducts = await prisma.itemHierarchy.create({
    data: { name: 'Paper Products' },
  })
  ids['Paper Products'] = paperProducts.id

  const copyPaper = await prisma.itemHierarchy.create({
    data: { name: 'Copy Paper', parentId: paperProducts.id },
  })
  ids['Copy Paper'] = copyPaper.id

  const a4Paper = await prisma.itemHierarchy.create({
    data: { name: 'A4 Paper', parentId: copyPaper.id },
  })
  ids['A4 Paper'] = a4Paper.id

  const legalPaper = await prisma.itemHierarchy.create({
    data: { name: 'Legal Paper', parentId: copyPaper.id },
  })
  ids['Legal Paper'] = legalPaper.id

  const notebooks = await prisma.itemHierarchy.create({
    data: { name: 'Notebooks', parentId: paperProducts.id },
  })
  ids['Notebooks'] = notebooks.id

  const officeSupplies = await prisma.itemHierarchy.create({
    data: { name: 'Office Supplies' },
  })
  ids['Office Supplies'] = officeSupplies.id

  const staplers = await prisma.itemHierarchy.create({
    data: { name: 'Staplers', parentId: officeSupplies.id },
  })
  ids['Staplers'] = staplers.id

  const filesAndFolders = await prisma.itemHierarchy.create({
    data: { name: 'Files & Folders', parentId: officeSupplies.id },
  })
  ids['Files & Folders'] = filesAndFolders.id

  return ids
}

/**
 * Seeds Inventory Items (FR-001) linked to vendors and hierarchy leaf nodes.
 */
async function seedInventoryItems(
  vendorIds: Record<string, number>,
  hierarchyIds: Record<string, number>
) {
  const items = [
    {
      name: 'Blue Ballpoint Pen',
      description: 'Standard blue ink ballpoint pen',
      vendorId: vendorIds['Office Supplies Co'],
      hierarchyId: hierarchyIds['Pens'],
      unit: 'piece',
    },
    {
      name: 'A4 Copy Paper (500 sheets)',
      description: '75 GSM A4 copy paper ream',
      vendorId: vendorIds['Paper World'],
      hierarchyId: hierarchyIds['A4 Paper'],
      unit: 'ream',
    },
    {
      name: 'HB Pencil',
      description: 'Standard HB graphite pencil',
      vendorId: vendorIds['Office Supplies Co'],
      hierarchyId: hierarchyIds['Pencils'],
      unit: 'piece',
    },
    {
      name: 'Stapler (Standard)',
      description: 'Desktop stapler, standard size',
      vendorId: vendorIds['Stationery Plus'],
      hierarchyId: hierarchyIds['Staplers'],
      unit: 'piece',
    },
    {
      name: 'Spiral Notebook (200 pages)',
      description: 'A5 spiral-bound ruled notebook',
      vendorId: vendorIds['Stationery Plus'],
      hierarchyId: hierarchyIds['Notebooks'],
      unit: 'piece',
    },
    {
      name: 'Legal Size Paper (500 sheets)',
      description: 'Legal size copy paper ream',
      vendorId: vendorIds['Paper World'],
      hierarchyId: hierarchyIds['Legal Paper'],
      unit: 'ream',
    },
    {
      name: 'Black Gel Pen',
      description: 'Smooth-writing black gel ink pen',
      vendorId: vendorIds['Office Supplies Co'],
      hierarchyId: hierarchyIds['Pens'],
      unit: 'piece',
    },
    {
      name: 'Mechanical Pencil 0.5mm',
      description: 'Refillable mechanical pencil',
      vendorId: vendorIds['Office Supplies Co'],
      hierarchyId: hierarchyIds['Pencils'],
      unit: 'piece',
    },
    {
      name: 'Ring Binder File',
      description: 'A4 ring binder folder',
      vendorId: vendorIds['Stationery Plus'],
      hierarchyId: hierarchyIds['Files & Folders'],
      unit: 'piece',
    },
    {
      name: 'Heavy Duty Stapler',
      description: 'High-capacity stapler for bulk binding',
      vendorId: vendorIds['Stationery Plus'],
      hierarchyId: hierarchyIds['Staplers'],
      unit: 'piece',
    },
  ]

  const created: number[] = []
  for (const item of items) {
    const record = await prisma.inventoryItem.create({ data: item })
    created.push(record.id)
  }
  return created
}

/**
 * Seeds Item Rates (FR-005) with non-overlapping effective date ranges.
 */
async function seedItemRates(itemIds: number[]) {
  const rates = [
    { itemId: itemIds[0], rate: 5.0, effectiveFrom: new Date('2026-01-01'), effectiveTo: null },
    {
      itemId: itemIds[1],
      rate: 250.0,
      effectiveFrom: new Date('2026-01-01'),
      effectiveTo: new Date('2026-06-30'),
    },
    { itemId: itemIds[1], rate: 275.0, effectiveFrom: new Date('2026-07-01'), effectiveTo: null },
    { itemId: itemIds[2], rate: 3.0, effectiveFrom: new Date('2026-01-01'), effectiveTo: null },
    { itemId: itemIds[3], rate: 150.0, effectiveFrom: new Date('2026-01-01'), effectiveTo: null },
    { itemId: itemIds[4], rate: 45.0, effectiveFrom: new Date('2026-01-01'), effectiveTo: null },
  ]
  for (const rate of rates) {
    await prisma.itemRate.create({ data: rate })
  }
}

/**
 * Seeds Regional Offices (FR-007).
 */
async function seedRegionalOffices() {
  const offices = [
    { name: 'North Region', code: 'NR-01', address: '123 North Street, Delhi' },
    { name: 'South Region', code: 'SR-01', address: '456 South Avenue, Bangalore' },
    { name: 'East Region', code: 'ER-01', address: '789 East Road, Kolkata' },
    { name: 'West Region', code: 'WR-01', address: '321 West Boulevard, Mumbai' },
  ]
  const created: number[] = []
  for (const office of offices) {
    const record = await prisma.regionalOffice.create({ data: office })
    created.push(record.id)
  }
  return created
}

/**
 * Seeds ~24 Branches (FR-006) spread across all four regional offices.
 * (Design doc calls for 20-30 sample branches out of the ~1,500 in production.)
 */
async function seedBranches(regionalOfficeIds: number[]) {
  const cityByOffice = ['Delhi', 'Bangalore', 'Kolkata', 'Mumbai']
  const prefixByOffice = ['DL', 'BL', 'KO', 'MU']
  const created: number[] = []

  for (let officeIndex = 0; officeIndex < regionalOfficeIds.length; officeIndex += 1) {
    const city = cityByOffice[officeIndex]
    const prefix = prefixByOffice[officeIndex]
    for (let branchIndex = 1; branchIndex <= 6; branchIndex += 1) {
      const record = await prisma.branch.create({
        data: {
          name: `${city} Branch ${branchIndex}`,
          code: `${prefix}-${String(branchIndex).padStart(3, '0')}`,
          regionalOfficeId: regionalOfficeIds[officeIndex],
          address: `${city} locality ${branchIndex}`,
        },
      })
      created.push(record.id)
    }
  }
  return created
}

/**
 * Seeds Supervisors (FR-009).
 */
async function seedSupervisors() {
  const supervisors = [
    { name: 'Amit Kumar', email: 'amit.kumar@company.com', phone: '+91-9999999991' },
    { name: 'Priya Sharma', email: 'priya.sharma@company.com', phone: '+91-9999999992' },
    { name: 'Rajesh Gupta', email: 'rajesh.gupta@company.com', phone: '+91-9999999993' },
  ]
  const created: number[] = []
  for (const supervisor of supervisors) {
    const record = await prisma.supervisor.create({ data: supervisor })
    created.push(record.id)
  }
  return created
}

/**
 * Seeds Premises (FR-008) mapped to Supervisors (FR-010).
 */
async function seedPremises(supervisorIds: number[]) {
  const premises = [
    { name: 'Head Office Delhi', supervisorId: supervisorIds[0], address: 'Connaught Place, Delhi' },
    { name: 'Regional Office North', supervisorId: supervisorIds[0], address: 'Rohini, Delhi' },
    { name: 'Regional Office South', supervisorId: supervisorIds[1], address: 'Koramangala, Bangalore' },
    { name: 'Regional Office East', supervisorId: supervisorIds[2], address: 'Salt Lake, Kolkata' },
    { name: 'Regional Office West', supervisorId: supervisorIds[2], address: 'Bandra, Mumbai' },
  ]
  for (const premise of premises) {
    await prisma.premises.create({ data: premise })
  }
}

/**
 * Seeds ~60 Usage Records (FR-003, FR-021, FR-022) spread across all
 * items and branches so branch-, regional-office-, vendor-, and
 * hierarchy-wise reports all have meaningful aggregated data.
 */
async function seedUsageRecords(itemIds: number[], branchIds: number[]) {
  const notes = [
    'Monthly office supply',
    'Printing department',
    'Branch replenishment',
    'Customer service desk',
    'New branch setup',
    'Training materials',
    'Marketing campaign',
    'Loan processing unit',
    'Inventory audit',
    'Monthly reports',
  ]

  const records = []
  for (let i = 0; i < 60; i += 1) {
    const item = itemIds[i % itemIds.length]
    const branch = branchIds[(i * 3 + 1) % branchIds.length]
    const quantity = 10 + ((i * 17) % 490)
    const dayOffset = i % 27
    const usageDate = new Date(2026, 7, 1 + dayOffset) // August 2026
    records.push({
      itemId: item,
      branchId: branch,
      quantity,
      usageDate,
      notes: notes[i % notes.length],
    })
  }

  for (const record of records) {
    await prisma.usageRecord.create({ data: record })
  }
}

async function main() {
  console.log('Seeding database...')

  // Most seed functions below use plain `create` calls (several of the
  // seeded models — ItemHierarchy, Branch, Premises, UsageRecord — have no
  // natural unique business key to `upsert` on). Guard the whole run so
  // re-executing `npm run prisma:seed` against an already-seeded database is
  // a no-op instead of creating duplicates.
  const existingRegionalOfficeCount = await prisma.regionalOffice.count()
  if (existingRegionalOfficeCount > 0) {
    console.log('Database already seeded — skipping (found existing RegionalOffice records).')
    return
  }

  await seedUsers()
  const vendorIds = await seedVendors()
  const hierarchyIds = await seedHierarchies()
  const itemIds = await seedInventoryItems(vendorIds, hierarchyIds)
  await seedItemRates(itemIds)
  const regionalOfficeIds = await seedRegionalOffices()
  const branchIds = await seedBranches(regionalOfficeIds)
  const supervisorIds = await seedSupervisors()
  await seedPremises(supervisorIds)
  await seedUsageRecords(itemIds, branchIds)

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
