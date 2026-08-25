import { MenuService } from '../services/menuService'
import {
  authHeader,
  login,
  readJson,
  startTestApp,
  TEST_CREDENTIALS,
  type TestHarness,
} from '../testing/testApp'

describe('menu service', () => {
  const menuService = new MenuService()

  it('returns admin-only sections for ADMIN users', () => {
    const sections = menuService.getMenuForRole('ADMIN')
    const sectionIds = sections.map((section) => section.id)

    expect(sectionIds).toContain('admin')
    expect(sections.every((section, index) => index === 0 || section.order >= sections[index - 1].order)).toBe(true)
  })

  it('omits admin-only sections and items for USER accounts', () => {
    const sections = menuService.getMenuForRole('USER')
    const sectionIds = sections.map((section) => section.id)

    expect(sectionIds).not.toContain('admin')

    const reports = sections.find((section) => section.id === 'reports')
    const reportChildren = reports?.items[0].children?.map((child) => child.id) ?? []
    expect(reportChildren).not.toContain('reports-vendor-wise')
  })
})

describe('GET /api/menu/items', () => {
  let harness: TestHarness

  beforeEach(async () => {
    harness = await startTestApp()
  })

  afterEach(async () => {
    await harness.close()
  })

  it('returns the full menu structure for admin users', async () => {
    const token = await login(harness.baseUrl, TEST_CREDENTIALS.admin)

    const response = await fetch(`${harness.baseUrl}/api/menu/items`, {
      headers: { Authorization: authHeader(token) },
    })
    const body = await readJson(response)
    const sections = body.sections as { id: string; label: string; items: { id: string; path: string }[] }[]

    expect(response.status).toBe(200)
    expect(sections.map((section) => section.id)).toContain('admin')
    const adminSection = sections.find((section) => section.id === 'admin')!
    expect(adminSection.label).toBe('Admin')
    expect(adminSection.items.map((item) => item.id)).toEqual(['vendors', 'users', 'upload'])
    expect(adminSection.items.every((item) => Boolean(item.id) && Boolean(item.path))).toBe(true)
  })

  it('returns a restricted menu structure for regular users', async () => {
    const token = await login(harness.baseUrl, TEST_CREDENTIALS.user)

    const response = await fetch(`${harness.baseUrl}/api/menu/items`, {
      headers: { Authorization: authHeader(token) },
    })
    const body = await readJson(response)
    const sections = body.sections as { id: string }[]

    expect(response.status).toBe(200)
    expect(sections.map((section) => section.id)).not.toContain('admin')
    expect(sections.map((section) => section.id)).toEqual(['dashboard', 'inventory', 'reports'])
  })

  it('requires authentication', async () => {
    const response = await fetch(`${harness.baseUrl}/api/menu/items`)

    expect(response.status).toBe(401)
  })
})
