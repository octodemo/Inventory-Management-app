import { UsageRecord } from '../services/api'

interface UsageTableProps {
  records: UsageRecord[]
  isAdmin: boolean
  onEdit: (record: UsageRecord) => void
  onDelete: (record: UsageRecord) => void
  deleteError?: string | null
}

/**
 * Paginated usage record table (FR-003).
 *
 * data-testid values per docs/design/design-doc.md: `usage-table`,
 * `usage-row`. Delete action uses `usage-delete-dialog`
 * (story-04-01-04 technical notes) and is only rendered for Admin users
 * (FR-024, FR-025).
 */
export function UsageTable({ records, isAdmin, onEdit, onDelete, deleteError }: UsageTableProps) {
  if (records.length === 0) {
    return <p>No usage records found.</p>
  }

  return (
    <>
      {deleteError && <p role="alert">{deleteError}</p>}
      <table data-testid="usage-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Branch</th>
            <th>Quantity</th>
            <th>Date</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr data-testid="usage-row" key={record.id}>
              <td>{record.item?.name}</td>
              <td>{record.branch?.name}</td>
              <td>{record.quantity}</td>
              <td>{record.usageDate.slice(0, 10)}</td>
              <td>{record.notes}</td>
              <td>
                <button type="button" data-testid="edit-usage" onClick={() => onEdit(record)}>
                  Edit
                </button>
                {isAdmin && (
                  <button
                    type="button"
                    data-testid="usage-delete-dialog"
                    onClick={() => onDelete(record)}
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
