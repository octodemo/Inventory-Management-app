import { Link, useLocation } from 'react-router-dom'

/**
 * Carries dashboard date and entity filters into the selected detail route.
 */
export function DetailPage() {
  const location = useLocation()
  const query = new URLSearchParams(location.search)
  const title = location.pathname === '/usage' ? 'Usage Records' : 'Detailed Report'
  return (
    <main>
      <h1>{title}</h1>
      <p>Dashboard filters are applied to this view.</p>
      <dl>
        {[...query.entries()].map(([name, value]) => <div key={name}><dt>{name}</dt><dd>{value}</dd></div>)}
      </dl>
      <Link to={`/?${query.toString()}`}>Back to Dashboard</Link>
    </main>
  )
}
