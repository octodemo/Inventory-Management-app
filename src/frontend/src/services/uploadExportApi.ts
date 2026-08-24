const API_BASE = '/api'

export type UploadPreviewRow = {
  rowNumber: number
  data: Record<string, string>
  errors: string[]
}

export type UploadPreviewResponse = {
  previewId: string
  totalRows: number
  validRows: number
  invalidRows: number
  rows: UploadPreviewRow[]
}

async function triggerDownloadFromResponse(response: Response, fallbackFileName: string): Promise<void> {
  const blob = await response.blob()
  const url = URL.createObjectURL(blob)

  const contentDisposition = response.headers.get('content-disposition') ?? ''
  const fileNameMatch = contentDisposition.match(/filename="?([^";]+)"?/)?.[1]
  const fileName = fileNameMatch ?? fallbackFileName

  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()

  URL.revokeObjectURL(url)
}

export async function uploadBulkPreview(file: File): Promise<UploadPreviewResponse> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${API_BASE}/upload/bulk`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const body = await response.json().catch(() => ({ message: 'Upload failed' }))
    throw new Error(body.message ?? 'Upload failed')
  }

  return response.json() as Promise<UploadPreviewResponse>
}

export async function confirmBulkUpload(previewId: string): Promise<{ committed: number }> {
  const response = await fetch(`${API_BASE}/upload/confirm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ previewId }),
  })

  if (!response.ok) {
    const body = await response.json().catch(() => ({ message: 'Confirm failed' }))
    throw new Error(body.message ?? 'Confirm failed')
  }

  return response.json() as Promise<{ committed: number }>
}

export async function downloadTemplate(format: 'csv' | 'excel'): Promise<void> {
  const response = await fetch(`${API_BASE}/upload/template?format=${format}`)
  if (!response.ok) {
    throw new Error('Template download failed')
  }

  await triggerDownloadFromResponse(
    response,
    format === 'excel' ? 'bulk-upload-template.xlsx' : 'bulk-upload-template.csv',
  )
}

export async function downloadExport(format: 'csv' | 'excel' | 'pdf'): Promise<void> {
  const response = await fetch(`${API_BASE}/export/${format}`)
  if (!response.ok) {
    throw new Error('Export failed')
  }

  const fallback =
    format === 'csv' ? 'usage-data.csv' : format === 'excel' ? 'usage-data.xlsx' : 'usage-data.pdf'
  await triggerDownloadFromResponse(response, fallback)
}
