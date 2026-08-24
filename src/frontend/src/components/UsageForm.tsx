import { useEffect, useState } from 'react'
import { Branch, InventoryItemLookup, UsageRecord } from '../services/api'

export interface UsageFormValues {
  itemId: number | ''
  branchId: number | ''
  quantity: number | ''
  usageDate: string
  notes: string
}

interface UsageFormProps {
  items: InventoryItemLookup[]
  branches: Branch[]
  initialValues?: UsageRecord
  onSubmit: (values: UsageFormValues) => void
  onCancel: () => void
  error?: string | null
}

const EMPTY_VALUES: UsageFormValues = { itemId: '', branchId: '', quantity: '', usageDate: '', notes: '' }

/**
 * Create/edit form for UsageRecord (FR-003).
 *
 * data-testid values per docs/design/design-doc.md: `usage-form`,
 * `usage-item`, `usage-branch`, `usage-quantity`, `usage-date`,
 * `usage-notes`, `usage-submit`, `usage-cancel`
 * (task-154: 'data-testid="usage-form"').
 */
export function UsageForm({ items, branches, initialValues, onSubmit, onCancel, error }: UsageFormProps) {
  const [values, setValues] = useState<UsageFormValues>(
    initialValues
      ? {
          itemId: initialValues.itemId,
          branchId: initialValues.branchId,
          quantity: initialValues.quantity,
          usageDate: initialValues.usageDate.slice(0, 10),
          notes: initialValues.notes ?? '',
        }
      : EMPTY_VALUES
  )

  useEffect(() => {
    if (initialValues) {
      setValues({
        itemId: initialValues.itemId,
        branchId: initialValues.branchId,
        quantity: initialValues.quantity,
        usageDate: initialValues.usageDate.slice(0, 10),
        notes: initialValues.notes ?? '',
      })
    }
  }, [initialValues])

  return (
    <form
      data-testid="usage-form"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit(values)
      }}
    >
      {error && <p role="alert">{error}</p>}
      <label>
        Item
        <select
          data-testid="usage-item"
          value={values.itemId}
          onChange={(e) => setValues({ ...values, itemId: e.target.value ? Number(e.target.value) : '' })}
          required
        >
          <option value="">Select item</option>
          {items.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Branch
        <select
          data-testid="usage-branch"
          value={values.branchId}
          onChange={(e) => setValues({ ...values, branchId: e.target.value ? Number(e.target.value) : '' })}
          required
        >
          <option value="">Select branch</option>
          {branches.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Quantity
        <input
          type="number"
          data-testid="usage-quantity"
          value={values.quantity}
          onChange={(e) => setValues({ ...values, quantity: Number(e.target.value) })}
          required
          min={0}
        />
      </label>
      <label>
        Usage Date
        <input
          type="date"
          data-testid="usage-date"
          value={values.usageDate}
          onChange={(e) => setValues({ ...values, usageDate: e.target.value })}
          required
        />
      </label>
      <label>
        Notes
        <textarea
          data-testid="usage-notes"
          value={values.notes}
          onChange={(e) => setValues({ ...values, notes: e.target.value })}
        />
      </label>
      <button type="submit" data-testid="usage-submit">
        Submit
      </button>
      <button type="button" data-testid="usage-cancel" onClick={onCancel}>
        Cancel
      </button>
    </form>
  )
}
