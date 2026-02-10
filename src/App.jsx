import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'

// Styles
import './styles/theme.css'
import './styles/typography.css'
import './styles/utilities.css'
import './styles/invoice.css'
import './styles/responsive.css'

// Pages Auth
import WelcomePage from './pages/auth/WelcomePage'
import LoginPage from './pages/auth/LoginPage'
import SignupPage from './pages/auth/SignupPage'

// Pages User
import DashboardPage from './pages/user/DashboardPage'
import CreateInvoicePage from './pages/user/CreateInvoicePage'
import InvoicesPage from './pages/user/InvoicesPage'
import PreviewInvoicePage from './pages/user/PreviewInvoicePage'
import StockPage from './pages/user/StockPage'
import ClientsPage from './pages/user/ClientsPage'
import SettingsPage from './pages/user/SettingsPage'

// Pages Admin
import AdminDashboard from './pages/admin/AdminDashboard'
import PendingInvoices from './pages/admin/PendingInvoices'
import AllInvoices from './pages/admin/AllInvoices'
import AdminStockManagement from './pages/admin/AdminStockManagement'
import UsersManagement from './pages/admin/UsersManagement'
import AdminReports from './pages/admin/AdminReports'

// Components
import ProtectedRoute from './components/Layout/ProtectedRoute'

function App() {
  const { loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--accent)',
        fontSize: '1.2rem'
      }}>
        Chargement...
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes - Public */}
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* User Routes - Protected */}
        <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/invoices" element={<ProtectedRoute><InvoicesPage /></ProtectedRoute>} />
        <Route path="/invoices/create" element={<ProtectedRoute><CreateInvoicePage /></ProtectedRoute>} />
        <Route path="/invoices/:id" element={<ProtectedRoute><PreviewInvoicePage /></ProtectedRoute>} />
        <Route path="/stock" element={<ProtectedRoute><StockPage /></ProtectedRoute>} />
        <Route path="/clients" element={<ProtectedRoute><ClientsPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

        {/* Admin Routes - Protected */}
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/pending" element={<ProtectedRoute><PendingInvoices /></ProtectedRoute>} />
        <Route path="/admin/invoices" element={<ProtectedRoute><AllInvoices /></ProtectedRoute>} />
        <Route path="/admin/stock" element={<ProtectedRoute><AdminStockManagement /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute><UsersManagement /></ProtectedRoute>} />
        <Route path="/admin/reports" element={<ProtectedRoute><AdminReports /></ProtectedRoute>} />

        {/* Redirect */}
        <Route path="*" element={<Navigate to="/welcome" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
