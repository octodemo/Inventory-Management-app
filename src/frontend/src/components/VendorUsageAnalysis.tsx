import { VendorUsageAnalysis as VendorUsageAnalysisData } from '../services/api'

interface VendorUsageAnalysisProps {
  analysis: VendorUsageAnalysisData
}

/**
 * Displays the vendor-wise usage analysis report (FR-015) for a single
 * vendor: vendor details, per-item totals, and a branch-level breakdown.
 *
 * data-testid values: `vendor-usage-analysis`, `vendor-usage-total`,
 * `vendor-usage-item-row`.
 */
export function VendorUsageAnalysis({ analysis }: VendorUsageAnalysisProps) {
  return (
    <div data-testid="vendor-usage-analysis">
      <h2>{analysis.vendor.name}</h2>
      <p data-testid="vendor-usage-total">Total Usage: {analysis.totalUsage}</p>

      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Total Quantity</th>
            <th>Usage By Branch</th>
          </tr>
        </thead>
        <tbody>
          {analysis.items.map((item) => (
            <tr data-testid="vendor-usage-item-row" key={item.itemId}>
              <td>{item.itemName}</td>
              <td>{item.totalQuantity}</td>
              <td>
                <ul>
                  {item.usageByBranch.map((branch) => (
                    <li key={branch.branchId}>
                      {branch.branchName}: {branch.quantity}
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
