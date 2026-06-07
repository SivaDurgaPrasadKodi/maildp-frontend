import { useState, useEffect } from 'react'
import API from '../api/axiosConfig'

const DevicesPage = () => {
  const [devices, setDevices] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    deviceName: '',
    deviceType: '',
    operatingSystem: '',
    macAddress: '',
    ipAddress: ''
  })

  useEffect(() => {
    fetchMyDevices()
  }, [])

  const fetchMyDevices = async () => {
    try {
      const response = await API.get('/devices/my-devices')
      setDevices(response.data)
    } catch (err) {
      setError('Failed to load devices')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await API.post('/devices/register', form)
      setForm({
        deviceName: '',
        deviceType: '',
        operatingSystem: '',
        macAddress: '',
        ipAddress: ''
      })
      setShowForm(false)
      fetchMyDevices()
    } catch (err) {
      setError('Failed to register device')
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

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <p className="text-gray-500">Loading devices...</p>
    </div>
  )

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Devices</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg
                     hover:bg-blue-700 transition text-sm font-medium"
        >
          {showForm ? 'Cancel' : '+ Register Device'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Register New Device
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Device Name *
              </label>
              <input
                type="text"
                placeholder="My Laptop"
                value={form.deviceName}
                onChange={(e) =>
                  setForm({ ...form, deviceName: e.target.value })}
                required
                className="w-full px-3 py-2 border rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Device Type
              </label>
              <select
                value={form.deviceType}
                onChange={(e) =>
                  setForm({ ...form, deviceType: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select type</option>
                <option value="Laptop">Laptop</option>
                <option value="Desktop">Desktop</option>
                <option value="Mobile">Mobile</option>
                <option value="Tablet">Tablet</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Operating System
              </label>
              <select
                value={form.operatingSystem}
                onChange={(e) =>
                  setForm({ ...form, operatingSystem: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select OS</option>
                <option value="Windows 11">Windows 11</option>
                <option value="Windows 10">Windows 10</option>
                <option value="macOS">macOS</option>
                <option value="Ubuntu">Ubuntu</option>
                <option value="Android">Android</option>
                <option value="iOS">iOS</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                MAC Address
              </label>
              <input
                type="text"
                placeholder="00:1A:2B:3C:4D:5E"
                value={form.macAddress}
                onChange={(e) =>
                  setForm({ ...form, macAddress: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="col-span-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg
                           hover:bg-blue-700 transition font-medium"
              >
                Submit Registration Request
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {devices.length === 0 ? (
          <div className="col-span-2 bg-white rounded-xl shadow p-8
                          text-center text-gray-400">
            <p className="text-4xl mb-2">💻</p>
            <p>No devices registered yet</p>
          </div>
        ) : (
          devices.map((device) => (
            <div key={device.id}
                 className="bg-white rounded-xl shadow p-5">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">
                    {device.deviceName}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    {device.deviceType} • {device.operatingSystem}
                  </p>
                  {device.macAddress && (
                    <p className="text-gray-400 text-xs mt-1">
                      MAC: {device.macAddress}
                    </p>
                  )}
                  <p className="text-gray-400 text-xs mt-1">
                    Registered: {new Date(device.registeredAt)
                      .toLocaleDateString()}
                  </p>
                  {device.approvedByName && (
                    <p className="text-gray-400 text-xs mt-1">
                      Actioned by: {device.approvedByName}
                    </p>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium
                                  ${getStatusColor(device.status)}`}>
                  {device.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default DevicesPage