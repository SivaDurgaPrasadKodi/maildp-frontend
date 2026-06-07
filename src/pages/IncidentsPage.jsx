import { useState, useEffect } from 'react'
import API from '../api/axiosConfig'

const IncidentsPage = () => {
  const [incidents, setIncidents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => { fetchIncidents() }, [])

  const fetchIncidents = async () => {
    try {
      const response = await API.get('/security/incidents')
      setIncidents(response.data)
    } catch (err) {
      setError('Failed to load incidents')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id, status) => {
    try {
      await API.patch(`/security/incidents/${id}/status?status=${status}`)
      fetchIncidents()
    } catch (err) {
      setError('Failed to update status')
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
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-700'
      case 'RESOLVED': return 'bg-green-100 text-green-700'
      case 'CLOSED': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <p className="text-gray-500">Loading incidents...</p>
    </div>
  )

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Incident Management
        </h2>
        <span className="bg-red-100 text-red-700 px-3 py-1
                         rounded-full text-sm font-medium">
          {incidents.filter(i => i.status === 'OPEN').length} Open
        </span>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {incidents.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-8 text-center text-gray-400">
          <p className="text-4xl mb-2">✅</p>
          <p>No incidents reported</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold
                               text-gray-600">Title</th>
                <th className="text-left px-6 py-4 text-sm font-semibold
                               text-gray-600">Severity</th>
                <th className="text-left px-6 py-4 text-sm font-semibold
                               text-gray-600">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold
                               text-gray-600">Reported By</th>
                <th className="text-left px-6 py-4 text-sm font-semibold
                               text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map((incident) => (
                <tr key={incident.id}
                    className="border-b hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-800">
                      {incident.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(incident.createdAt).toLocaleString()}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium
                                      ${getSeverityColor(incident.severity)}`}>
                      {incident.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium
                                      ${getStatusColor(incident.status)}`}>
                      {incident.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {incident.reportedByName}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {incident.status === 'OPEN' && (
                        <button
                          onClick={() =>
                            updateStatus(incident.id, 'IN_PROGRESS')}
                          className="bg-blue-100 text-blue-700 px-2 py-1
                                     rounded text-xs hover:bg-blue-200
                                     transition"
                        >
                          In Progress
                        </button>
                      )}
                      {incident.status === 'IN_PROGRESS' && (
                        <button
                          onClick={() =>
                            updateStatus(incident.id, 'RESOLVED')}
                          className="bg-green-100 text-green-700 px-2 py-1
                                     rounded text-xs hover:bg-green-200
                                     transition"
                        >
                          Resolve
                        </button>
                      )}
                      {incident.status === 'RESOLVED' && (
                        <button
                          onClick={() =>
                            updateStatus(incident.id, 'CLOSED')}
                          className="bg-gray-100 text-gray-700 px-2 py-1
                                     rounded text-xs hover:bg-gray-200
                                     transition"
                        >
                          Close
                        </button>
                      )}
                    </div>
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

export default IncidentsPage