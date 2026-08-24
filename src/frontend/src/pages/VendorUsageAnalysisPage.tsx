import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { VendorUsageAnalysis } from '../components/VendorUsageAnalysis'
import {
  ApiRequestError,
  VendorLookup,
  VendorUsageAnalysis as VendorUsageAnalysisData,
  getVendorUsageAnalysis,
  listVendorsLookup,
} from '../services/api'

/**
 * Vendor Usage Analysis page (FR-015): fetches
 * GET /api/vendors/:id/usage-analysis and displays vendor details with
 * usage aggregation broken down by branch. If no vendor is selected yet, a
 * vendor picker is shown first.
 *
 * data-testid: `vendor-usage-analysis-page`.
 */
export function VendorUsageAnalysisPage() {
  const { vendorId } = useParams<{ vendorId: string }>()
  const navigate = useNavigate()
  const [vendors, setVendors] = useState<VendorLookup[]>([])
  const [analysis, setAnalysis] = useState<VendorUsageAnalysisData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    listVendorsLookup().then((result) => setVendors(result.data))
  }, [])

  useEffect(() => {
    if (!vendorId) {
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    getVendorUsageAnalysis(Number(vendorId))
      .then(setAnalysis)
      .catch((err: ApiRequestError) => setError(err.message))
      .finally(() => setLoading(false))
  }, [vendorId])

  return (
    <div data-testid="vendor-usage-analysis-page">
      <h1>Vendor Usage Analysis</h1>

      <label>
        Vendor
        <select
          data-testid="vendor-usage-analysis-select"
          value={vendorId ?? ''}
          onChange={(e) => navigate(`/vendors/${e.target.value}/usage-analysis`)}
        >
          <option value="">Select a vendor</option>
          {vendors.map((vendor) => (
            <option key={vendor.id} value={vendor.id}>
              {vendor.name}
            </option>
          ))}
        </select>
      </label>

      {loading && <p>Loading vendor usage analysis...</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && analysis && <VendorUsageAnalysis analysis={analysis} />}
      {!loading && !error && !analysis && vendorId && <p>No usage data available for this vendor.</p>}
    </div>
  )
}
