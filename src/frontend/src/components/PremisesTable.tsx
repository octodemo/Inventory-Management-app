import { Premises } from '../services/api'

interface PremisesTableProps {
  premises: Premises[]
  onEdit: (premises: Premises) => void
  onDelete: (premises: Premises) => void
}

/**
 * Paginated premises list (FR-008), showing the assigned supervisor.
 *
 * data-testid values: `premises-table`, `premises-row`, `edit-premises`
 * (design-doc Flow 6 uses `edit-premises` for the edit action).
 */
export function PremisesTable({ premises, onEdit, onDelete }: PremisesTableProps) {
  if (premises.length === 0) {
    return <p>No premises found.</p>
  }

  return (
    <table data-testid="premises-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Address</th>
          <th>Supervisor</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {premises.map((premise) => (
          <tr data-testid="premises-row" key={premise.id}>
            <td>{premise.name}</td>
            <td>{premise.address}</td>
            <td>{premise.supervisorName}</td>
            <td>
              <button type="button" data-testid="edit-premises" onClick={() => onEdit(premise)}>
                Edit
              </button>
              <button type="button" data-testid="delete-premises" onClick={() => onDelete(premise)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
