import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { AccessDeniedMessage } from './components/AccessDeniedMessage'
import { NavigationMenu, UserRole } from './components/NavigationMenu'
import { DashboardPage } from './pages/DashboardPage'
import { DetailPage } from './pages/DetailPage'

const role = (sessionStorage.getItem('userRole') === 'ADMIN' ? 'ADMIN' : 'USER') as UserRole

/**
 * Hosts application navigation and feature routes.
 */
function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <NavigationMenu role={role} />
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/usage" element={<DetailPage />} />
          <Route path="/reports" element={<DetailPage />} />
          <Route path="/access-denied" element={<AccessDeniedMessage />} />
          <Route path="*" element={<DetailPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
