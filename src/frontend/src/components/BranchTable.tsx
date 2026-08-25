import { Branch } from '../services/api'

interface BranchTableProps {
  branches: Branch[]
  onEdit: (branch: Branch) => void
  onDelete: (branch: Branch) => void
}

/**
 * Paginated branch list (FR-006), filterable by regional office.
 *
 * data-testid values per docs/design/design-doc.md: `branch-table`, `branch-row`.
 */
export function BranchTable({ branches, onEdit, onDelete }: BranchTableProps) {
  if (branches.length === 0) {
    return <p>No branches found.</p>
  }

  return (
    <table data-testid="branch-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Code</th>
          <th>Regional Office</th>
          <th>Address</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {branches.map((branch) => (
          <tr data-testid="branch-row" key={branch.id}>
            <td>{branch.name}</td>
            <td>{branch.code}</td>
            <td>{branch.regionalOfficeName}</td>
            <td>{branch.address}</td>
            <td>
              <button type="button" data-testid="edit-branch" onClick={() => onEdit(branch)}>
                Edit
              </button>
              <button type="button" data-testid="delete-branch" onClick={() => onDelete(branch)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
