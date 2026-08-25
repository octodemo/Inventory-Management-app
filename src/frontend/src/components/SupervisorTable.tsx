import { Supervisor } from '../services/api'

interface SupervisorTableProps {
  supervisors: Supervisor[]
  onEdit: (supervisor: Supervisor) => void
  onDelete: (supervisor: Supervisor) => void
  onView: (supervisor: Supervisor) => void
  deleteError?: string | null
}

/**
 * Paginated supervisor list (FR-009).
 *
 * data-testid values: `supervisor-table`, `supervisor-row`.
 */
export function SupervisorTable({ supervisors, onEdit, onDelete, onView, deleteError }: SupervisorTableProps) {
  if (supervisors.length === 0) {
    return <p>No supervisors found.</p>
  }

  return (
    <>
      {deleteError && <p role="alert">{deleteError}</p>}
      <table data-testid="supervisor-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Premises</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {supervisors.map((supervisor) => (
            <tr data-testid="supervisor-row" key={supervisor.id}>
              <td>{supervisor.name}</td>
              <td>{supervisor.email}</td>
              <td>{supervisor.phone}</td>
              <td>{supervisor.premisesCount}</td>
              <td>
                <button type="button" data-testid="view-supervisor" onClick={() => onView(supervisor)}>
                  View
                </button>
                <button type="button" data-testid="edit-supervisor" onClick={() => onEdit(supervisor)}>
                  Edit
                </button>
                <button type="button" data-testid="delete-supervisor" onClick={() => onDelete(supervisor)}>
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
