import { FormEvent, useCallback, useEffect, useState } from 'react'
import { hierarchyApi, type Hierarchy } from '../services/catalogApi'
import { flattenHierarchy } from '../services/hierarchyTree'

const emptyNode = { name: '', parentId: null as number | null }

/** Maintains and renders the four-level item categorisation tree. */
export function HierarchyPage() {
  const [tree, setTree] = useState<Hierarchy[]>([])
  const [nodes, setNodes] = useState<Hierarchy[]>([])
  const [form, setForm] = useState(emptyNode)
  const [editing, setEditing] = useState<Hierarchy | undefined>()
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<Set<number>>(new Set())
  const [parentFilter, setParentFilter] = useState('')
  const load = useCallback(async () => {
    setLoading(true)
    try { const result = await hierarchyApi.tree(); setTree(result); setNodes(flattenHierarchy(result)); setError('') }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to load hierarchies.') }
    finally { setLoading(false) }
  }, [])
  useEffect(() => { void load() }, [load])

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    try {
      if (editing) await hierarchyApi.update(editing.id, form); else await hierarchyApi.create(form)
      setMessage(`Hierarchy node ${editing ? 'updated' : 'created'} successfully.`); setEditing(undefined); setForm(emptyNode); await load()
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to save hierarchy node.') }
  }
  const edit = async (id: number) => {
    try { const node = await hierarchyApi.get(id); setEditing(node); setForm({ name: node.name, parentId: node.parentId }) }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to load hierarchy node.') }
  }
  const remove = async (node: Hierarchy) => {
    if (!window.confirm(`Delete ${node.name}?`)) return
    try { await hierarchyApi.remove(node.id); setMessage('Hierarchy node deleted successfully.'); await load() }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to delete hierarchy node.') }
  }
  const displayedTree = visibleTree(tree, nodes, parentFilter)

  return <section data-testid="hierarchy-page">
    <h2>Item Hierarchy</h2>{message && <p role="status">{message}</p>}{error && <p role="alert">{error}</p>}
    <form data-testid="hierarchy-form" onSubmit={submit}>
      <input aria-label="Hierarchy name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
      <select aria-label="Parent hierarchy" value={form.parentId ?? ''} onChange={(e) => setForm({ ...form, parentId: e.target.value ? Number(e.target.value) : null })}>
        <option value="">Root node</option>{nodes.filter((node) => node.id !== editing?.id).map((node) => <option key={node.id} value={node.id}>{node.name}</option>)}
      </select>
      <button type="submit">{editing ? 'Save changes' : 'Create node'}</button><button type="button" onClick={() => { setEditing(undefined); setForm(emptyNode) }}>Cancel</button>
    </form>
    <label>Show subtree <select value={parentFilter} onChange={(event) => setParentFilter(event.target.value)}><option value="">All root nodes</option>{nodes.map((node) => <option key={node.id} value={node.id}>{node.name}</option>)}</select></label>
    {loading ? <p>Loading hierarchy…</p> : <ul data-testid="hierarchy-tree">{displayedTree.length ? displayedTree.map((node) => <TreeNode key={node.id} node={node} expanded={expanded} setExpanded={setExpanded} onEdit={edit} onDelete={remove} />) : <li>No hierarchy nodes found.</li>}</ul>}
  </section>
}

function TreeNode({ node, expanded, setExpanded, onEdit, onDelete }: { node: Hierarchy; expanded: Set<number>; setExpanded: (value: Set<number>) => void; onEdit: (id: number) => void; onDelete: (node: Hierarchy) => void }) {
  const hasChildren = Boolean(node.children?.length)
  const isExpanded = expanded.has(node.id)
  return <li>
    {hasChildren && <button aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${node.name}`} onClick={() => { const next = new Set(expanded); isExpanded ? next.delete(node.id) : next.add(node.id); setExpanded(next) }}>{isExpanded ? '−' : '+'}</button>}
    {node.name} <button onClick={() => void onEdit(node.id)}>Edit</button><button onClick={() => void onDelete(node)}>Delete</button>
    {hasChildren && isExpanded && <ul>{node.children!.map((child) => <TreeNode key={child.id} node={child} expanded={expanded} setExpanded={setExpanded} onEdit={onEdit} onDelete={onDelete} />)}</ul>}
  </li>
}

function visibleTree(tree: Hierarchy[], nodes: Hierarchy[], parentId: string): Hierarchy[] {
  if (!parentId) return tree
  const node = nodes.find((candidate) => candidate.id === Number(parentId))
  return node ? [node] : []
}
