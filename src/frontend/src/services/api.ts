// API service functions for Feature Area 3 (organizational structure, usage
// tracking, and reporting). All HTTP calls for these domains live here per
// workshop-stack.md (`services_folder`) — components must not call fetch
// directly.
//
// Authentication and menu API access (login/logout/fetchCurrentUser/fetchMenu)
// use {@link apiFetch} instead, which sends the session cookie.

const API_BASE = '/api'

/** Standard API error shape returned by the Express backend. */
export interface ApiErrorBody {
  message: string
  status: number
  timestamp: string
}

/** Error thrown by `request()` when the API responds with a non-2xx status. */
export class ApiRequestError extends Error {
  status: number

  constructor(body: ApiErrorBody) {
    super(body.message)
    this.status = body.status
  }
}

/**
 * Shared fetch wrapper used by every API function in this module. Parses
 * JSON responses and throws `ApiRequestError` (with the standard
 * `{ message, status, timestamp }` body) for non-2xx responses.
 *
 * @param path - API path relative to `/api`, e.g. `/branches`.
 * @param options - Optional fetch options (method, body, etc.).
 */
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
  })

  if (response.status === 204) {
    return undefined as T
  }

  const body = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new ApiRequestError({
      message: body.message ?? response.statusText,
      status: body.status ?? response.status,
      timestamp: body.timestamp ?? new Date().toISOString(),
    })
  }

  return body as T
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

// ---------------------------------------------------------------------------
// Regional Offices (FR-007)
// ---------------------------------------------------------------------------

export interface RegionalOffice {
  id: number
  name: string
  code: string
  address?: string | null
  branchCount: number
}

/** Fetches a paginated list of regional offices with branch counts. */
export function listRegionalOffices(page = 1, limit = 20) {
  return request<{ data: RegionalOffice[]; pagination: PaginationMeta }>(
    `/regional-offices?page=${page}&limit=${limit}`
  )
}

/** Creates a new regional office. */
export function createRegionalOffice(input: { name: string; code: string; address?: string }) {
  return request<RegionalOffice>('/regional-offices', { method: 'POST', body: JSON.stringify(input) })
}

/** Updates an existing regional office. */
export function updateRegionalOffice(id: number, input: { name: string; code: string; address?: string }) {
  return request<RegionalOffice>(`/regional-offices/${id}`, { method: 'PUT', body: JSON.stringify(input) })
}

/** Deletes a regional office. Rejects with `ApiRequestError` (409) if branches are still assigned. */
export function deleteRegionalOffice(id: number) {
  return request<void>(`/regional-offices/${id}`, { method: 'DELETE' })
}

// ---------------------------------------------------------------------------
// Branches (FR-006)
// ---------------------------------------------------------------------------

export interface Branch {
  id: number
  name: string
  code: string
  address?: string | null
  regionalOfficeId: number
  regionalOfficeName: string
}

/** Fetches a paginated list of branches, optionally filtered by regional office. */
export function listBranches(page = 1, limit = 20, regionalOfficeId?: number) {
  const officeParam = regionalOfficeId ? `&regionalOfficeId=${regionalOfficeId}` : ''
  return request<{ data: Branch[]; pagination: PaginationMeta }>(
    `/branches?page=${page}&limit=${limit}${officeParam}`
  )
}

/** Creates a new branch. */
export function createBranch(input: { name: string; code: string; regionalOfficeId: number; address?: string }) {
  return request<Branch>('/branches', { method: 'POST', body: JSON.stringify(input) })
}

/** Updates an existing branch. */
export function updateBranch(
  id: number,
  input: { name: string; code: string; regionalOfficeId: number; address?: string }
) {
  return request<Branch>(`/branches/${id}`, { method: 'PUT', body: JSON.stringify(input) })
}

/** Deletes a branch. */
export function deleteBranch(id: number) {
  return request<void>(`/branches/${id}`, { method: 'DELETE' })
}

// ---------------------------------------------------------------------------
// Supervisors (FR-009)
// ---------------------------------------------------------------------------

export interface Supervisor {
  id: number
  name: string
  email: string
  phone?: string | null
  premisesCount?: number
  premises?: Array<{ id: number; name: string; address?: string | null }>
}

/** Fetches a paginated list of supervisors. */
export function listSupervisors(page = 1, limit = 20) {
  return request<{ data: Supervisor[]; pagination: PaginationMeta }>(`/supervisors?page=${page}&limit=${limit}`)
}

/** Fetches a supervisor by id, including assigned premises. */
export function getSupervisor(id: number) {
  return request<Supervisor>(`/supervisors/${id}`)
}

/** Creates a new supervisor. */
export function createSupervisor(input: { name: string; email: string; phone?: string }) {
  return request<Supervisor>('/supervisors', { method: 'POST', body: JSON.stringify(input) })
}

