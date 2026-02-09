import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import DashboardPage from './pages/DashboardPage'
import CreateInvoicePage from './pages/CreateInvoicePage'
import PreviewInvoicePage from './pages/PreviewInvoicePage'
import ClientsPage from './pages/ClientsPage'
import StockPage from './pages/StockPage'
import './styles/global.css'

function App() {
  return (
    <BrowserRouter>
      <nav className="navbar">
        <div className="nav-container">
          <h1 className="nav-brand">📋 Factures Pro</h1>
          <div className="nav-links">
            <Link to="/" className="nav-link">Tableau de bord</Link>
            <Link to="/create" className="nav-link">Nouvelle facture</Link>
            <Link to="/clients" className="nav-link">Clients</Link>
            <Link to="/stock" className="nav-link">Stock</Link>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/create" element={<CreateInvoicePage />} />
        <Route path="/preview/:id" element={<PreviewInvoicePage />} />
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/stock" element={<StockPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
