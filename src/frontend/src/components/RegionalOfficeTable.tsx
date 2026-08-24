import { RegionalOffice } from '../services/api'

interface RegionalOfficeTableProps {
  offices: RegionalOffice[]
  onEdit: (office: RegionalOffice) => void
  onDelete: (office: RegionalOffice) => void
  deleteError?: string | null
}

/**
 * Paginated list of regional offices with branch counts (FR-007).
 *
 * data-testid values: `regional-office-table`, `regional-office-row`,
 * `edit-regional-office`, `delete-regional-office` (consistent with the
 * BranchTable/BranchRow naming convention in docs/design/design-doc.md).
 */
export function RegionalOfficeTable({ offices, onEdit, onDelete, deleteError }: RegionalOfficeTableProps) {
  if (offices.length === 0) {
    return <p>No regional offices found.</p>
  }

  return (
    <>
      {deleteError && <p role="alert">{deleteError}</p>}
      <table data-testid="regional-office-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Code</th>
            <th>Address</th>
            <th>Branches</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {offices.map((office) => (
            <tr data-testid="regional-office-row" key={office.id}>
              <td>{office.name}</td>
              <td>{office.code}</td>
              <td>{office.address}</td>
              <td>{office.branchCount}</td>
              <td>
                <button type="button" data-testid="edit-regional-office" onClick={() => onEdit(office)}>
                  Edit
                </button>
                <button type="button" data-testid="delete-regional-office" onClick={() => onDelete(office)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
