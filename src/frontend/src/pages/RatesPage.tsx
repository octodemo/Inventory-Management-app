import { FormEvent, useCallback, useEffect, useState } from 'react'
import { inventoryApi, rateApi, type InventoryItem, type ItemRate, type RateInput } from '../services/catalogApi'

const blankRate: RateInput = { itemId: 0, rate: 0, effectiveFrom: '', effectiveTo: null }

/** Provides rate history and effective-date maintenance for inventory items. */
export function RatesPage() {
  const [rates, setRates] = useState<ItemRate[]>([])
  const [items, setItems] = useState<InventoryItem[]>([])
  const [form, setForm] = useState<RateInput>(blankRate)
  const [editing, setEditing] = useState<ItemRate | undefined>()
  const [itemId, setItemId] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const load = useCallback(async () => {
    setLoading(true)
    try { const result = await rateApi.list({ itemId: itemId || undefined, page }); setRates(result.data); setTotalPages(Math.max(1, result.pagination.totalPages)); setError('') }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to load item rates.') }
    finally { setLoading(false) }
  }, [itemId, page])
  useEffect(() => { void load() }, [load])
  useEffect(() => { void inventoryApi.listAll().then(setItems).catch(() => setError('Unable to load inventory items.')) }, [])

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    try {
      if (editing) await rateApi.update(editing.id, form); else await rateApi.create(form)
      setMessage(`Item rate ${editing ? 'updated' : 'created'} successfully.`); setEditing(undefined); setForm(blankRate); await load()
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to save item rate.') }
  }
  const edit = async (id: number) => {
    try {
      const rate = await rateApi.get(id); setEditing(rate)
      setForm({ itemId: rate.itemId, rate: rate.rate, effectiveFrom: rate.effectiveFrom.slice(0, 10), effectiveTo: rate.effectiveTo?.slice(0, 10) ?? null })
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to load item rate.') }
  }
  const remove = async (rate: ItemRate) => {
    if (!window.confirm(`Delete the rate for ${rate.item.name}?`)) return
    try { await rateApi.remove(rate.id); setMessage('Item rate deleted successfully.'); await load() }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to delete item rate.') }
  }
  return <section>
    <h2>Item Rates</h2>{message && <p role="status">{message}</p>}{error && <p role="alert">{error}</p>}
    <form data-testid="item-rate-form" onSubmit={submit}>
      <select aria-label="Inventory item" value={form.itemId || ''} onChange={(e) => setForm({ ...form, itemId: Number(e.target.value) })} required><option value="">Select item</option>{items.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
      <input aria-label="Rate" type="number" min="0.01" step="0.01" value={form.rate || ''} onChange={(e) => setForm({ ...form, rate: Number(e.target.value) })} required />
      <input aria-label="Effective from" type="date" value={form.effectiveFrom} onChange={(e) => setForm({ ...form, effectiveFrom: e.target.value })} required />
      <input aria-label="Effective to" type="date" value={form.effectiveTo ?? ''} onChange={(e) => setForm({ ...form, effectiveTo: e.target.value || null })} />
      <button type="submit">{editing ? 'Save changes' : 'Add rate'}</button><button type="button" onClick={() => { setEditing(undefined); setForm(blankRate) }}>Cancel</button>
    </form>
    <label>Filter by item <select value={itemId} onChange={(e) => { setItemId(e.target.value); setPage(1) }}><option value="">All items</option>{items.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
    {loading ? <p>Loading rate history…</p> : <table data-testid="rate-history-table"><thead><tr><th>Item</th><th>Rate</th><th>Effective from</th><th>Effective to</th><th>Actions</th></tr></thead><tbody>
      {rates.length ? rates.map((rate) => <tr key={rate.id}><td>{rate.item.name}</td><td>{rate.rate}</td><td>{new Date(rate.effectiveFrom).toLocaleDateString()}</td><td>{rate.effectiveTo ? new Date(rate.effectiveTo).toLocaleDateString() : 'Current'}</td><td><button onClick={() => void edit(rate.id)}>Edit</button><button onClick={() => void remove(rate)}>Delete</button></td></tr>) : <tr><td colSpan={5}>No item rates found.</td></tr>}
    </tbody></table>}
    <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button><span>Page {page} of {totalPages}</span><button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
  </section>
}
