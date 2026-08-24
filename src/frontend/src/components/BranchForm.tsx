import { useEffect, useState } from 'react'
import { Branch, RegionalOffice } from '../services/api'

export interface BranchFormValues {
  name: string
  code: string
  regionalOfficeId: number | ''
  address: string
}

interface BranchFormProps {
  regionalOffices: RegionalOffice[]
  initialValues?: Branch
  onSubmit: (values: BranchFormValues) => void
  onCancel: () => void
  error?: string | null
}

const EMPTY_VALUES: BranchFormValues = { name: '', code: '', regionalOfficeId: '', address: '' }

/**
 * Create/edit form for Branch (FR-006, FR-007).
 *
 * data-testid values per docs/design/design-doc.md: `branch-form`,
 * `branch-name`, `branch-code`, `branch-regional-office`, `branch-address`,
 * `branch-submit`, `branch-cancel` (task-149: 'data-testid="branch-form"').
 */
export function BranchForm({ regionalOffices, initialValues, onSubmit, onCancel, error }: BranchFormProps) {
  const [values, setValues] = useState<BranchFormValues>(
    initialValues
      ? {
          name: initialValues.name,
          code: initialValues.code,
          regionalOfficeId: initialValues.regionalOfficeId,
          address: initialValues.address ?? '',
        }
      : EMPTY_VALUES
  )

  useEffect(() => {
    if (initialValues) {
      setValues({
        name: initialValues.name,
        code: initialValues.code,
        regionalOfficeId: initialValues.regionalOfficeId,
        address: initialValues.address ?? '',
      })
    }
  }, [initialValues])

  return (
    <form
      data-testid="branch-form"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit(values)
      }}
    >
      {error && <p role="alert">{error}</p>}
      <label>
        Name
        <input
          data-testid="branch-name"
          value={values.name}
          onChange={(e) => setValues({ ...values, name: e.target.value })}
          required
        />
      </label>
      <label>
        Code
        <input
          data-testid="branch-code"
          value={values.code}
          onChange={(e) => setValues({ ...values, code: e.target.value })}
          required
        />
      </label>
      <label>
        Regional Office
        <select
          data-testid="branch-regional-office"
          value={values.regionalOfficeId}
          onChange={(e) =>
            setValues({ ...values, regionalOfficeId: e.target.value ? Number(e.target.value) : '' })
          }
          required
        >
          <option value="">Select regional office</option>
          {regionalOffices.map((office) => (
            <option key={office.id} value={office.id}>
              {office.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Address
        <input
          data-testid="branch-address"
          value={values.address}
          onChange={(e) => setValues({ ...values, address: e.target.value })}
        />
      </label>
      <button type="submit" data-testid="branch-submit">
        Submit
      </button>
      <button type="button" data-testid="branch-cancel" onClick={onCancel}>
        Cancel
      </button>
    </form>
  )
}
