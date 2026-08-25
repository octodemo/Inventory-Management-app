import { useState } from 'react'
import { MultiSelectCheckboxFilter, MultiSelectOption } from './MultiSelectCheckboxFilter'
import { ReportType } from '../services/api'

export interface ReportFilterValues {
  reportType: ReportType
  itemIds: number[]
  branchIds: number[]
  regionalOfficeIds: number[]
  vendorIds: number[]
  startDate: string
  endDate: string
}

interface ReportFiltersProps {
  items: MultiSelectOption[]
  branches: MultiSelectOption[]
  regionalOffices: MultiSelectOption[]
  vendors: MultiSelectOption[]
  value: ReportFilterValues
  onApply: (value: ReportFilterValues) => void
}

const REPORT_TYPE_OPTIONS: Array<{ value: ReportType; label: string }> = [
  { value: 'item-wise', label: 'Item-wise' },
  { value: 'branch-wise', label: 'Branch-wise' },
  { value: 'regional-office-wise', label: 'Regional Office-wise' },
  { value: 'hierarchy-wise', label: 'Hierarchy-wise' },
  { value: 'vendor-wise', label: 'Vendor-wise' },
]

/**
 * Filter panel for the Reports page (FR-011, FR-012, FR-013, FR-014,
 * FR-015, FR-023): report type selector, multi-select checkboxes for items,
 * branches, regional offices, and vendors, and a date range picker.
 *
 * data-testid values per docs/design/design-doc.md: `report-filters`,
 * `filter-report-type`, `filter-start-date`, `filter-end-date`, `filter-apply`.
 */
export function ReportFilters({ items, branches, regionalOffices, vendors, value, onApply }: ReportFiltersProps) {
  const [draft, setDraft] = useState<ReportFilterValues>(value)

  const update = <K extends keyof ReportFilterValues>(key: K, next: ReportFilterValues[K]) => {
    setDraft((prev) => ({ ...prev, [key]: next }))
  }

  return (
    <div data-testid="report-filters" className="report-filters">
      <label>
        Report Type
        <select
          data-testid="filter-report-type"
          value={draft.reportType}
          onChange={(e) => update('reportType', e.target.value as ReportType)}
        >
          {REPORT_TYPE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      {draft.reportType === 'item-wise' && (
        <MultiSelectCheckboxFilter
          type="items"
          label="Items"
          options={items}
          selectedIds={draft.itemIds}
          onChange={(ids) => update('itemIds', ids)}
        />
      )}

      {(draft.reportType === 'branch-wise' || draft.reportType === 'regional-office-wise') && (
        <MultiSelectCheckboxFilter
          type="branches"
          label="Branches"
          options={branches}
          selectedIds={draft.branchIds}
          onChange={(ids) => update('branchIds', ids)}
        />
      )}

      {draft.reportType === 'regional-office-wise' && (
        <MultiSelectCheckboxFilter
          type="regional-offices"
          label="Regional Offices"
          options={regionalOffices}
          selectedIds={draft.regionalOfficeIds}
          onChange={(ids) => update('regionalOfficeIds', ids)}
        />
      )}

      {draft.reportType === 'vendor-wise' && (
        <MultiSelectCheckboxFilter
          type="vendors"
          label="Vendors"
          options={vendors}
          selectedIds={draft.vendorIds}
          onChange={(ids) => update('vendorIds', ids)}
        />
      )}

      <label>
        Start Date
        <input
          type="date"
          data-testid="filter-start-date"
          value={draft.startDate}
          onChange={(e) => update('startDate', e.target.value)}
        />
      </label>

      <label>
        End Date
        <input
          type="date"
          data-testid="filter-end-date"
          value={draft.endDate}
          onChange={(e) => update('endDate', e.target.value)}
        />
      </label>

      <button type="button" data-testid="filter-apply" onClick={() => onApply(draft)}>
        Apply
      </button>
    </div>
  )
}
