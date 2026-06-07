import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import UsersPage from './pages/UsersPage'
import DepartmentsPage from './pages/DepartmentsPage'
import InboxPage from './pages/InboxPage'
import ComposePage from './pages/ComposePage'
import SentMailPage from './pages/SentMailPage'
import DevicesPage from './pages/DevicesPage'
import DeviceApprovalPage from './pages/DeviceApprovalPage'
import AuditLogsPage from './pages/AuditLogsPage'
import NotFoundPage from './pages/NotFoundPage'

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth()
  return token ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/users" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
      <Route path="/departments" element={<ProtectedRoute><DepartmentsPage /></ProtectedRoute>} />
      <Route path="/mail/inbox" element={<ProtectedRoute><InboxPage /></ProtectedRoute>} />
      <Route path="/mail/compose" element={<ProtectedRoute><ComposePage /></ProtectedRoute>} />
      <Route path="/mail/sent" element={<ProtectedRoute><SentMailPage /></ProtectedRoute>} />
      <Route path="/devices" element={<ProtectedRoute><DevicesPage /></ProtectedRoute>} />
      <Route path="/devices/approval" element={<ProtectedRoute><DeviceApprovalPage /></ProtectedRoute>} />
      <Route path="/audit" element={<ProtectedRoute><AuditLogsPage /></ProtectedRoute>} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App