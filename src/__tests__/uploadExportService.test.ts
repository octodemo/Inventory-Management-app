import type { Request, Response } from 'express'
import { createUploadExportHandlers } from '../services/uploadExportService'

type MockResponse = Response & {
  status: jest.Mock
  json: jest.Mock
  send: jest.Mock
  setHeader: jest.Mock
}

function createMockResponse(): MockResponse {
  const response = {} as MockResponse
  response.status = jest.fn().mockReturnValue(response)
  response.json = jest.fn().mockReturnValue(response)
  response.send = jest.fn().mockReturnValue(response)
  response.setHeader = jest.fn().mockReturnValue(response)
  return response
}

function createCsvFile(content: string): Express.Multer.File {
  return {
    fieldname: 'file',
    originalname: 'usage.csv',
    encoding: '7bit',
    mimetype: 'text/csv',
    size: Buffer.byteLength(content),
    destination: '',
    filename: '',
    path: '',
    stream: undefined as never,
    buffer: Buffer.from(content, 'utf-8'),
  }
}

describe('upload/export API handlers', () => {
  it('returns preview rows for bulk upload without committing', async () => {
    const previewStore = new Map()
    const createMany = jest.fn()

    const handlers = createUploadExportHandlers({
      usageRecordRepository: {
        createMany,
        findMany: jest.fn(),
      },
      itemRepository: { findMany: jest.fn() },
      branchRepository: { findMany: jest.fn() },
      previewStore,
      idGenerator: () => 'preview-1',
    })

    const request = {
      file: createCsvFile(
        'itemName,branchName,quantity,usageDate,notes\nPen,Branch A,10,2026-08-01,ok\nPencil,,3,2026-08-01,missing branch\n',
      ),
    } as Request
    const response = createMockResponse()

    await handlers.bulkUploadHandler(request, response)

    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        previewId: 'preview-1',
        totalRows: 2,
        validRows: 1,
        invalidRows: 1,
      }),
    )
    expect(createMany).not.toHaveBeenCalled()
    expect(previewStore.get('preview-1')).toBeDefined()
  })

  it('commits confirmed preview rows to the database', async () => {
    const previewStore = new Map([
      [
        'preview-2',
        {
          validRows: [
            {
              itemName: 'Pen',
              branchName: 'Branch A',
              quantity: 12,
              usageDate: new Date('2026-08-01T00:00:00.000Z'),
            },
          ],
          totalRows: 1,
          invalidRows: 0,
          createdAt: Date.now(),
        },
      ],
    ])

    const createMany = jest.fn().mockResolvedValue({ count: 1 })

    const handlers = createUploadExportHandlers({
      usageRecordRepository: {
        createMany,
        findMany: jest.fn(),
      },
      itemRepository: { findMany: jest.fn().mockResolvedValue([{ id: 1, name: 'Pen' }]) },
      branchRepository: { findMany: jest.fn().mockResolvedValue([{ id: 2, name: 'Branch A' }]) },
      previewStore,
      idGenerator: () => 'unused',
    })

    const request = {
      body: { previewId: 'preview-2' },
    } as Request
    const response = createMockResponse()

    await handlers.confirmUploadHandler(request, response)

    expect(createMany).toHaveBeenCalledWith({
      data: [
        {
          itemId: 1,
          branchId: 2,
          quantity: 12,
          usageDate: new Date('2026-08-01T00:00:00.000Z'),
        },
      ],
    })
    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({ committed: 1, totalRows: 1, invalidRows: 0 }),
    )
  })

  it('returns a CSV upload template', async () => {
    const handlers = createUploadExportHandlers({
      usageRecordRepository: {
        createMany: jest.fn(),
        findMany: jest.fn(),
      },
      itemRepository: { findMany: jest.fn() },
      branchRepository: { findMany: jest.fn() },
      previewStore: new Map(),
      idGenerator: () => 'unused',
    })

    const request = { query: { format: 'csv' } } as unknown as Request
    const response = createMockResponse()

    await handlers.uploadTemplateHandler(request, response)

    expect(response.setHeader).toHaveBeenCalledWith('Content-Type', 'text/csv; charset=utf-8')
    expect(response.setHeader).toHaveBeenCalledWith(
      'Content-Disposition',
      'attachment; filename="bulk-upload-template.csv"',
    )
    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.send).toHaveBeenCalledWith('itemName,branchName,quantity,usageDate,notes\n')
  })

  it('exports filtered usage data as CSV', async () => {
    const findMany = jest.fn().mockResolvedValue([
      {
        item: { name: 'Pen' },
        branch: { name: 'Branch A' },
        quantity: 5,
        usageDate: new Date('2026-08-02T00:00:00.000Z'),
        notes: 'Weekly issue',
      },
    ])

    const handlers = createUploadExportHandlers({
      usageRecordRepository: {
        createMany: jest.fn(),
        findMany,
      },
      itemRepository: { findMany: jest.fn() },
      branchRepository: { findMany: jest.fn() },
      previewStore: new Map(),
      idGenerator: () => 'unused',
    })

    const request = {
      query: { itemName: 'Pen', branchName: 'Branch', startDate: '2026-08-01', endDate: '2026-08-31' },
    } as unknown as Request
    const response = createMockResponse()

    await handlers.exportCsvHandler(request, response)

    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          item: { name: { contains: 'Pen' } },
          branch: { name: { contains: 'Branch' } },
        }),
      }),
    )
    expect(response.setHeader).toHaveBeenCalledWith('Content-Type', 'text/csv; charset=utf-8')
    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.send).toHaveBeenCalledWith(expect.stringContaining('itemName,branchName,quantity,usageDate,notes'))
  })

  it('exports usage data as Excel', async () => {
    const handlers = createUploadExportHandlers({
      usageRecordRepository: {
        createMany: jest.fn(),
        findMany: jest.fn().mockResolvedValue([]),
      },
      itemRepository: { findMany: jest.fn() },
      branchRepository: { findMany: jest.fn() },
      previewStore: new Map(),
      idGenerator: () => 'unused',
    })

    const request = { query: {} } as unknown as Request
    const response = createMockResponse()

    await handlers.exportExcelHandler(request, response)

    expect(response.setHeader).toHaveBeenCalledWith(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    )
    expect(response.status).toHaveBeenCalledWith(200)
    expect(Buffer.isBuffer(response.send.mock.calls[0][0])).toBe(true)
  })

  it('exports usage data as PDF', async () => {
    const handlers = createUploadExportHandlers({
      usageRecordRepository: {
        createMany: jest.fn(),
        findMany: jest.fn().mockResolvedValue([]),
      },
      itemRepository: { findMany: jest.fn() },
      branchRepository: { findMany: jest.fn() },
      previewStore: new Map(),
      idGenerator: () => 'unused',
    })

    const request = { query: {} } as unknown as Request
    const response = createMockResponse()

    await handlers.exportPdfHandler(request, response)

    expect(response.setHeader).toHaveBeenCalledWith('Content-Type', 'application/pdf')
    expect(response.status).toHaveBeenCalledWith(200)
    expect(Buffer.isBuffer(response.send.mock.calls[0][0])).toBe(true)
  })
})
