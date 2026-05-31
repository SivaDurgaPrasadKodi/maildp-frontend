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
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">MailDP</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">
            Welcome, <strong>{user?.fullName}</strong>
          </span>
          <span className="bg-blue-100 text-blue-700 px-3 py-1
                           rounded-full text-sm font-medium">
            {user?.role}
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white
                       px-4 py-2 rounded-lg text-sm transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <p className="text-3xl font-bold text-blue-600">0</p>
            <p className="text-gray-500 mt-1">Inbox Messages</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <p className="text-3xl font-bold text-green-600">0</p>
            <p className="text-gray-500 mt-1">Sent Messages</p>
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
            More features coming in the next phases.
          </p>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage