import { useEffect, useState } from 'react'
import { SupervisorForm, SupervisorFormValues } from '../components/SupervisorForm'
import { SupervisorTable } from '../components/SupervisorTable'
import { Pagination } from '../components/Pagination'
import {
  ApiRequestError,
  Supervisor,
  createSupervisor,
  deleteSupervisor,
  getSupervisor,
  listSupervisors,
  updateSupervisor,
} from '../services/api'

/**
 * Supervisor management page (FR-009): create, list (paginated), edit, view
 * assigned premises, and delete-with-dependency-validation.
 *
 * data-testid: `supervisors-page`.
 */
export function SupervisorsPage() {
  const [supervisors, setSupervisors] = useState<Supervisor[]>([])
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [editing, setEditing] = useState<Supervisor | undefined>(undefined)
  const [showForm, setShowForm] = useState(false)
  const [viewing, setViewing] = useState<Supervisor | undefined>(undefined)

  const load = () => {
    setLoading(true)
    setLoadError(null)
    listSupervisors(page, limit)
      .then((result) => {
        setSupervisors(result.data)
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

  const handleSubmit = async (values: SupervisorFormValues) => {
    setFormError(null)
    try {
      if (editing) {
        await updateSupervisor(editing.id, values)
      } else {
        await createSupervisor(values)
      }
      setShowForm(false)
      setEditing(undefined)
      load()
    } catch (error) {
      setFormError(error instanceof ApiRequestError ? error.message : 'Failed to save supervisor')
    }
  }

  const handleDelete = async (supervisor: Supervisor) => {
    setDeleteError(null)
    try {
      await deleteSupervisor(supervisor.id)
      load()
    } catch (error) {
      setDeleteError(error instanceof ApiRequestError ? error.message : 'Failed to delete supervisor')
    }
  }

  const handleView = async (supervisor: Supervisor) => {
    const detail = await getSupervisor(supervisor.id)
    setViewing(detail)
  }

  return (
    <div data-testid="supervisors-page">
      <h1>Supervisors</h1>
      <button
        type="button"
        data-testid="create-supervisor"
        onClick={() => {
          setEditing(undefined)
          setShowForm(true)
        }}
      >
        Create Supervisor
      </button>

      {showForm && (
        <SupervisorForm
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

      {viewing && (
        <div data-testid="supervisor-detail">
          <h2>{viewing.name}</h2>
          <ul>
            {(viewing.premises ?? []).map((premise) => (
              <li key={premise.id}>{premise.name}</li>
            ))}
          </ul>
          <button type="button" onClick={() => setViewing(undefined)}>
            Close
          </button>
        </div>
      )}

      {loading && <p>Loading supervisors...</p>}
      {loadError && <p role="alert">{loadError}</p>}

      {!loading && !loadError && (
        <>
          <SupervisorTable
            supervisors={supervisors}
            deleteError={deleteError}
            onView={handleView}
            onEdit={(supervisor) => {
              setEditing(supervisor)
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
