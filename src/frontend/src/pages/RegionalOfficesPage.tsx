import { useEffect, useState } from 'react'
import { RegionalOfficeForm, RegionalOfficeFormValues } from '../components/RegionalOfficeForm'
import { RegionalOfficeTable } from '../components/RegionalOfficeTable'
import { Pagination } from '../components/Pagination'
import {
  ApiRequestError,
  RegionalOffice,
  createRegionalOffice,
  deleteRegionalOffice,
  listRegionalOffices,
  updateRegionalOffice,
} from '../services/api'

/**
 * Regional Office management page (FR-007): create, list (paginated, with
 * branch counts), edit, and delete-with-dependency-validation.
 *
 * data-testid: `regional-offices-page`.
 */
export function RegionalOfficesPage() {
  const [offices, setOffices] = useState<RegionalOffice[]>([])
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [editing, setEditing] = useState<RegionalOffice | undefined>(undefined)
  const [showForm, setShowForm] = useState(false)

  const load = () => {
    setLoading(true)
    setLoadError(null)
    listRegionalOffices(page, limit)
      .then((result) => {
        setOffices(result.data)
        setTotal(result.pagination.total)
        setTotalPages(result.pagination.totalPages)
      })
      .catch((error: ApiRequestError) => setLoadError(error.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit])

  const handleSubmit = async (values: RegionalOfficeFormValues) => {
    setFormError(null)
    try {
      if (editing) {
        await updateRegionalOffice(editing.id, values)
      } else {
        await createRegionalOffice(values)
      }
      setShowForm(false)
      setEditing(undefined)
      load()
    } catch (error) {
      setFormError(error instanceof ApiRequestError ? error.message : 'Failed to save regional office')
    }
  }

  const handleDelete = async (office: RegionalOffice) => {
    setDeleteError(null)
    try {
      await deleteRegionalOffice(office.id)
      load()
    } catch (error) {
      setDeleteError(
        error instanceof ApiRequestError ? error.message : 'Failed to delete regional office'
      )
    }
  }

  return (
    <div data-testid="regional-offices-page">
      <h1>Regional Offices</h1>
      <button
        type="button"
        data-testid="create-regional-office"
        onClick={() => {
          setEditing(undefined)
          setShowForm(true)
        }}
      >
        Create Regional Office
      </button>

      {showForm && (
        <RegionalOfficeForm
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

      {loading && <p>Loading regional offices...</p>}
      {loadError && <p role="alert">{loadError}</p>}

      {!loading && !loadError && (
        <>
          <RegionalOfficeTable
            offices={offices}
            deleteError={deleteError}
            onEdit={(office) => {
              setEditing(office)
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
