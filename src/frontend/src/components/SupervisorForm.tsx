import { useEffect, useState } from 'react'
import { Supervisor } from '../services/api'

export interface SupervisorFormValues {
  name: string
  email: string
  phone: string
}

interface SupervisorFormProps {
  initialValues?: Supervisor
  onSubmit: (values: SupervisorFormValues) => void
  onCancel: () => void
  error?: string | null
}

const EMPTY_VALUES: SupervisorFormValues = { name: '', email: '', phone: '' }

/**
 * Create/edit form for Supervisor (FR-009).
 *
 * data-testid values: `supervisor-form`, `supervisor-name`, `supervisor-email`,
 * `supervisor-phone`, `supervisor-submit`, `supervisor-cancel`.
 */
export function SupervisorForm({ initialValues, onSubmit, onCancel, error }: SupervisorFormProps) {
  const [values, setValues] = useState<SupervisorFormValues>(
    initialValues
      ? { name: initialValues.name, email: initialValues.email, phone: initialValues.phone ?? '' }
      : EMPTY_VALUES
  )

  useEffect(() => {
    if (initialValues) {
      setValues({ name: initialValues.name, email: initialValues.email, phone: initialValues.phone ?? '' })
    }
  }, [initialValues])

  return (
    <form
      data-testid="supervisor-form"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit(values)
      }}
    >
      {error && <p role="alert">{error}</p>}
      <label>
        Name
        <input
          data-testid="supervisor-name"
          value={values.name}
          onChange={(e) => setValues({ ...values, name: e.target.value })}
          required
        />
      </label>
      <label>
        Email
        <input
          type="email"
          data-testid="supervisor-email"
          value={values.email}
          onChange={(e) => setValues({ ...values, email: e.target.value })}
          required
        />
      </label>
      <label>
        Phone
        <input
          data-testid="supervisor-phone"
          value={values.phone}
          onChange={(e) => setValues({ ...values, phone: e.target.value })}
        />
      </label>
      <button type="submit" data-testid="supervisor-submit">
        Submit
      </button>
      <button type="button" data-testid="supervisor-cancel" onClick={onCancel}>
        Cancel
      </button>
    </form>
  )
}
