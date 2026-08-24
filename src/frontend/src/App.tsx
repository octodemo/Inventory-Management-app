import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import { HierarchyPage } from './pages/HierarchyPage'
import { InventoryPage } from './pages/InventoryPage'
import { RatesPage } from './pages/RatesPage'
import { VendorsPage } from './pages/VendorsPage'

function App() {
  return (
    <BrowserRouter>
      <div>
        <header data-testid="nav-bar"><h1>Stationery Inventory Management</h1></header>
        <nav data-testid="sidebar">
          <Link to="/inventory">Inventory</Link>{' | '}
          <Link to="/hierarchies">Item hierarchy</Link>{' | '}
          <Link to="/rates">Item rates</Link>{' | '}
          <Link to="/vendors">Vendors</Link>
        </nav>
        <main>
          <Routes>
            <Route path="/" element={<InventoryPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/hierarchies" element={<HierarchyPage />} />
            <Route path="/rates" element={<RatesPage />} />
            <Route path="/vendors" element={<VendorsPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
