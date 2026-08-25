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
