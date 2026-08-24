describe('Dashboard widgets usageTrend', () => {
  const dashboardWidgetsResponse = {
    usageTrend: [
      { month: '2026-01', totalQuantity: 100000 },
      { month: '2026-02', totalQuantity: 105000 },
      { month: '2026-03', totalQuantity: 98000 },
      { month: '2026-04', totalQuantity: 110500 },
      { month: '2026-05', totalQuantity: 112000 },
      { month: '2026-06', totalQuantity: 115250 },
    ],
  }

  it('includes at least 6 monthly data points with month (YYYY-MM) and totalQuantity', () => {
    const { usageTrend } = dashboardWidgetsResponse

    expect(Array.isArray(usageTrend)).toBe(true)
    expect(usageTrend.length).toBeGreaterThanOrEqual(6)

    usageTrend.forEach((point) => {
      expect(point).toEqual(
        expect.objectContaining({
          month: expect.any(String),
          totalQuantity: expect.any(Number),
        }),
      )
      expect(point.month).toMatch(/^\d{4}-(0[1-9]|1[0-2])$/)
    })
  })

  it('is sorted chronologically from oldest to newest', () => {
    const months = dashboardWidgetsResponse.usageTrend.map((point) => point.month)
    const sortedMonths = [...months].sort((a, b) => a.localeCompare(b))

    expect(months).toEqual(sortedMonths)
  })
})
