import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/axiosConfig'

const ComposePage = () => {
  const [users, setUsers] = useState([])
  const [form, setForm] = useState({
    subject: '',
    body: '',
    recipientIds: [],
    isImportant: false
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await API.get('/users')
      setUsers(response.data)
    } catch (err) {
      console.error('Failed to load users')
    }
  }

  const toggleRecipient = (userId) => {
    setForm(prev => ({
      ...prev,
      recipientIds: prev.recipientIds.includes(userId)
        ? prev.recipientIds.filter(id => id !== userId)
        : [...prev.recipientIds, userId]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.recipientIds.length === 0) {
      setError('Please select at least one recipient')
      return
    }
    setLoading(true)
    setError('')
    try {
      await API.post('/mail/send', form)
      navigate('/mail/sent')
    } catch (err) {
      setError('Failed to send mail')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-3xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Compose Mail</h2>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">{error}</div>
      )}

      <div className="bg-white rounded-xl shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Recipients */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To (select recipients)
            </label>
            <div className="flex flex-wrap gap-2 p-3 border rounded-lg min-h-12">
              {users.map(user => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => toggleRecipient(user.id)}
                  className={`px-3 py-1 rounded-full text-sm transition ${
                    form.recipientIds.includes(user.id)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {user.fullName}
                </button>
              ))}
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <input
              type="text"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder="Enter subject"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Body */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              placeholder="Write your message..."
              required
              rows={8}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Important */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="important"
              checked={form.isImportant}
              onChange={(e) => setForm({ ...form, isImportant: e.target.checked })}
              className="w-4 h-4"
            />
            <label htmlFor="important" className="text-sm text-gray-700">
              Mark as Important
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
            >
              {loading ? 'Sending...' : '📤 Send Mail'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/mail/inbox')}
              className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ComposePage