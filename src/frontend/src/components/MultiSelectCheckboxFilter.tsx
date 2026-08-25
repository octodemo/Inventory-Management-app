
export interface MultiSelectOption {
  id: number
  label: string
}

interface MultiSelectCheckboxFilterProps {
  /** Filter dimension, used to build data-testid values (`filter-{type}`). */
  type: 'items' | 'branches' | 'vendors' | 'regional-offices'
  label: string
  options: MultiSelectOption[]
  selectedIds: number[]
  onChange: (ids: number[]) => void
}

/**
 * Reusable checkbox-based multi-selection filter used for items (FR-013),
 * branches (FR-011), regional offices (FR-012), and vendors (story-05-01-03).
 *
 * data-testid values:
 * - Container: `filter-{type}` (design-doc: filter-items, filter-branches,
 *   filter-regional-offices; vendors follow the same convention: filter-vendors)
 * - "Select All" checkbox: `checkbox-select-all-{type}`
 * - Individual checkboxes: `checkbox-item-{id}` (design-doc CheckboxGroup pattern)
 */
export function MultiSelectCheckboxFilter({
  type,
  label,
  options,
  selectedIds,
  onChange,
}: MultiSelectCheckboxFilterProps) {
  const allSelected = options.length > 0 && selectedIds.length === options.length

  const toggleAll = () => {
    onChange(allSelected ? [] : options.map((o) => o.id))
  }

  const toggleOne = (id: number) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((existing) => existing !== id))
    } else {
      onChange([...selectedIds, id])
    }
  }

  return (
    <div data-testid={`filter-${type}`} className="multi-select-checkbox-filter">
      <p>{label}</p>
      <div data-testid="checkbox-group">
        <label>
          <input
            type="checkbox"
            data-testid={`checkbox-select-all-${type}`}
            checked={allSelected}
            onChange={toggleAll}
          />
          Select All
        </label>
        {options.map((option) => (
          <label key={option.id} className={selectedIds.includes(option.id) ? 'selected' : ''}>
            <input
              type="checkbox"
              data-testid={`checkbox-item-${option.id}`}
              checked={selectedIds.includes(option.id)}
              onChange={() => toggleOne(option.id)}
            />
            {option.label}
          </label>
        ))}
      </div>
    </div>
  )
}
