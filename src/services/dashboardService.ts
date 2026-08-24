import { PrismaClient } from '@prisma/client'

export interface UsageRecordData {
  itemId: number
  quantity: number
  usageDate: Date
  item: {
    name: string
    vendor: { id: number; name: string }
    rates: Array<{ rate: number; effectiveFrom: Date; effectiveTo: Date | null }>
  }
  branch: { regionalOffice: { id: number; name: string } }
}

export interface DashboardDataSource {
  findUsageRecords(startDate: Date, endDate: Date): Promise<UsageRecordData[]>
}

export interface DashboardQuery {
  startDate?: Date
  endDate?: Date
}

export class PrismaDashboardDataSource implements DashboardDataSource {
  public constructor(private readonly prisma: PrismaClient) {}

  public async findUsageRecords(startDate: Date, endDate: Date): Promise<UsageRecordData[]> {
    return this.prisma.usageRecord.findMany({
      where: { usageDate: { gte: startDate, lte: endDate } },
      include: {
        item: { include: { vendor: true, rates: true } },
        branch: { include: { regionalOffice: true } },
      },
    })
  }
}

/**
 * Aggregates UsageRecord data for dashboard widgets.
 */
export class DashboardService {
  public constructor(
    private readonly dataSource: DashboardDataSource,
    private readonly now: () => Date = () => new Date(),
  ) {}

  public async getDashboard(query: DashboardQuery = {}) {
    const endDate = query.endDate ?? this.endOfDay(this.now())
    const startDate = query.startDate ?? new Date(Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), 1))
    const periodLength = endDate.getTime() - startDate.getTime() + 1
    const previousEndDate = new Date(startDate.getTime() - 1)
    const previousStartDate = new Date(previousEndDate.getTime() - periodLength + 1)
    const [records, previousRecords] = await Promise.all([
      this.dataSource.findUsageRecords(startDate, endDate),
      this.dataSource.findUsageRecords(previousStartDate, previousEndDate),
    ])
    const currentMonth = this.sum(records)
    const previousMonth = this.sum(previousRecords)
    const changePercent = previousMonth === 0
      ? (currentMonth === 0 ? 0 : 100)
      : Number((((currentMonth - previousMonth) / previousMonth) * 100).toFixed(1))

    return {
      totalUsage: { currentMonth, previousMonth, changePercent },
      topItems: this.topItems(records),
      topVendors: this.topVendors(records),
      regionalBreakdown: this.regionalBreakdown(records),
      usageTrend: await this.usageTrend(endDate),
    }
  }

  private async usageTrend(endDate: Date) {
    const firstMonth = new Date(Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth() - 5, 1))
    const trendRecords = await this.dataSource.findUsageRecords(firstMonth, this.endOfDay(endDate))
    return Array.from({ length: 6 }, (_, index) => {
      const date = new Date(Date.UTC(firstMonth.getUTCFullYear(), firstMonth.getUTCMonth() + index, 1))
      const month = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`
      return {
        month,
        totalQuantity: this.sum(trendRecords.filter((record) => this.month(record.usageDate) === month)),
      }
    })
  }

  private topItems(records: UsageRecordData[]) {
    const items = new Map<number, { itemId: number; itemName: string; quantity: number }>()
    for (const record of records) {
      const item = items.get(record.itemId) ?? { itemId: record.itemId, itemName: record.item.name, quantity: 0 }
      item.quantity += record.quantity
      items.set(record.itemId, item)
    }
    return [...items.values()].sort((left, right) => right.quantity - left.quantity).slice(0, 5)
  }

  private topVendors(records: UsageRecordData[]) {
    const vendors = new Map<number, { vendorId: number; vendorName: string; totalValue: number }>()
    for (const record of records) {
      const vendor = vendors.get(record.item.vendor.id) ?? {
        vendorId: record.item.vendor.id,
        vendorName: record.item.vendor.name,
        totalValue: 0,
      }
      const applicableRates = record.item.rates.filter((rate) =>
        rate.effectiveFrom <= record.usageDate && (!rate.effectiveTo || rate.effectiveTo >= record.usageDate))
      const rate = applicableRates.sort((left, right) => right.effectiveFrom.getTime() - left.effectiveFrom.getTime())[0]
      vendor.totalValue += record.quantity * (rate?.rate ?? 0)
      vendors.set(record.item.vendor.id, vendor)
    }
    return [...vendors.values()]
      .map((vendor) => ({ ...vendor, totalValue: Number(vendor.totalValue.toFixed(2)) }))
      .sort((left, right) => right.totalValue - left.totalValue)
      .slice(0, 5)
  }

  private regionalBreakdown(records: UsageRecordData[]) {
    const offices = new Map<number, { regionalOfficeId: number; regionalOfficeName: string; quantity: number }>()
    for (const record of records) {
      const office = record.branch.regionalOffice
      const value = offices.get(office.id) ?? {
        regionalOfficeId: office.id,
        regionalOfficeName: office.name,
        quantity: 0,
      }
      value.quantity += record.quantity
      offices.set(office.id, value)
    }
    return [...offices.values()].sort((left, right) => right.quantity - left.quantity)
  }

  private sum(records: UsageRecordData[]): number {
    return records.reduce((total, record) => total + record.quantity, 0)
  }

  private month(date: Date): string {
    return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`
  }

  private endOfDay(date: Date): Date {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59, 999))
  }
}
