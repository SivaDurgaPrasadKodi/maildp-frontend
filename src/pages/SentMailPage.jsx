import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/axiosConfig'

const SentMailPage = () => {
  const [mails, setMails] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMail, setSelectedMail] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchSentMail()
  }, [])

  const fetchSentMail = async () => {
    try {
      const response = await API.get('/mail/sent')
      setMails(response.data)
    } catch (err) {
      console.error('Failed to load sent mail')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <p className="text-gray-500">Loading sent mail...</p>
    </div>
  )

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Sent Mail</h2>
        <button
          onClick={() => navigate('/mail/compose')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
        >
          ✉️ Compose
        </button>
      </div>

      <div className="flex gap-6">
        <div className="w-1/2 bg-white rounded-xl shadow overflow-hidden">
          {mails.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <p className="text-4xl mb-2">📤</p>
              <p>No sent mail</p>
            </div>
          ) : (
            mails.map((mail) => (
              <div
                key={mail.id}
                onClick={() => setSelectedMail(mail)}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition ${
                  selectedMail?.id === mail.id
                    ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <p className="text-gray-800 text-sm">
                    To: {mail.recipientNames?.join(', ')}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(mail.sentAt).toLocaleDateString()}
                  </p>
                </div>
                <p className="text-sm font-medium text-gray-700 mt-1">
                  {mail.subject}
                </p>
              </div>
            ))
          )}
        </div>

        <div className="w-1/2 bg-white rounded-xl shadow p-6">
          {selectedMail ? (
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                {selectedMail.subject}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                To: <strong>{selectedMail.recipientNames?.join(', ')}</strong>
              </p>
              <div className="border-t pt-4">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {selectedMail.body}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <p>Select a mail to view</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SentMailPage