/** Updates an existing supervisor. */
export function updateSupervisor(id: number, input: { name: string; email: string; phone?: string }) {
  return request<Supervisor>(`/supervisors/${id}`, { method: 'PUT', body: JSON.stringify(input) })
}

/** Deletes a supervisor. Rejects with `ApiRequestError` (409) if premises are still assigned. */
export function deleteSupervisor(id: number) {
  return request<void>(`/supervisors/${id}`, { method: 'DELETE' })
}

// ---------------------------------------------------------------------------
// Premises (FR-008, FR-010)
// ---------------------------------------------------------------------------

export interface Premises {
  id: number
  name: string
  address?: string | null
  supervisorId: number
  supervisorName: string
}

/** Fetches a paginated list of premises with their assigned supervisor. */
export function listPremises(page = 1, limit = 20) {
  return request<{ data: Premises[]; pagination: PaginationMeta }>(`/premises?page=${page}&limit=${limit}`)
}

/** Creates a new premises record with a supervisor assignment. */
export function createPremises(input: { name: string; address?: string; supervisorId: number }) {
  return request<Premises>('/premises', { method: 'POST', body: JSON.stringify(input) })
}

/** Updates a premises record, allowing the supervisor assignment to change. */
export function updatePremises(id: number, input: { name: string; address?: string; supervisorId: number }) {
  return request<Premises>(`/premises/${id}`, { method: 'PUT', body: JSON.stringify(input) })
}

/** Deletes a premises record. */
export function deletePremises(id: number) {
  return request<void>(`/premises/${id}`, { method: 'DELETE' })
}

// ---------------------------------------------------------------------------
// Usage Records (FR-003, FR-021, FR-022)
// ---------------------------------------------------------------------------

export interface UsageRecord {
  id: number
  itemId: number
  branchId: number
  quantity: number
  usageDate: string
  notes?: string | null
  item?: { id: number; name: string }
  branch?: { id: number; name: string }
}

export interface UsageRecordFilters {
  page?: number
  limit?: number
  startDate?: string
  endDate?: string
  branchIds?: number[]
  itemIds?: number[]
  regionalOfficeIds?: number[]
}

/** Fetches a paginated, filterable list of usage records. */
export function listUsageRecords(filters: UsageRecordFilters = {}) {
  const params = new URLSearchParams()
  if (filters.page) params.set('page', String(filters.page))
  if (filters.limit) params.set('limit', String(filters.limit))
  if (filters.startDate) params.set('startDate', filters.startDate)
  if (filters.endDate) params.set('endDate', filters.endDate)
  if (filters.branchIds?.length) params.set('branchIds', filters.branchIds.join(','))
  if (filters.itemIds?.length) params.set('itemIds', filters.itemIds.join(','))
  if (filters.regionalOfficeIds?.length) params.set('regionalOfficeIds', filters.regionalOfficeIds.join(','))

  return request<{ data: UsageRecord[]; pagination: PaginationMeta }>(`/usage?${params.toString()}`)
}

/** Fetches a single usage record by id. */
export function getUsageRecord(id: number) {
  return request<UsageRecord>(`/usage/${id}`)
}

/** Creates a new usage record. */
export function createUsageRecord(input: {
  itemId: number
  branchId: number
  quantity: number
  usageDate: string
  notes?: string
}) {
  return request<UsageRecord>('/usage', { method: 'POST', body: JSON.stringify(input) })
}

/** Updates an existing usage record. */
export function updateUsageRecord(
  id: number,
  input: { itemId: number; branchId: number; quantity: number; usageDate: string; notes?: string }
) {
  return request<UsageRecord>(`/usage/${id}`, { method: 'PUT', body: JSON.stringify(input) })
}

/** Deletes a usage record (Admin only — server enforces the role check). */
export function deleteUsageRecord(id: number) {
  return request<void>(`/usage/${id}`, { method: 'DELETE' })
}

// ---------------------------------------------------------------------------
// Reports (FR-011 – FR-015, FR-023)
// ---------------------------------------------------------------------------

export interface ReportColumn {
  field: string
  label: string
  type: 'string' | 'number' | 'date'
}

export interface ReportRequest {
  itemIds?: number[]
  branchIds?: number[]
  regionalOfficeIds?: number[]
  vendorIds?: number[]
  hierarchyIds?: number[]
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
  orderBy?: string
  direction?: 'asc' | 'desc'
}

export interface ReportResponse<T> {
  data: T[]
  columns: ReportColumn[]
  pagination: PaginationMeta
  summary?: Record<string, number>
}

export type ReportType = 'item-wise' | 'branch-wise' | 'regional-office-wise' | 'hierarchy-wise' | 'vendor-wise'

/**
 * Runs one of the five usage reports (item/branch/regional-office/hierarchy/
 * vendor-wise), supporting multi-select filter arrays, date range,
 * pagination, and column sorting.
 *
 * @param reportType - Which report to generate.
 * @param body - Filters, pagination, and sort options.
 */
