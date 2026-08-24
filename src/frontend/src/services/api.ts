export interface DashboardData {
  totalUsage: { currentMonth: number; previousMonth: number; changePercent: number }
  topItems: Array<{ itemId: number; itemName: string; quantity: number }>
  topVendors: Array<{ vendorId: number; vendorName: string; totalValue: number }>
  regionalBreakdown: Array<{ regionalOfficeId: number; regionalOfficeName: string; quantity: number }>
  usageTrend: Array<{ month: string; totalQuantity: number }>
}

export class ApiError extends Error {
  public constructor(public readonly status: number, message: string) {
    super(message)
  }
}

/**
 * Fetches dashboard analytics for an optional inclusive date range.
 */
export const getDashboard = async (startDate?: string, endDate?: string): Promise<DashboardData> => {
  const query = new URLSearchParams()
  if (startDate) query.set('startDate', startDate)
  if (endDate) query.set('endDate', endDate)
  const response = await fetch(`/api/dashboard${query.size ? `?${query}` : ''}`)
  if (!response.ok) {
    if (response.status === 403) {
      window.dispatchEvent(new Event('api-forbidden'))
      throw new ApiError(403, 'You do not have permission to perform this action.')
    }
    const body = await response.json().catch(() => ({ message: 'Unable to load dashboard data.' }))
    throw new ApiError(response.status, body.message ?? 'Unable to load dashboard data.')
  }
  return response.json() as Promise<DashboardData>
}
