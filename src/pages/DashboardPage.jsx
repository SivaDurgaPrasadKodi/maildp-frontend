import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../api/axiosConfig'

const DashboardPage = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [statsRes, activityRes] = await Promise.all([
        API.get('/dashboard/stats'),
        API.get('/dashboard/recent-activity')
      ])
      setStats(statsRes.data)
      setRecentActivity(activityRes.data)
    } catch (err) {
      console.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getActionColor = (action) => {
    switch (action) {
      case 'USER_LOGIN': return 'bg-blue-100 text-blue-700'
      case 'USER_REGISTERED': return 'bg-green-100 text-green-700'
      case 'MAIL_SENT': return 'bg-purple-100 text-purple-700'
      case 'DEVICE_REGISTERED': return 'bg-yellow-100 text-yellow-700'
      case 'DEVICE_APPROVED': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
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

      <div className="flex">

        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-white shadow-sm p-4">
          <nav className="space-y-1">
            <button onClick={() => navigate('/dashboard')}
              className="w-full text-left px-4 py-3 rounded-lg text-gray-700
                         hover:bg-blue-50 hover:text-blue-600 transition font-medium">
              🏠 Dashboard
            </button>
            <button onClick={() => navigate('/users')}
              className="w-full text-left px-4 py-3 rounded-lg text-gray-700
                         hover:bg-blue-50 hover:text-blue-600 transition font-medium">
              👥 Users
            </button>
            <button onClick={() => navigate('/departments')}
              className="w-full text-left px-4 py-3 rounded-lg text-gray-700
                         hover:bg-blue-50 hover:text-blue-600 transition font-medium">
              🏢 Departments
            </button>
            <button onClick={() => navigate('/mail/inbox')}
              className="w-full text-left px-4 py-3 rounded-lg text-gray-700
                         hover:bg-blue-50 hover:text-blue-600 transition font-medium">
              📧 Inbox
            </button>
            <button onClick={() => navigate('/mail/compose')}
              className="w-full text-left px-4 py-3 rounded-lg text-gray-700
                         hover:bg-blue-50 hover:text-blue-600 transition font-medium">
              ✉️ Compose
            </button>
            <button onClick={() => navigate('/mail/sent')}
              className="w-full text-left px-4 py-3 rounded-lg text-gray-700
                         hover:bg-blue-50 hover:text-blue-600 transition font-medium">
              📤 Sent Mail
            </button>
            <button onClick={() => navigate('/devices')}
              className="w-full text-left px-4 py-3 rounded-lg text-gray-700
                         hover:bg-blue-50 hover:text-blue-600 transition font-medium">
              💻 My Devices
            </button>
            <button onClick={() => navigate('/devices/approval')}
              className="w-full text-left px-4 py-3 rounded-lg text-gray-700
                         hover:bg-blue-50 hover:text-blue-600 transition font-medium">
              🔐 Device Approval
            </button>
            <button onClick={() => navigate('/audit')}
              className="w-full text-left px-4 py-3 rounded-lg text-gray-700
                         hover:bg-blue-50 hover:text-blue-600 transition font-medium">
              📋 Audit Logs
            </button>
            <button onClick={() => navigate('/security/alerts')}
              className="w-full text-left px-4 py-3 rounded-lg text-gray-700
                         hover:bg-blue-50 hover:text-blue-600 transition font-medium">
              🚨 Security Alerts
            </button>
            <button onClick={() => navigate('/security/incidents')}
              className="w-full text-left px-4 py-3 rounded-lg text-gray-700
                         hover:bg-blue-50 hover:text-blue-600 transition font-medium">
              🔥 Incidents
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500">Loading dashboard...</p>
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

                <div onClick={() => navigate('/users')}
                  className="bg-white rounded-xl shadow p-5 cursor-pointer
                             hover:shadow-md transition border-l-4 border-blue-500">
                  <p className="text-3xl font-bold text-blue-600">
                    {stats?.totalUsers || 0}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">Total Users</p>
                  <p className="text-xs text-green-500 mt-1">
                    {stats?.activeUsers || 0} active
                  </p>
                </div>

                <div onClick={() => navigate('/departments')}
                  className="bg-white rounded-xl shadow p-5 cursor-pointer
                             hover:shadow-md transition border-l-4 border-green-500">
                  <p className="text-3xl font-bold text-green-600">
                    {stats?.totalDepartments || 0}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">Departments</p>
                </div>

                <div onClick={() => navigate('/mail/inbox')}
                  className="bg-white rounded-xl shadow p-5 cursor-pointer
                             hover:shadow-md transition border-l-4 border-purple-500">
                  <p className="text-3xl font-bold text-purple-600">
                    {stats?.totalMails || 0}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">Total Mails</p>
                </div>

                <div onClick={() => navigate('/devices/approval')}
                  className="bg-white rounded-xl shadow p-5 cursor-pointer
                             hover:shadow-md transition border-l-4 border-orange-500">
                  <p className="text-3xl font-bold text-orange-500">
                    {stats?.pendingDevices || 0}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">Pending Devices</p>
                  <p className="text-xs text-green-500 mt-1">
                    {stats?.approvedDevices || 0} approved
                  </p>
                </div>

                <div onClick={() => navigate('/security/alerts')}
                  className="bg-white rounded-xl shadow p-5 cursor-pointer
                             hover:shadow-md transition border-l-4 border-red-500">
                  <p className="text-3xl font-bold text-red-500">
                    {stats?.openAlerts || 0}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">Open Alerts</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {stats?.totalAlerts || 0} total
                  </p>
                </div>

                <div onClick={() => navigate('/security/incidents')}
                  className="bg-white rounded-xl shadow p-5 cursor-pointer
                             hover:shadow-md transition border-l-4 border-red-700">
                  <p className="text-3xl font-bold text-red-700">
                    {stats?.openIncidents || 0}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">Open Incidents</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {stats?.totalIncidents || 0} total
                  </p>
                </div>

                <div onClick={() => navigate('/devices')}
                  className="bg-white rounded-xl shadow p-5 cursor-pointer
                             hover:shadow-md transition border-l-4 border-gray-500">
                  <p className="text-3xl font-bold text-gray-600">
                    {stats?.totalDevices || 0}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">Total Devices</p>
                </div>

                <div onClick={() => navigate('/audit')}
                  className="bg-white rounded-xl shadow p-5 cursor-pointer
                             hover:shadow-md transition border-l-4 border-indigo-500">
                  <p className="text-3xl font-bold text-indigo-600">
                    {stats?.totalAuditLogs || 0}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">Audit Logs</p>
                </div>

              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Recent Activity
                </h2>
                {recentActivity.length === 0 ? (
                  <p className="text-gray-400 text-center py-4">
                    No recent activity
                  </p>
                ) : (
                  <div className="space-y-3">
                    {recentActivity.map((log) => (
                      <div key={log.id}
                           className="flex items-center justify-between
                                      py-2 border-b last:border-0">
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-1 rounded text-xs
                                            font-medium ${getActionColor(log.action)}`}>
                            {log.action}
                          </span>
                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              {log.userName}
                            </p>
                            <p className="text-xs text-gray-400">
                              {log.description}
                            </p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-400">
                          {new Date(log.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}

export default DashboardPage