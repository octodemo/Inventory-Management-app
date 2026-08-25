import { FormEvent, useCallback, useEffect, useState } from 'react'
import { hierarchyApi, inventoryApi, type Hierarchy, type InventoryInput, type InventoryItem, vendorApi, type Vendor } from '../services/catalogApi'
import { flattenHierarchy } from '../services/hierarchyTree'

const initialForm: InventoryInput = { name: '', description: '', vendorId: 0, hierarchyId: 0, unit: '' }

/** Inventory master page with filtered list and reusable create/edit form. */
export function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [hierarchies, setHierarchies] = useState<Hierarchy[]>([])
  const [filters, setFilters] = useState({ page: 1, search: '', vendorId: '', hierarchyId: '' })
  const [totalPages, setTotalPages] = useState(1)
  const [editing, setEditing] = useState<InventoryItem | undefined>()
  const [form, setForm] = useState<InventoryInput>(initialForm)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const result = await inventoryApi.list(filters)
      setItems(result.data)
      setTotalPages(Math.max(1, result.pagination.totalPages))
      setError('')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to load inventory items.')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => { void load() }, [load])
  useEffect(() => {
    void Promise.all([vendorApi.listAll(), hierarchyApi.tree()])
      .then(([allVendors, tree]) => { setVendors(allVendors); setHierarchies(flattenHierarchy(tree)) })
      .catch(() => setError('Unable to load inventory form selections.'))
  }, [])

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    try {
      if (editing) await inventoryApi.update(editing.id, form)
      else await inventoryApi.create(form)
      setMessage(`Inventory item ${editing ? 'updated' : 'created'} successfully.`)
      setEditing(undefined); setForm(initialForm); await load()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to save the inventory item.')
    }
  }

  const edit = async (id: number) => {
    try {
      const item = await inventoryApi.get(id)
      setEditing(item)
      setForm({ name: item.name, description: item.description ?? '', vendorId: item.vendorId, hierarchyId: item.hierarchyId, unit: item.unit })
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to load the inventory item.') }
  }

  const remove = async (item: InventoryItem) => {
    if (!window.confirm(`Delete ${item.name}?`)) return
    try { await inventoryApi.remove(item.id); setMessage('Inventory item deleted successfully.'); await load() }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to delete the inventory item.') }
  }

  return <section data-testid="inventory-page">
    <h2>Inventory</h2>
    {message && <p role="status">{message}</p>}
    {error && <p role="alert">{error}</p>}
    <form data-testid={editing ? 'inventory-item-edit-form' : 'inventory-item-create-form'} onSubmit={submit}>
      <h3>{editing ? 'Edit item' : 'Create item'}</h3>
      <input data-testid="inventory-name" aria-label="Item name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
      <input data-testid="inventory-description" aria-label="Description" value={form.description ?? ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <select data-testid="inventory-vendor" aria-label="Vendor" value={form.vendorId || ''} onChange={(e) => setForm({ ...form, vendorId: Number(e.target.value) })} required>
        <option value="">Select vendor</option>{vendors.map((vendor) => <option key={vendor.id} value={vendor.id}>{vendor.name}</option>)}
      </select>
      <select data-testid="inventory-hierarchy" aria-label="Hierarchy" value={form.hierarchyId || ''} onChange={(e) => setForm({ ...form, hierarchyId: Number(e.target.value) })} required>
        <option value="">Select hierarchy</option>{hierarchies.map((node) => <option key={node.id} value={node.id}>{node.name}</option>)}
      </select>
      <input data-testid="inventory-unit" aria-label="Unit" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} required />
      <button data-testid="inventory-submit" type="submit">{editing ? 'Save changes' : 'Create item'}</button>
      <button data-testid="inventory-cancel" type="button" onClick={() => { setEditing(undefined); setForm(initialForm) }}>Cancel</button>
    </form>
    <label>Search <input value={filters.search} onChange={(e) => setFilters({ ...filters, page: 1, search: e.target.value })} /></label>
    <label>Vendor <select value={filters.vendorId} onChange={(e) => setFilters({ ...filters, page: 1, vendorId: e.target.value })}><option value="">All</option>{vendors.map((vendor) => <option key={vendor.id} value={vendor.id}>{vendor.name}</option>)}</select></label>
    <label>Hierarchy <select value={filters.hierarchyId} onChange={(e) => setFilters({ ...filters, page: 1, hierarchyId: e.target.value })}><option value="">All</option>{hierarchies.map((node) => <option key={node.id} value={node.id}>{node.name}</option>)}</select></label>
    {loading ? <p>Loading inventory items…</p> : <table data-testid="inventory-item-list"><thead><tr><th>Name</th><th>Vendor</th><th>Hierarchy</th><th>Unit</th><th>Actions</th></tr></thead><tbody>
      {items.length ? items.map((item) => <tr data-testid="inventory-row" key={item.id}><td>{item.name}</td><td>{item.vendor.name}</td><td>{item.hierarchy.name}</td><td>{item.unit}</td><td><button onClick={() => void edit(item.id)}>Edit</button><button onClick={() => void remove(item)}>Delete</button></td></tr>) : <tr><td colSpan={5}>No inventory items found.</td></tr>}
    </tbody></table>}
    <button disabled={filters.page <= 1} onClick={() => setFilters({ ...filters, page: filters.page - 1 })}>Previous</button>
    <span>Page {filters.page} of {totalPages}</span>
    <button disabled={filters.page >= totalPages} onClick={() => setFilters({ ...filters, page: filters.page + 1 })}>Next</button>
  </section>
}
