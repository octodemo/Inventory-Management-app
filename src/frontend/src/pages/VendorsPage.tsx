import { FormEvent, useCallback, useEffect, useState } from 'react'
import { type Vendor, type VendorInput, vendorApi } from '../services/catalogApi'

const blankVendor: VendorInput = { name: '', contactName: null, contactEmail: null, contactPhone: null, address: null }

/** Vendor master page with searchable list and create/edit/delete controls. */
export function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [form, setForm] = useState<VendorInput>(blankVendor)
  const [editing, setEditing] = useState<Vendor | undefined>()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const load = useCallback(async () => {
    setLoading(true)
    try { const result = await vendorApi.list({ page, search }); setVendors(result.data); setTotalPages(Math.max(1, result.pagination.totalPages)); setError('') }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to load vendors.') }
    finally { setLoading(false) }
  }, [page, search])
  useEffect(() => { void load() }, [load])

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    try {
      if (editing) await vendorApi.update(editing.id, form); else await vendorApi.create(form)
      setMessage(`Vendor ${editing ? 'updated' : 'created'} successfully.`); setEditing(undefined); setForm(blankVendor); await load()
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to save vendor.') }
  }
  const edit = async (id: number) => {
    try { const vendor = await vendorApi.get(id); setEditing(vendor); setForm(vendor) }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to load vendor.') }
  }
  const remove = async (vendor: Vendor) => {
    if (!window.confirm(`Delete ${vendor.name}?`)) return
    try { await vendorApi.remove(vendor.id); setMessage('Vendor deleted successfully.'); await load() }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to delete vendor.') }
  }
  const update = (key: keyof VendorInput, value: string) => {
    setForm((current) => ({ ...current, [key]: key === 'name' ? value : value || null } as VendorInput))
  }

  return <section data-testid="vendors-page">
    <h2>Vendors</h2>{message && <p role="status">{message}</p>}{error && <p role="alert">{error}</p>}
    <form data-testid="vendor-form" onSubmit={submit}>
      <input data-testid="vendor-name" aria-label="Vendor name" value={form.name} onChange={(e) => update('name', e.target.value)} required />
      <input data-testid="vendor-contact-name" aria-label="Contact name" value={form.contactName ?? ''} onChange={(e) => update('contactName', e.target.value)} />
      <input data-testid="vendor-contact-email" aria-label="Contact email" type="email" value={form.contactEmail ?? ''} onChange={(e) => update('contactEmail', e.target.value)} />
      <input data-testid="vendor-contact-phone" aria-label="Contact phone" value={form.contactPhone ?? ''} onChange={(e) => update('contactPhone', e.target.value)} />
      <textarea data-testid="vendor-address" aria-label="Address" value={form.address ?? ''} onChange={(e) => update('address', e.target.value)} />
      <button type="submit">{editing ? 'Save changes' : 'Create vendor'}</button><button type="button" onClick={() => { setEditing(undefined); setForm(blankVendor) }}>Cancel</button>
    </form>
    <label>Search <input value={search} onChange={(e) => { setPage(1); setSearch(e.target.value) }} /></label>
    {loading ? <p>Loading vendors…</p> : <table data-testid="vendor-table"><thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Actions</th></tr></thead><tbody>
      {vendors.length ? vendors.map((vendor) => <tr data-testid="vendor-row" key={vendor.id}><td>{vendor.name}</td><td>{vendor.contactEmail}</td><td>{vendor.contactPhone}</td><td><button onClick={() => void edit(vendor.id)}>Edit</button><button onClick={() => void remove(vendor)}>Delete</button></td></tr>) : <tr><td colSpan={4}>No vendors found.</td></tr>}
    </tbody></table>}
    <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button><span>Page {page} of {totalPages}</span><button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
  </section>
}
