import express from 'express'
import http from 'http'
import uploadRouter from '../routes/uploadRoutes'

describe('GET /api/upload/template/:type', () => {
  let server: http.Server
  let baseUrl: string

  beforeAll(async () => {
    const app = express()
    app.use('/api/upload', uploadRouter)

    await new Promise<void>((resolve) => {
      server = app.listen(0, resolve)
    })

    const address = server.address()
    if (!address || typeof address === 'string') {
      throw new Error('Failed to start test server')
    }

    baseUrl = `http://127.0.0.1:${address.port}`
  })

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error)
          return
        }
        resolve()
      })
    })
  })

  it('returns inventory CSV template with correct column headers', async () => {
    const response = await fetch(`${baseUrl}/api/upload/template/inventory`)
    const body = await response.text()

    expect(response.status).toBe(200)
    expect(body).toBe('name,description,vendorId,hierarchyId,unit\n')
  })

  it('returns CSV content and file download headers', async () => {
    const response = await fetch(`${baseUrl}/api/upload/template/inventory`)

    expect(response.headers.get('content-type')).toContain('text/csv')
    expect(response.headers.get('content-disposition')).toBe(
      'attachment; filename="inventory-template.csv"',
    )
  })

  it('returns vendors CSV template mapping with download filename', async () => {
    const response = await fetch(`${baseUrl}/api/upload/template/vendors`)
    const body = await response.text()

    expect(response.status).toBe(200)
    expect(body).toBe('name,contactName,contactEmail,contactPhone,address\n')
    expect(response.headers.get('content-disposition')).toBe(
      'attachment; filename="vendors-template.csv"',
    )
  })

  it('returns 400 for invalid template type', async () => {
    const response = await fetch(`${baseUrl}/api/upload/template/unknown`)
    const body = await response.json() as { message: string; status: number; timestamp: string }

    expect(response.status).toBe(400)
    expect(body.message).toBe('Invalid upload template type')
    expect(body.status).toBe(400)
    expect(typeof body.timestamp).toBe('string')
  })
})
