export interface UploadFile {
  originalname: string
  mimetype: string
  buffer: Buffer
}

export interface UploadError {
  row: number
  message: string
}

export interface UploadSummary {
  success: boolean
  imported: number
  failed: number
  errors: UploadError[]
}

export interface UploadService {
  importData: (type: string, file: UploadFile) => Promise<UploadSummary>
}

const SUPPORTED_UPLOAD_TYPES = new Set(['inventory', 'vendors', 'branches', 'usage'])
const SUPPORTED_MIME_TYPES = new Set([
  'text/csv',
  'application/csv',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
])
const SUPPORTED_FILE_EXTENSION = /\.(csv|xlsx|xls)$/i

export const isSupportedUploadType = (type: string): boolean => SUPPORTED_UPLOAD_TYPES.has(type)

export const isSupportedUploadFile = (file: UploadFile): boolean => {
  return SUPPORTED_MIME_TYPES.has(file.mimetype) || SUPPORTED_FILE_EXTENSION.test(file.originalname)
}

export const createUploadService = (): UploadService => ({
  importData: async () => ({
    success: true,
    imported: 0,
    failed: 0,
    errors: [],
  }),
})
