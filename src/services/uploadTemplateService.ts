import type { Request, Response } from 'express'

const templateHeaders: Record<string, string[]> = {
  inventory: ['name', 'description', 'vendorId', 'hierarchyId', 'unit'],
  vendors: ['name', 'contactName', 'contactEmail', 'contactPhone', 'address'],
  branches: ['name', 'code', 'regionalOfficeId', 'address'],
  usage: ['itemId', 'branchId', 'quantity', 'usageDate', 'notes'],
}

export const getUploadTemplate = (req: Request, res: Response) => {
  const { type } = req.params
  const headers = templateHeaders[type]

  if (!headers) {
    return res.status(400).json({
      message: 'Invalid upload template type',
      status: 400,
      timestamp: new Date().toISOString(),
    })
  }

  const csvContent = `${headers.join(',')}\n`

  res.setHeader('Content-Type', 'text/csv; charset=utf-8')
  res.setHeader('Content-Disposition', `attachment; filename="${type}-template.csv"`)

  return res.status(200).send(csvContent)
}
