import { useState, useEffect } from 'react'
import API from '../api/axiosConfig'

const SecurityAlertsPage = () => {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '', description: '', severity: 'MEDIUM'
  })

  useEffect(() => { fetchAlerts() }, [])

  const fetchAlerts = async () => {
    try {
      const response = await API.get('/security/alerts')
      setAlerts(response.data)
    } catch (err) {
      setError('Failed to load alerts')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await API.post('/security/alerts', form)
      setForm({ title: '', description: '', severity: 'MEDIUM' })
      setShowForm(false)
      fetchAlerts()
    } catch (err) {
      setError('Failed to create alert')
    }
  }

  const handleAcknowledge = async (id) => {
    try {
      await API.patch(`/security/alerts/${id}/acknowledge`)
      fetchAlerts()
    } catch (err) {
      setError('Failed to acknowledge alert')
    }
  }

  const handleResolve = async (id) => {
    try {
      await API.patch(`/security/alerts/${id}/resolve`)
      fetchAlerts()
    } catch (err) {
      setError('Failed to resolve alert')
    }
  }

  const handleCreateIncident = async (id) => {
    try {
      await API.post(`/security/alerts/${id}/incident`)
      alert('Incident created successfully!')
      fetchAlerts()
    } catch (err) {
      setError('Failed to create incident')
    }
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-100 text-red-700'
      case 'HIGH': return 'bg-orange-100 text-orange-700'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-700'
      case 'LOW': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'OPEN': return 'bg-red-100 text-red-700'
      case 'ACKNOWLEDGED': return 'bg-yellow-100 text-yellow-700'
      case 'RESOLVED': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <p className="text-gray-500">Loading alerts...</p>
    </div>
  )

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Security Alerts</h2>
        <div className="flex gap-3">
          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
            {alerts.filter(a => a.status === 'OPEN').length} Open
          </span>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg
                       hover:bg-red-700 transition text-sm font-medium"
          >
            {showForm ? 'Cancel' : '🚨 New Alert'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">{error}</div>
      )}

      {showForm && (
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Create Security Alert
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Alert title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className="w-full px-4 py-2 border rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <select
              value={form.severity}
              onChange={(e) => setForm({ ...form, severity: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
              <option value="CRITICAL">CRITICAL</option>
            </select>
            <button
              type="submit"
              className="bg-red-600 text-white px-6 py-2 rounded-lg
                         hover:bg-red-700 transition font-medium"
            >
              Create Alert
            </button>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {alerts.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center text-gray-400">
            <p className="text-4xl mb-2">🛡️</p>
            <p>No security alerts</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div key={alert.id}
                 className="bg-white rounded-xl shadow p-5">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-800">
                      {alert.title}
                    </h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium
                                      ${getSeverityColor(alert.severity)}`}>
                      {alert.severity}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium
                                      ${getStatusColor(alert.status)}`}>
                      {alert.status}
                    </span>
                  </div>
                  {alert.description && (
                    <p className="text-gray-500 text-sm mb-2">
                      {alert.description}
                    </p>
                  )}
                  <p className="text-gray-400 text-xs">
                    By: {alert.triggeredByName} •{' '}
                    {new Date(alert.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  {alert.status === 'OPEN' && (
                    <button
                      onClick={() => handleAcknowledge(alert.id)}
                      className="bg-yellow-100 text-yellow-700 px-3 py-1
                                 rounded text-xs hover:bg-yellow-200
                                 transition font-medium"
                    >
                      Acknowledge
                    </button>
                  )}
                  {alert.status !== 'RESOLVED' && (
                    <button
                      onClick={() => handleResolve(alert.id)}
                      className="bg-green-100 text-green-700 px-3 py-1
                                 rounded text-xs hover:bg-green-200
                                 transition font-medium"
                    >
                      Resolve
                    </button>
                  )}
                  {alert.status !== 'RESOLVED' && (
                    <button
                      onClick={() => handleCreateIncident(alert.id)}
                      className="bg-red-100 text-red-700 px-3 py-1
                                 rounded text-xs hover:bg-red-200
                                 transition font-medium"
                    >
                      → Incident
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default SecurityAlertsPage