import { useEffect, useState } from 'react'
import { ReportFilters, ReportFilterValues } from '../components/ReportFilters'
import { ReportTable } from '../components/ReportTable'
import { Pagination } from '../components/Pagination'
import { MultiSelectOption } from '../components/MultiSelectCheckboxFilter'
import {
  ApiRequestError,
  ReportResponse,
  generateReport,
  listBranches,
  listInventoryItemsLookup,
  listRegionalOffices,
  listVendorsLookup,
} from '../services/api'

const DEFAULT_FILTERS: ReportFilterValues = {
  reportType: 'item-wise',
  itemIds: [],
  branchIds: [],
  regionalOfficeIds: [],
  vendorIds: [],
  startDate: '',
  endDate: '',
}

/** Field holding drill-down children for each report type, if any (FR-015, FR-023). */
const EXPANDABLE_FIELD: Record<ReportFilterValues['reportType'], string | undefined> = {
  'item-wise': 'usageByBranch',
  'branch-wise': 'items',
  'regional-office-wise': 'branches',
  'hierarchy-wise': 'items',
  'vendor-wise': 'items',
}

/**
 * Reports page (FR-011 – FR-015, FR-023): report type selector, multi-select
 * filters, tabular results with sortable/paginated data, drill-down rows for
 * vendor-wise and hierarchy-wise reports, and branch/regional-office summary
 * cards.
 *
 * data-testid: `reports-page` (docs/design/design-doc.md).
 */
export function ReportsPage() {
  const [filters, setFilters] = useState<ReportFilterValues>(DEFAULT_FILTERS)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [orderBy, setOrderBy] = useState<string | undefined>(undefined)
  const [direction, setDirection] = useState<'asc' | 'desc'>('asc')

  const [items, setItems] = useState<MultiSelectOption[]>([])
  const [branches, setBranches] = useState<MultiSelectOption[]>([])
  const [regionalOffices, setRegionalOffices] = useState<MultiSelectOption[]>([])
  const [vendors, setVendors] = useState<MultiSelectOption[]>([])

  const [result, setResult] = useState<ReportResponse<Record<string, unknown>> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    listInventoryItemsLookup().then((res) => setItems(res.data.map((i) => ({ id: i.id, label: i.name }))))
    listBranches(1, 200).then((res) => setBranches(res.data.map((b) => ({ id: b.id, label: b.name }))))
    listRegionalOffices(1, 100).then((res) =>
      setRegionalOffices(res.data.map((o) => ({ id: o.id, label: o.name })))
    )
    listVendorsLookup().then((res) => setVendors(res.data.map((v) => ({ id: v.id, label: v.name }))))
  }, [])

  const runReport = (
    nextFilters: ReportFilterValues,
    nextPage: number,
    nextOrderBy?: string,
    nextDirection?: 'asc' | 'desc'
  ) => {
    setLoading(true)
    setError(null)
    generateReport(nextFilters.reportType, {
      itemIds: nextFilters.itemIds.length ? nextFilters.itemIds : undefined,
      branchIds: nextFilters.branchIds.length ? nextFilters.branchIds : undefined,
      regionalOfficeIds: nextFilters.regionalOfficeIds.length ? nextFilters.regionalOfficeIds : undefined,
      vendorIds: nextFilters.vendorIds.length ? nextFilters.vendorIds : undefined,
      startDate: nextFilters.startDate || undefined,
      endDate: nextFilters.endDate || undefined,
      page: nextPage,
      limit,
      orderBy: nextOrderBy,
      direction: nextDirection,
    })
      .then(setResult)
      .catch((err: ApiRequestError) => setError(err.message))
      .finally(() => setLoading(false))
  }

  const handleApply = (nextFilters: ReportFilterValues) => {
    setFilters(nextFilters)
    setPage(1)
    setOrderBy(undefined)
    runReport(nextFilters, 1, undefined, 'asc')
  }

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage)
    runReport(filters, nextPage, orderBy, direction)
  }

  const handleLimitChange = (nextLimit: number) => {
    setLimit(nextLimit)
    setPage(1)
  }

  useEffect(() => {
    runReport(filters, page, orderBy, direction)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit])

  const handleSortChange = (nextOrderBy: string, nextDirection: 'asc' | 'desc') => {
    setOrderBy(nextOrderBy)
    setDirection(nextDirection)
    runReport(filters, page, nextOrderBy, nextDirection)
  }

  return (
    <div data-testid="reports-page">
      <h1>Usage Reports</h1>

      <ReportFilters
        items={items}
        branches={branches}
        regionalOffices={regionalOffices}
        vendors={vendors}
        value={filters}
        onApply={handleApply}
      />

      {loading && <p>Generating report...</p>}
      {error && <p role="alert">{error}</p>}

      {result?.summary && (
        <div data-testid="report-summary" className="report-summary">
          {Object.entries(result.summary).map(([key, value]) => (
            <div key={key} data-testid={`report-summary-${key}`}>
              <strong>{key}:</strong> {value}
            </div>
          ))}
        </div>
      )}

      {result && !loading && !error && (
        <>
          <ReportTable
            columns={result.columns}
            rows={result.data}
            orderBy={orderBy}
            direction={direction}
            onSortChange={handleSortChange}
            expandableField={EXPANDABLE_FIELD[filters.reportType]}
            renderExpandedRow={(row) => {
              const field = EXPANDABLE_FIELD[filters.reportType]
              const children = field ? (row[field] as Array<Record<string, unknown>> | undefined) : undefined
              if (!children || children.length === 0) return null
              return (
                <ul>
                  {children.map((child, idx) => (
                    <li key={idx}>{JSON.stringify(child)}</li>
                  ))}
                </ul>
              )
            }}
          />
          <Pagination
            page={result.pagination.page}
            limit={result.pagination.limit}
            total={result.pagination.total}
            totalPages={result.pagination.totalPages}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
          />
        </>
      )}
    </div>
  )
}
