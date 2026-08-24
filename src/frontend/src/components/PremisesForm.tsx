import { useEffect, useState } from 'react'
import { Premises, Supervisor } from '../services/api'

export interface PremisesFormValues {
  name: string
  address: string
  supervisorId: number | ''
}

interface PremisesFormProps {
  supervisors: Supervisor[]
  initialValues?: Premises
  onSubmit: (values: PremisesFormValues) => void
  onCancel: () => void
  error?: string | null
}

const EMPTY_VALUES: PremisesFormValues = { name: '', address: '', supervisorId: '' }

/**
 * Create/edit form for Premises with supervisor assignment (FR-008, FR-010).
 *
 * data-testid values per docs/design/design-doc.md Flow 6 ("Admin Maps
 * Premises to Supervisor"): `premises-supervisor`, `premises-submit`.
 * Additional fields follow the same naming convention: `premises-form`,
 * `premises-name`, `premises-address`, `premises-cancel`.
 */
export function PremisesForm({ supervisors, initialValues, onSubmit, onCancel, error }: PremisesFormProps) {
  const [values, setValues] = useState<PremisesFormValues>(
    initialValues
      ? {
          name: initialValues.name,
          address: initialValues.address ?? '',
          supervisorId: initialValues.supervisorId,
        }
      : EMPTY_VALUES
  )

  useEffect(() => {
    if (initialValues) {
      setValues({
        name: initialValues.name,
        address: initialValues.address ?? '',
        supervisorId: initialValues.supervisorId,
      })
    }
  }, [initialValues])

  return (
    <form
      data-testid="premises-form"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit(values)
      }}
    >
      {error && <p role="alert">{error}</p>}
      <label>
        Name
        <input
          data-testid="premises-name"
          value={values.name}
          onChange={(e) => setValues({ ...values, name: e.target.value })}
          required
        />
      </label>
      <label>
        Address
        <input
          data-testid="premises-address"
          value={values.address}
          onChange={(e) => setValues({ ...values, address: e.target.value })}
        />
      </label>
      <label>
        Supervisor
        <select
          data-testid="premises-supervisor"
          value={values.supervisorId}
          onChange={(e) => setValues({ ...values, supervisorId: e.target.value ? Number(e.target.value) : '' })}
          required
        >
          <option value="">Select supervisor</option>
          {supervisors.map((supervisor) => (
            <option key={supervisor.id} value={supervisor.id}>
              {supervisor.name}
            </option>
          ))}
        </select>
      </label>
      <button type="submit" data-testid="premises-submit">
        Submit
      </button>
      <button type="button" data-testid="premises-cancel" onClick={onCancel}>
        Cancel
      </button>
    </form>
  )
}
