import { useEffect, useState } from 'react'
import { BranchForm, BranchFormValues } from '../components/BranchForm'
import { BranchTable } from '../components/BranchTable'
import { Pagination } from '../components/Pagination'
import {
  ApiRequestError,
  Branch,
  RegionalOffice,
  createBranch,
  deleteBranch,
  listBranches,
  listRegionalOffices,
  updateBranch,
} from '../services/api'

/**
 * Branch management page (FR-006): create, list (paginated, filterable by
 * regional office), and edit. Delete uses the same simple confirmation
 * pattern as other masters.
 *
 * data-testid: `branches-page` (docs/design/design-doc.md).
 */
export function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([])
  const [regionalOffices, setRegionalOffices] = useState<RegionalOffice[]>([])
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [regionalOfficeFilter, setRegionalOfficeFilter] = useState<number | ''>('')
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [editing, setEditing] = useState<Branch | undefined>(undefined)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    listRegionalOffices(1, 100).then((result) => setRegionalOffices(result.data))
  }, [])

  const load = () => {
    setLoading(true)
    setLoadError(null)
    listBranches(page, limit, regionalOfficeFilter || undefined)
      .then((result) => {
        setBranches(result.data)
        setTotal(result.pagination.total)
        setTotalPages(result.pagination.totalPages)
      })
      .catch((error: ApiRequestError) => setLoadError(error.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, regionalOfficeFilter])

  const handleSubmit = async (values: BranchFormValues) => {
    setFormError(null)
    if (values.regionalOfficeId === '') {
      setFormError('regionalOfficeId is required')
      return
    }
    try {
      const payload = { ...values, regionalOfficeId: values.regionalOfficeId as number }
      if (editing) {
        await updateBranch(editing.id, payload)
      } else {
        await createBranch(payload)
      }
      setShowForm(false)
      setEditing(undefined)
      load()
    } catch (error) {
      setFormError(error instanceof ApiRequestError ? error.message : 'Failed to save branch')
    }
  }

  const handleDelete = async (branch: Branch) => {
    setDeleteError(null)
    try {
      await deleteBranch(branch.id)
      load()
    } catch (error) {
      setDeleteError(error instanceof ApiRequestError ? error.message : 'Failed to delete branch')
    }
  }

  return (
    <div data-testid="branches-page">
      <h1>Branches</h1>

      <label>
        Filter by Regional Office
        <select
          data-testid="branch-filter-regional-office"
          value={regionalOfficeFilter}
          onChange={(e) => {
            setRegionalOfficeFilter(e.target.value ? Number(e.target.value) : '')
            setPage(1)
          }}
        >
          <option value="">All Regional Offices</option>
          {regionalOffices.map((office) => (
            <option key={office.id} value={office.id}>
              {office.name}
            </option>
          ))}
        </select>
      </label>

      <button
        type="button"
        data-testid="create-branch"
        onClick={() => {
          setEditing(undefined)
          setShowForm(true)
        }}
      >
        Create Branch
      </button>

      {showForm && (
        <BranchForm
          regionalOffices={regionalOffices}
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

      {loading && <p>Loading branches...</p>}
      {loadError && <p role="alert">{loadError}</p>}
      {deleteError && <p role="alert">{deleteError}</p>}

      {!loading && !loadError && (
        <>
          <BranchTable
            branches={branches}
            onEdit={(branch) => {
              setEditing(branch)
              setShowForm(true)
            }}
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
