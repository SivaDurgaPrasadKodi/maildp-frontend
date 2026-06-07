import { useState, useEffect } from 'react'
import API from '../api/axiosConfig'

const AuditLogsPage = () => {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')
  const [error, setError] = useState('')

  const actions = [
    'ALL', 'USER_LOGIN', 'USER_REGISTERED',
    'MAIL_SENT', 'DEVICE_REGISTERED', 'DEVICE_APPROVED'
  ]

  useEffect(() => {
    fetchLogs()
  }, [filter])

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const url = filter === 'ALL'
        ? '/audit'
        : `/audit/action/${filter}`
      const response = await API.get(url)
      setLogs(response.data)
    } catch (err) {
      setError('Failed to load audit logs')
    } finally {
      setLoading(false)
    }
  }

  const getActionColor = (action) => {
    switch (action) {
      case 'USER_LOGIN': return 'bg-blue-100 text-blue-700'
      case 'USER_REGISTERED': return 'bg-green-100 text-green-700'
      case 'MAIL_SENT': return 'bg-purple-100 text-purple-700'
      case 'DEVICE_REGISTERED': return 'bg-yellow-100 text-yellow-700'
      case 'DEVICE_APPROVED': return 'bg-green-100 text-green-700'
      case 'DEVICE_REJECTED': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Audit Logs</h2>
        <span className="bg-blue-100 text-blue-700 px-3 py-1
                         rounded-full text-sm font-medium">
          {logs.length} records
        </span>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {actions.map(action => (
          <button
            key={action}
            onClick={() => setFilter(action)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition
                        ${filter === action
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            {action}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading logs...</p>
        </div>
      ) : logs.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-8 text-center text-gray-400">
          <p className="text-4xl mb-2">📋</p>
          <p>No audit logs found</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold
                               text-gray-600">#</th>
                <th className="text-left px-6 py-4 text-sm font-semibold
                               text-gray-600">User</th>
                <th className="text-left px-6 py-4 text-sm font-semibold
                               text-gray-600">Action</th>
                <th className="text-left px-6 py-4 text-sm font-semibold
                               text-gray-600">Description</th>
                <th className="text-left px-6 py-4 text-sm font-semibold
                               text-gray-600">Time</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr key={log.id}
                    className="border-b hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-gray-400 text-sm">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-800">
                      {log.userName}
                    </p>
                    <p className="text-xs text-gray-400">{log.userEmail}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium
                                      ${getActionColor(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {log.description}
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-xs">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AuditLogsPage