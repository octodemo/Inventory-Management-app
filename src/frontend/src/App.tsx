import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { BranchesPage } from './pages/BranchesPage'
import { PremisesPage } from './pages/PremisesPage'
import { RegionalOfficesPage } from './pages/RegionalOfficesPage'
import { ReportsPage } from './pages/ReportsPage'
import { SupervisorsPage } from './pages/SupervisorsPage'
import { UsagePage } from './pages/UsagePage'
import { VendorUsageAnalysisPage } from './pages/VendorUsageAnalysisPage'

/**
 * Temporary role switcher, standing in for the IAM/RBAC epic's login flow
 * (epic-07, out of this batch's scope). Lets the current session act as
 * ADMIN or USER so admin-only UI gating (e.g. usage record deletion) can be
 * exercised without a full authentication implementation.
 */
function RoleSwitcher() {
  const { role, setRole } = useAuth()
  return (
    <label data-testid="role-switcher">
      Role:
      <select value={role} onChange={(e) => setRole(e.target.value as 'ADMIN' | 'USER')}>
        <option value="USER">User</option>
        <option value="ADMIN">Admin</option>
      </select>
    </label>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div>
          <h1>Stationery Inventory Management</h1>
          <nav data-testid="nav-bar">
            <Link to="/regional-offices">Regional Offices</Link>
            <Link to="/branches">Branches</Link>
            <Link to="/supervisors">Supervisors</Link>
            <Link to="/premises">Premises</Link>
            <Link to="/usage">Usage</Link>
            <Link to="/reports">Reports</Link>
            <Link to="/vendors/usage-analysis">Vendor Analysis</Link>
            <RoleSwitcher />
          </nav>
          <Routes>
            <Route path="/regional-offices" element={<RegionalOfficesPage />} />
            <Route path="/branches" element={<BranchesPage />} />
            <Route path="/supervisors" element={<SupervisorsPage />} />
            <Route path="/premises" element={<PremisesPage />} />
            <Route path="/usage" element={<UsagePage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/vendors/usage-analysis" element={<VendorUsageAnalysisPage />} />
            <Route path="/vendors/:vendorId/usage-analysis" element={<VendorUsageAnalysisPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
