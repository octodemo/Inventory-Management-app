import { useEffect, useState } from 'react'
import { PremisesForm, PremisesFormValues } from '../components/PremisesForm'
import { PremisesTable } from '../components/PremisesTable'
import { Pagination } from '../components/Pagination'
import {
  ApiRequestError,
  Premises,
  Supervisor,
  createPremises,
  deletePremises,
  listPremises,
  listSupervisors,
  updatePremises,
} from '../services/api'

/**
 * Premises management page (FR-008, FR-010): create/edit with supervisor
 * assignment, paginated listing, and delete.
 *
 * data-testid: `premises-page`.
 */
export function PremisesPage() {
  const [premises, setPremises] = useState<Premises[]>([])
  const [supervisors, setSupervisors] = useState<Supervisor[]>([])
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [editing, setEditing] = useState<Premises | undefined>(undefined)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    listSupervisors(1, 100).then((result) => setSupervisors(result.data))
  }, [])

  const load = () => {
    setLoading(true)
    setLoadError(null)
    listPremises(page, limit)
      .then((result) => {
        setPremises(result.data)
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

  const handleSubmit = async (values: PremisesFormValues) => {
    setFormError(null)
    if (values.supervisorId === '') {
      setFormError('supervisorId is required')
      return
    }
    try {
      const payload = { ...values, supervisorId: values.supervisorId as number }
      if (editing) {
        await updatePremises(editing.id, payload)
      } else {
        await createPremises(payload)
      }
      setShowForm(false)
      setEditing(undefined)
      load()
    } catch (error) {
      setFormError(error instanceof ApiRequestError ? error.message : 'Failed to save premises')
    }
  }

  const handleDelete = async (premise: Premises) => {
    setDeleteError(null)
    try {
      await deletePremises(premise.id)
      load()
    } catch (error) {
      setDeleteError(error instanceof ApiRequestError ? error.message : 'Failed to delete premises')
    }
  }

  return (
    <div data-testid="premises-page">
      <h1>Premises</h1>
      <button
        type="button"
        data-testid="create-premises"
        onClick={() => {
          setEditing(undefined)
          setShowForm(true)
        }}
      >
        Create Premises
      </button>

      {showForm && (
        <PremisesForm
          supervisors={supervisors}
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

      {loading && <p>Loading premises...</p>}
      {loadError && <p role="alert">{loadError}</p>}
      {deleteError && <p role="alert">{deleteError}</p>}

      {!loading && !loadError && (
        <>
          <PremisesTable
            premises={premises}
            onEdit={(premise) => {
              setEditing(premise)
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
