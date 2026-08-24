import { Request, Response } from 'express'
import { createUploadHandler } from '../routes/uploadRoutes'
import { UploadFile, UploadService, UploadSummary } from '../services/uploadService'

const createResponse = (): Response => {
  const response = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  }

  return response as unknown as Response
}

const createRequest = (file: UploadFile): Request => {
  return {
    params: {
      type: 'inventory',
    },
    file,
  } as unknown as Request
}

describe('POST /api/upload/:type', () => {
  it.each([
    {
      originalname: 'inventory.csv',
      mimetype: 'text/csv',
    },
    {
      originalname: 'inventory.xlsx',
      mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    },
  ])('returns import summary for supported upload file %s', async ({ originalname, mimetype }) => {
    const summary: UploadSummary = {
      success: true,
      imported: 2,
      failed: 1,
      errors: [{ row: 3, message: 'Vendor ID 999 not found' }],
    }
    const uploadService: UploadService = {
      importData: jest.fn().mockResolvedValue(summary),
    }
    const handler = createUploadHandler(uploadService)
    const file: UploadFile = {
      originalname,
      mimetype,
      buffer: Buffer.from('mock file content'),
    }
    const request = createRequest(file)
    const response = createResponse()

    await handler(request, response)

    expect(uploadService.importData).toHaveBeenCalledWith('inventory', file)
    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.json).toHaveBeenCalledWith(summary)
  })

  it('returns 400 for invalid file type', async () => {
    const uploadService: UploadService = {
      importData: jest.fn(),
    }
    const handler = createUploadHandler(uploadService)
    const request = createRequest({
      originalname: 'inventory.txt',
      mimetype: 'text/plain',
      buffer: Buffer.from('invalid file'),
    })
    const response = createResponse()

    await handler(request, response)

    expect(uploadService.importData).not.toHaveBeenCalled()
    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Only CSV or Excel files are allowed',
        status: 400,
      }),
    )
  })
})
