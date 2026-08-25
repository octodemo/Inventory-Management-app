import type { ChangeEventHandler } from 'react'
import { useMemo, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import { AccessDeniedPage } from './pages/AccessDeniedPage'
import { BranchesPage } from './pages/BranchesPage'
import { DashboardPage } from './pages/DashboardPage'
import { HierarchyPage } from './pages/HierarchyPage'
import { InventoryPage } from './pages/InventoryPage'
import { LoginPage } from './pages/LoginPage'
import { PremisesPage } from './pages/PremisesPage'
import { RatesPage } from './pages/RatesPage'
import { RegionalOfficesPage } from './pages/RegionalOfficesPage'
import { ReportsPage } from './pages/ReportsPage'
import { SupervisorsPage } from './pages/SupervisorsPage'
import { UsagePage } from './pages/UsagePage'
import { UsersPage } from './pages/UsersPage'
import { VendorUsageAnalysisPage } from './pages/VendorUsageAnalysisPage'
import { VendorsPage } from './pages/VendorsPage'
import {
  confirmBulkUpload,
  downloadExport,
  downloadTemplate,
  uploadBulkPreview,
  type UploadPreviewResponse,
} from './services/uploadExportApi'

const ALLOWED_EXTENSIONS = new Set(['csv', 'xls', 'xlsx'])

interface UploadExportPageProps {
  showUpload?: boolean
  showExports?: boolean
}

function UploadExportPage({ showUpload = false, showExports = false }: UploadExportPageProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadType, setUploadType] = useState('usage')
  const [preview, setPreview] = useState<UploadPreviewResponse | null>(null)
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const canConfirm = useMemo(() => Boolean(preview?.previewId && preview.validRows > 0), [preview])

  const onSelectFile: ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files?.[0] ?? null
    setPreview(null)
    setMessage('')

    if (!file) {
      setSelectedFile(null)
      return
    }

    const extension = file.name.split('.').pop()?.toLowerCase() ?? ''
    if (!ALLOWED_EXTENSIONS.has(extension)) {
      setSelectedFile(null)
      setMessage('Only CSV and Excel files are supported.')
      return
    }

    setSelectedFile(file)
  }

  const onPreview = async () => {
    if (!selectedFile) {
      setMessage('Please select a CSV/Excel file.')
      return
    }

    setIsLoading(true)
    setMessage('')

    try {
      const response = await uploadBulkPreview(selectedFile, uploadType)
      setPreview(response)
      setMessage(`Preview ready: ${response.validRows} valid / ${response.invalidRows} invalid`)
    } catch (error) {
      setPreview(null)
      setMessage(error instanceof Error ? error.message : 'Preview failed')
    } finally {
      setIsLoading(false)
    }
  }

  const onConfirm = async () => {
    if (!preview?.previewId) {
      return
    }

    setIsLoading(true)
    setMessage('')

    try {
      const result = await confirmBulkUpload(preview.previewId)
      setMessage(`Committed ${result.committed} rows.`)
      setPreview(null)
      setSelectedFile(null)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Confirm failed')
    } finally {
      setIsLoading(false)
    }
  }

  const onDownloadTemplate = async (format: 'csv' | 'excel') => {
    setIsLoading(true)
    setMessage('')

    try {
      await downloadTemplate(format)
      setMessage('Template downloaded.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Template download failed')
    } finally {
      setIsLoading(false)
    }
  }

  const onExport = async (format: 'csv' | 'excel' | 'pdf') => {
    setIsLoading(true)
    setMessage('')

    try {
      await downloadExport(format)
      setMessage(`${format.toUpperCase()} export downloaded.`)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Export failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <h1>Stationery Inventory Management</h1>

      {showUpload && <section data-testid="upload-page">
        <h2>Bulk Upload</h2>

        <label htmlFor="upload-type">Upload Type</label>
        <select
          id="upload-type"
          data-testid="upload-type"
          value={uploadType}
          onChange={(event) => setUploadType(event.target.value)}
        >
          <option value="usage">Usage</option>
        </select>

        <input
          data-testid="upload-file-input"
          type="file"
          accept=".csv,.xls,.xlsx"
          onChange={onSelectFile}
        />

        <div>
          <button type="button" data-testid="upload-preview" onClick={onPreview} disabled={isLoading}>
            Preview Upload
          </button>
          <button
            type="button"
            data-testid="upload-confirm"
            onClick={onConfirm}
            disabled={isLoading || !canConfirm}
          >
            Confirm Upload
          </button>
          <button
            type="button"
            data-testid="upload-template-download"
            onClick={() => onDownloadTemplate('csv')}
            disabled={isLoading}
          >
            Download Template (CSV)
          </button>
          <button
            type="button"
            data-testid="upload-template-download-excel"
            onClick={() => onDownloadTemplate('excel')}
            disabled={isLoading}
          >
            Download Template (Excel)
          </button>
        </div>

        {preview && (
          <table data-testid="upload-preview-table" border={1}>
            <thead>
              <tr>
                <th>Row</th>
                <th>itemName</th>
                <th>branchName</th>
                <th>quantity</th>
                <th>usageDate</th>
                <th>notes</th>
                <th>errors</th>
              </tr>
            </thead>
            <tbody>
              {preview.rows.map((row) => (
                <tr key={row.rowNumber}>
                  <td>{row.rowNumber}</td>
                  <td>{row.data.itemName ?? ''}</td>
                  <td>{row.data.branchName ?? ''}</td>
                  <td>{row.data.quantity ?? ''}</td>
                  <td>{row.data.usageDate ?? ''}</td>
                  <td>{row.data.notes ?? ''}</td>
                  <td>{row.errors.join('; ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>}

      {showExports && <section data-testid="reports-page">
        <h2>Exports</h2>
        <div data-testid="export-buttons">
          <button type="button" data-testid="export-csv" onClick={() => onExport('csv')} disabled={isLoading}>
            Export CSV
          </button>
          <button
            type="button"
            data-testid="export-excel"
            onClick={() => onExport('excel')}
            disabled={isLoading}
          >
            Export Excel
          </button>
          <button type="button" data-testid="export-pdf" onClick={() => onExport('pdf')} disabled={isLoading}>
            Export PDF
          </button>
        </div>
      </section>}

      {message && <p>{message}</p>}
    </div>
  )
}

/**
 * Application root wiring authentication, role based route guards and the
 * navigation shell.
 */
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <DashboardPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <UploadExportPage showExports />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Layout>
                  <UploadExportPage showUpload />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Layout>
                  <UsersPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/regional-offices"
            element={
              <ProtectedRoute>
                <Layout>
                  <RegionalOfficesPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/branches"
            element={
              <ProtectedRoute>
                <Layout>
                  <BranchesPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/supervisors"
            element={
              <ProtectedRoute>
                <Layout>
                  <SupervisorsPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/premises"
            element={
              <ProtectedRoute>
                <Layout>
                  <PremisesPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/usage"
            element={
              <ProtectedRoute>
                <Layout>
                  <UsagePage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Layout>
                  <ReportsPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendors/usage-analysis"
            element={
              <ProtectedRoute>
                <Layout>
                  <VendorUsageAnalysisPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendors/:vendorId/usage-analysis"
            element={
              <ProtectedRoute>
                <Layout>
                  <VendorUsageAnalysisPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventory"
            element={
              <ProtectedRoute>
                <Layout>
                  <InventoryPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/hierarchies"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Layout>
                  <HierarchyPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/rates"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Layout>
                  <RatesPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendors"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Layout>
                  <VendorsPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/access-denied"
            element={
              <ProtectedRoute>
                <Layout>
                  <AccessDeniedPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
