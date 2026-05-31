import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const DashboardPage = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">MailDP</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">
            Welcome, <strong>{user?.fullName}</strong>
          </span>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
            {user?.role}
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Sidebar + Content */}
      <div className="flex">

        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-white shadow-sm p-4">
          <nav className="space-y-1">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full text-left px-4 py-3 rounded-lg text-gray-700
                         hover:bg-blue-50 hover:text-blue-600 transition font-medium"
            >
              🏠 Dashboard
            </button>
            <button
              onClick={() => navigate('/users')}
              className="w-full text-left px-4 py-3 rounded-lg text-gray-700
                         hover:bg-blue-50 hover:text-blue-600 transition font-medium"
            >
              👥 Users
            </button>
            <button
              onClick={() => navigate('/departments')}
              className="w-full text-left px-4 py-3 rounded-lg text-gray-700
                         hover:bg-blue-50 hover:text-blue-600 transition font-medium"
            >
              🏢 Departments
            </button>
            <button
              className="w-full text-left px-4 py-3 rounded-lg text-gray-400
                         cursor-not-allowed font-medium"
              disabled
            >
              📧 Mail (Phase 5)
            </button>
            <button
              className="w-full text-left px-4 py-3 rounded-lg text-gray-400
                         cursor-not-allowed font-medium"
              disabled
            >
              💻 Devices (Phase 6)
            </button>
            <button
              className="w-full text-left px-4 py-3 rounded-lg text-gray-400
                         cursor-not-allowed font-medium"
              disabled
            >
              📋 Audit Logs (Phase 7)
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow p-6 text-center cursor-pointer
                            hover:shadow-md transition"
                 onClick={() => navigate('/users')}>
              <p className="text-3xl font-bold text-blue-600">1</p>
              <p className="text-gray-500 mt-1">Total Users</p>
            </div>
            <div className="bg-white rounded-xl shadow p-6 text-center cursor-pointer
                            hover:shadow-md transition"
                 onClick={() => navigate('/departments')}>
              <p className="text-3xl font-bold text-green-600">2</p>
              <p className="text-gray-500 mt-1">Departments</p>
            </div>
            <div className="bg-white rounded-xl shadow p-6 text-center">
              <p className="text-3xl font-bold text-orange-500">0</p>
              <p className="text-gray-500 mt-1">Pending Devices</p>
            </div>
          </div>

          <div className="mt-8 bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Welcome to MailDP Dashboard
            </h2>
            <p className="text-gray-400">
              Use the sidebar to navigate between modules.
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardPage