/// <reference types="vite/client" />

export interface Vendor {
  id: number
  name: string
  contactName: string | null
  contactEmail: string | null
  contactPhone: string | null
  address: string | null
}

export interface Hierarchy {
  id: number
  name: string
  parentId: number | null
  children?: Hierarchy[]
}

export interface InventoryItem {
  id: number
  name: string
  description: string | null
  vendorId: number
  hierarchyId: number
  unit: string
  vendor: Pick<Vendor, 'id' | 'name'>
  hierarchy: Pick<Hierarchy, 'id' | 'name'>
}

export interface ItemRate {
  id: number
  itemId: number
  rate: number
  effectiveFrom: string
  effectiveTo: string | null
  item: Pick<InventoryItem, 'id' | 'name'>
}

export interface Page<T> {
  data: T[]
  pagination: { page: number; limit: number; total: number; totalPages: number }
}

export type InventoryInput = Pick<InventoryItem, 'name' | 'description' | 'vendorId' | 'hierarchyId' | 'unit'>
export type VendorInput = Omit<Vendor, 'id'>
export type HierarchyInput = Pick<Hierarchy, 'name' | 'parentId'>
export type RateInput = Pick<ItemRate, 'itemId' | 'rate' | 'effectiveFrom' | 'effectiveTo'>

const baseUrl = import.meta.env.VITE_API_URL ?? '/api'

/** Converts API error responses into display-ready error messages. */
async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  })
  if (response.status === 204) return undefined as T
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(payload.message ?? 'The request could not be completed.')
  return payload as T
}

const queryString = (filters: Record<string, string | number | undefined>) => {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') params.set(key, String(value))
  })
  const query = params.toString()
  return query ? `?${query}` : ''
}

async function allPages<T>(loadPage: (page: number) => Promise<Page<T>>): Promise<T[]> {
  const first = await loadPage(1)
  if (first.pagination.totalPages <= 1) return first.data
  const remaining = await Promise.all(
    Array.from({ length: first.pagination.totalPages - 1 }, (_, index) => loadPage(index + 2)),
  )
  return [first, ...remaining].flatMap((result) => result.data)
}

export const inventoryApi = {
  list: (filters: Record<string, string | number | undefined>) => request<Page<InventoryItem>>(`/inventory${queryString(filters)}`),
  listAll: () => allPages((page) => inventoryApi.list({ page, limit: 100 })),
  get: (id: number) => request<InventoryItem>(`/inventory/${id}`),
  create: (data: InventoryInput) => request<InventoryItem>('/inventory', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: InventoryInput) => request<InventoryItem>(`/inventory/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id: number) => request<void>(`/inventory/${id}`, { method: 'DELETE' }),
}

export const vendorApi = {
  list: (filters: Record<string, string | number | undefined>) => request<Page<Vendor>>(`/vendors${queryString(filters)}`),
  listAll: () => allPages((page) => vendorApi.list({ page, limit: 100 })),
  get: (id: number) => request<Vendor>(`/vendors/${id}`),
  create: (data: VendorInput) => request<Vendor>('/vendors', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: VendorInput) => request<Vendor>(`/vendors/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id: number) => request<void>(`/vendors/${id}`, { method: 'DELETE' }),
}

export const hierarchyApi = {
  tree: () => request<Hierarchy[]>('/hierarchies'),
  get: (id: number) => request<Hierarchy>(`/hierarchies/${id}`),
  create: (data: HierarchyInput) => request<Hierarchy>('/hierarchies', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: HierarchyInput) => request<Hierarchy>(`/hierarchies/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id: number) => request<void>(`/hierarchies/${id}`, { method: 'DELETE' }),
}

export const rateApi = {
  list: (filters: Record<string, string | number | undefined>) => request<Page<ItemRate>>(`/rates${queryString(filters)}`),
  get: (id: number) => request<ItemRate>(`/rates/${id}`),
  create: (data: RateInput) => request<ItemRate>('/rates', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: RateInput) => request<ItemRate>(`/rates/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id: number) => request<void>(`/rates/${id}`, { method: 'DELETE' }),
}
