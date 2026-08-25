import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { DashboardData, getDashboard } from '../services/api'
import { RoleAwareButton } from '../components/RoleGate'
import { useAuth } from '../context/AuthContext'

const currentRange = () => {
  const today = new Date()
  const stored = sessionStorage.getItem('dashboard-date-range')
  if (stored) return JSON.parse(stored) as { startDate: string; endDate: string }
  return {
    startDate: new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1)).toISOString().slice(0, 10),
    endDate: today.toISOString().slice(0, 10),
  }
}

/**
 * Displays usage analytics and date-aware drill-down links.
 */
export function DashboardPage() {
  const [range, setRange] = useState(currentRange)
  const [data, setData] = useState<DashboardData>()
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    sessionStorage.setItem('dashboard-date-range', JSON.stringify(range))
    let active = true
    setLoading(true)
    setError(undefined)
    getDashboard(range.startDate, range.endDate)
      .then((dashboard) => active && setData(dashboard))
      .catch((reason: unknown) => active && setError(reason instanceof Error ? reason.message : 'Unable to load dashboard data.'))
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [range])

  const updateRange = (field: 'startDate' | 'endDate', value: string) => {
    setRange((previous) => ({ ...previous, [field]: value }))
  }
  const query = new URLSearchParams(range).toString()

  return (
    <main data-testid="dashboard-page">
      <header className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p data-testid="dashboard-greeting">Welcome, {user?.name}</p>
          <p>Stationery usage insights</p>
          <RoleAwareButton allowedRoles={['ADMIN']} testId="dashboard-admin-action">
            Manage masters
          </RoleAwareButton>
        </div>
        <div className="date-filter" data-testid="dashboard-date-filter">
          <label>From <input data-testid="filter-start-date" type="date" value={range.startDate} onChange={(event) => updateRange('startDate', event.target.value)} /></label>
          <label>To <input data-testid="filter-end-date" type="date" value={range.endDate} onChange={(event) => updateRange('endDate', event.target.value)} /></label>
        </div>
      </header>
      {loading && <p role="status">Loading dashboard analytics…</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && data && (
        <div className="dashboard-grid">
          <button className="widget" data-testid="widget-total-usage" type="button" onClick={() => navigate(`/usage?${query}`)}>
            <span>Total Usage</span><strong>{data.totalUsage.currentMonth.toLocaleString()}</strong>
            <small>Previous period: {data.totalUsage.previousMonth.toLocaleString()} ({data.totalUsage.changePercent}% change)</small>
          </button>
          <section className="widget" data-testid="widget-top-items">
            <h2>Top Items by Usage</h2>
            {data.topItems.length ? data.topItems.map((item) => (
              <Link data-testid="clickable-widget" key={item.itemId} to={`/usage?itemId=${item.itemId}&${query}`}>{item.itemName}: {item.quantity.toLocaleString()}</Link>
            )) : <p>No usage records for this period.</p>}
          </section>
          <section className="widget">
            <h2>Usage by Regional Office</h2>
            {data.regionalBreakdown.length ? data.regionalBreakdown.map((office) => (
              <Link data-testid="clickable-widget" key={office.regionalOfficeId} to={`/reports?regionalOfficeId=${office.regionalOfficeId}&${query}`}>{office.regionalOfficeName}: {office.quantity.toLocaleString()}</Link>
            )) : <p>No usage records for this period.</p>}
          </section>
          <section className="widget" data-testid="widget-top-vendors">
            <h2>Top Vendors by Usage Value</h2>
            {data.topVendors.length ? data.topVendors.map((vendor) => (
              <Link data-testid="clickable-widget" key={vendor.vendorId} to={`/reports?vendorId=${vendor.vendorId}&${query}`}>{vendor.vendorName}: {vendor.totalValue.toLocaleString()}</Link>
            )) : <p>No usage records for this period.</p>}
          </section>
          <section className="widget trend-widget" data-testid="widget-usage-trend">
            <h2>Usage Trend</h2>
            <ResponsiveContainer height={260} width="100%">
              <LineChart data={data.usageTrend} onClick={() => navigate(`/usage?${query}`)}>
                <XAxis dataKey="month" /><YAxis /><Tooltip />
                <Line dataKey="totalQuantity" name="Usage" stroke="#2563eb" type="monotone" />
              </LineChart>
            </ResponsiveContainer>
          </section>
        </div>
      )}
    </main>
  )
}