export function generateReport<T = Record<string, unknown>>(reportType: ReportType, body: ReportRequest) {
  return request<ReportResponse<T>>(`/reports/${reportType}`, { method: 'POST', body: JSON.stringify(body) })
}

// ---------------------------------------------------------------------------
// Vendor Usage Analysis (FR-015)
// ---------------------------------------------------------------------------

export interface VendorUsageAnalysis {
  vendor: { id: number; name: string }
  items: Array<{
    itemId: number
    itemName: string
    totalQuantity: number
    usageByBranch: Array<{ branchId: number; branchName: string; quantity: number }>
  }>
  totalUsage: number
}

/** Fetches the vendor-wise usage analysis report for a single vendor. */
export function getVendorUsageAnalysis(vendorId: number) {
  return request<VendorUsageAnalysis>(`/vendors/${vendorId}/usage-analysis`)
}

// ---------------------------------------------------------------------------
// Minimal lookups (Items, Vendors, Hierarchies) — used only to populate
// dropdowns/filters. Full CRUD for these entities belongs to other,
// out-of-scope tasks (see src/routes/inventory.ts, vendors.ts, hierarchies.ts).
// ---------------------------------------------------------------------------

export interface InventoryItemLookup {
  id: number
  name: string
  unit: string
  vendorId: number
  hierarchyId: number
}

export interface VendorLookup {
  id: number
  name: string
}

export interface HierarchyLookup {
  id: number
  name: string
  parentId: number | null
}

/** Fetches a minimal list of inventory items for dropdowns/filters. */
export function listInventoryItemsLookup() {
  return request<{ data: InventoryItemLookup[] }>('/inventory')
}

/** Fetches a minimal list of vendors for dropdowns/filters. */
export function listVendorsLookup() {
  return request<{ data: VendorLookup[] }>('/vendors')
}

/** Fetches a minimal list of item hierarchy nodes for dropdowns/filters. */
export function listHierarchiesLookup() {
  return request<{ data: HierarchyLookup[] }>('/hierarchies')
}

// ---------------------------------------------------------------------------
// Authentication and menu (IAM integration)
// ---------------------------------------------------------------------------

/** Roles supported by the application. */
export type UserRole = 'ADMIN' | 'USER'

/** Authenticated user profile returned by the API. */
export interface AuthenticatedUser {
  id: number
  email: string
  name: string
  role: UserRole
}

/** A navigation menu entry returned by `GET /api/menu/items`. */
export interface MenuItem {
  id: string
  label: string
  path: string
  children?: MenuItem[]
}

/** A logical grouping of menu items. */
export interface MenuSection {
  id: string
  label: string
  order: number
  items: MenuItem[]
}

/** Error carrying the HTTP status of a failed API call. */
export class ApiError extends Error {
  readonly status: number

  /**
   * Creates an API error.
   *
   * @param message - Message returned by the API.
   * @param status - HTTP status code of the failed response.
   */
  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

/** Message displayed when the API rejects a request with 403 Forbidden. */
export const ACCESS_DENIED_MESSAGE = 'Access denied'

/**
 * Performs an authenticated API request.
 *
 * @param path - API path, for example `/api/auth/me`.
 * @param init - Optional fetch options.
 * @returns The parsed JSON response body.
 * @throws {ApiError} When the API responds with a non-2xx status.
 */
export const apiFetch = async <T>(path: string, init: RequestInit = {}): Promise<T> => {
  const response = await fetch(path, {
    ...init,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(init.headers ?? {}) },
  })

  if (!response.ok) {
    let message = response.statusText
    try {
      const body = (await response.json()) as { message?: string }
      message = body.message ?? message
    } catch {
      // Response had no JSON body — fall back to the status text.
    }
    throw new ApiError(response.status === 403 ? ACCESS_DENIED_MESSAGE : message, response.status)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

/**
 * Authenticates a user through the IAM framework.
 *
 * @param email - Corporate email address.
 * @param password - Credential supplied by the user.
 * @returns The authenticated user profile.
 */
export const login = async (email: string, password: string): Promise<AuthenticatedUser> => {
  const body = await apiFetch<{ user: AuthenticatedUser }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  return body.user
}

/**
 * Ends the current session on the server and in the IAM framework.
 */
export const logout = async (): Promise<void> => {
  await apiFetch<{ message: string }>('/api/auth/logout', { method: 'POST' })
}

/**
 * Fetches the profile of the currently authenticated user.
 *
 * @returns The authenticated user profile, including the role.
 */
export const fetchCurrentUser = async (): Promise<AuthenticatedUser> => {
  const body = await apiFetch<{ user: AuthenticatedUser }>('/api/auth/me')
  return body.user
}

/**
 * Fetches the navigation menu allowed for the authenticated user's role.
 *
 * @returns The role filtered menu sections.
 */
export const fetchMenu = async (): Promise<MenuSection[]> => {
  const body = await apiFetch<{ sections: MenuSection[] }>('/api/menu/items')
  return body.sections
}
