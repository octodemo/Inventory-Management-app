import { useEffect, useState } from 'react'
import { RegionalOffice } from '../services/api'

export interface RegionalOfficeFormValues {
  name: string
  code: string
  address: string
}

interface RegionalOfficeFormProps {
  initialValues?: RegionalOffice
  onSubmit: (values: RegionalOfficeFormValues) => void
  onCancel: () => void
  error?: string | null
}

const EMPTY_VALUES: RegionalOfficeFormValues = { name: '', code: '', address: '' }

/**
 * Create/edit form for RegionalOffice (FR-007), following the same
 * data-testid naming convention as `BranchForm` in
 * docs/design/design-doc.md (branch-name, branch-code, branch-address).
 *
 * data-testid values: `regional-office-form`, `regional-office-name`,
 * `regional-office-code`, `regional-office-address`, `regional-office-submit`,
 * `regional-office-cancel`.
 */
export function RegionalOfficeForm({ initialValues, onSubmit, onCancel, error }: RegionalOfficeFormProps) {
  const [values, setValues] = useState<RegionalOfficeFormValues>(
    initialValues
      ? { name: initialValues.name, code: initialValues.code, address: initialValues.address ?? '' }
      : EMPTY_VALUES
  )

  useEffect(() => {
    if (initialValues) {
      setValues({ name: initialValues.name, code: initialValues.code, address: initialValues.address ?? '' })
    } else {
      setValues(EMPTY_VALUES)
    }
  }, [initialValues])

  return (
    <form
      data-testid="regional-office-form"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit(values)
      }}
    >
      {error && <p role="alert">{error}</p>}
      <label>
        Name
        <input
          data-testid="regional-office-name"
          value={values.name}
          onChange={(e) => setValues({ ...values, name: e.target.value })}
          required
        />
      </label>
      <label>
        Code
        <input
          data-testid="regional-office-code"
          value={values.code}
          onChange={(e) => setValues({ ...values, code: e.target.value })}
          required
        />
      </label>
      <label>
        Address
        <input
          data-testid="regional-office-address"
          value={values.address}
          onChange={(e) => setValues({ ...values, address: e.target.value })}
        />
      </label>
      <button type="submit" data-testid="regional-office-submit">
        Submit
      </button>
      <button type="button" data-testid="regional-office-cancel" onClick={onCancel}>
        Cancel
      </button>
    </form>
  )
}
