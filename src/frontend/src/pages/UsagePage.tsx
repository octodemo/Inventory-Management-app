import { useEffect, useState } from 'react'
import { UsageForm, UsageFormValues } from '../components/UsageForm'
import { UsageTable } from '../components/UsageTable'
import { Pagination } from '../components/Pagination'
import { useAuth } from '../context/AuthContext'
import {
  ApiRequestError,
  Branch,
  InventoryItemLookup,
  UsageRecord,
  createUsageRecord,
  deleteUsageRecord,
  getUsageRecord,
  listBranches,
  listInventoryItemsLookup,
  listUsageRecords,
  updateUsageRecord,
} from '../services/api'

/**
 * Usage record page (FR-003, FR-021): create/edit form, filterable and
 * paginated usage table, and Admin-only delete (story-04-01-04).
 *
 * data-testid values per docs/design/design-doc.md: `usage-page`, `usage-table`.
 */
export function UsagePage() {
  const { hasRole } = useAuth()
  const [records, setRecords] = useState<UsageRecord[]>([])
  const [items, setItems] = useState<InventoryItemLookup[]>([])
  const [branches, setBranches] = useState<Branch[]>([])

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const [itemFilter, setItemFilter] = useState<number | ''>('')
  const [branchFilter, setBranchFilter] = useState<number | ''>('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [editing, setEditing] = useState<UsageRecord | undefined>(undefined)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    listInventoryItemsLookup().then((result) => setItems(result.data))
    listBranches(1, 200).then((result) => setBranches(result.data))
  }, [])

  const load = () => {
    setLoading(true)
    setLoadError(null)
    listUsageRecords({
      page,
      limit,
      itemIds: itemFilter ? [itemFilter] : undefined,
      branchIds: branchFilter ? [branchFilter] : undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    })
      .then((result) => {
        setRecords(result.data)
        setTotal(result.pagination.total)
        setTotalPages(result.pagination.totalPages)
      })
      .catch((error: ApiRequestError) => setLoadError(error.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, itemFilter, branchFilter, startDate, endDate])

  const handleSubmit = async (values: UsageFormValues) => {
    setFormError(null)
    if (values.itemId === '' || values.branchId === '' || values.quantity === '') {
      setFormError('item, branch, and quantity are required')
      return
    }
    try {
      const payload = {
        itemId: values.itemId as number,
        branchId: values.branchId as number,
        quantity: values.quantity as number,
        usageDate: values.usageDate,
        notes: values.notes || undefined,
      }
      if (editing) {
        await updateUsageRecord(editing.id, payload)
      } else {
        await createUsageRecord(payload)
      }
      setShowForm(false)
      setEditing(undefined)
      load()
    } catch (error) {
      setFormError(error instanceof ApiRequestError ? error.message : 'Failed to save usage record')
    }
  }

  const handleEdit = async (record: UsageRecord) => {
    const detail = await getUsageRecord(record.id)
    setEditing(detail)
    setShowForm(true)
  }

  const handleDelete = async (record: UsageRecord) => {
    setDeleteError(null)
    if (!window.confirm(`Delete usage record #${record.id}?`)) {
      return
    }
    try {
      await deleteUsageRecord(record.id)
      load()
    } catch (error) {
      setDeleteError(
        error instanceof ApiRequestError ? error.message : 'Failed to delete usage record'
      )
    }
  }

  return (
    <div data-testid="usage-page">
      <h1>Usage Records</h1>

      <div className="usage-filters">
        <label>
          Item
          <select
            value={itemFilter}
            onChange={(e) => {
              setItemFilter(e.target.value ? Number(e.target.value) : '')
              setPage(1)
            }}
          >
            <option value="">All Items</option>
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
            value={branchFilter}
            onChange={(e) => {
              setBranchFilter(e.target.value ? Number(e.target.value) : '')
              setPage(1)
            }}
          >
            <option value="">All Branches</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Start Date
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value)
              setPage(1)
            }}
          />
        </label>
        <label>
          End Date
          <input
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value)
              setPage(1)
            }}
          />
        </label>
      </div>

      <button
        type="button"
        data-testid="create-usage"
        onClick={() => {
          setEditing(undefined)
          setShowForm(true)
        }}
      >
        Record Usage
      </button>

      {showForm && (
        <UsageForm
          items={items}
          branches={branches}
          initialValues={editing}
          error={formError}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false)
            setEditing(undefined)
            setFormError(null)
          }}
        />
      )}

      {loading && <p>Loading usage records...</p>}
      {loadError && <p role="alert">{loadError}</p>}

      {!loading && !loadError && (
        <>
          <UsageTable
            records={records}
            isAdmin={hasRole('ADMIN')}
            deleteError={deleteError}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          <Pagination
            page={page}
            limit={limit}
            total={total}
            totalPages={totalPages}
            onPageChange={setPage}
            onLimitChange={(next) => {
              setLimit(next)
              setPage(1)
            }}
          />
        </>
      )}
    </div>
  )
}
