import { useState, useEffect } from 'react'
import API from '../api/axiosConfig'

const DeviceApprovalPage = () => {
  const [devices, setDevices] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('PENDING')
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDevices()
  }, [filter])

  const fetchDevices = async () => {
    setLoading(true)
    try {
      const url = filter === 'ALL'
        ? '/devices'
        : '/devices/pending'
      const response = await API.get(url)
      setDevices(response.data)
    } catch (err) {
      setError('Failed to load devices')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id) => {
    try {
      await API.patch(`/devices/${id}/approve`)
      fetchDevices()
    } catch (err) {
      setError('Failed to approve device')
    }
  }

  const handleReject = async (id) => {
    try {
      await API.patch(`/devices/${id}/reject`)
      fetchDevices()
    } catch (err) {
      setError('Failed to reject device')
    }
  }

  const handleRevoke = async (id) => {
    if (window.confirm('Revoke this device?')) {
      try {
        await API.patch(`/devices/${id}/revoke`)
        fetchDevices()
      } catch (err) {
        setError('Failed to revoke device')
      }
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-700'
      case 'PENDING': return 'bg-yellow-100 text-yellow-700'
      case 'REJECTED': return 'bg-red-100 text-red-700'
      case 'REVOKED': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Device Approval
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('PENDING')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition
                        ${filter === 'PENDING'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('ALL')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition
                        ${filter === 'ALL'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            All Devices
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading...</p>
        </div>
      ) : devices.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-8 text-center text-gray-400">
          <p className="text-4xl mb-2">✅</p>
          <p>No {filter === 'PENDING' ? 'pending' : ''} devices</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold
                               text-gray-600">Device</th>
                <th className="text-left px-6 py-4 text-sm font-semibold
                               text-gray-600">Owner</th>
                <th className="text-left px-6 py-4 text-sm font-semibold
                               text-gray-600">Type / OS</th>
                <th className="text-left px-6 py-4 text-sm font-semibold
                               text-gray-600">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold
                               text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((device) => (
                <tr key={device.id}
                    className="border-b hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-800">
                      {device.deviceName}
                    </p>
                    {device.macAddress && (
                      <p className="text-xs text-gray-400">
                        {device.macAddress}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-700">{device.ownerName}</p>
                    <p className="text-xs text-gray-400">{device.ownerEmail}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {device.deviceType} / {device.operatingSystem}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium
                                      ${getStatusColor(device.status)}`}>
                      {device.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {device.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleApprove(device.id)}
                            className="bg-green-100 text-green-700 px-3 py-1
                                       rounded text-xs hover:bg-green-200
                                       transition font-medium"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(device.id)}
                            className="bg-red-100 text-red-700 px-3 py-1
                                       rounded text-xs hover:bg-red-200
                                       transition font-medium"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {device.status === 'APPROVED' && (
                        <button
                          onClick={() => handleRevoke(device.id)}
                          className="bg-gray-100 text-gray-700 px-3 py-1
                                     rounded text-xs hover:bg-gray-200
                                     transition font-medium"
                        >
                          Revoke
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

export default DeviceApprovalPage