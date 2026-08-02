import { useState, useEffect } from 'react'
import { statsAPI } from '../api'

export default function Leaderboard() {
  const [users, setUsers] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchLeaderboard()
  }, [page])

  const fetchLeaderboard = async () => {
    try {
      setLoading(true)
      const response = await statsAPI.getLeaderboard(page, 20)
      setUsers(response.data.data)
    } catch (err) {
      setError('Failed to load leaderboard')
    } finally {
      setLoading(false)
    }
  }

  const getMedalEmoji = (rank) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return ''
  }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-gray-900">🏆 Leaderboard</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-gradient-to-r from-eco-500 to-eco-600 text-white rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-bold mb-2">Top Environmental Warriors</h2>
        <p>Join thousands of eco-conscious users making a real impact on our planet.</p>
      </div>

      {loading ? (
        <p className="text-center">Loading leaderboard...</p>
      ) : users.length === 0 ? (
        <p className="text-center text-gray-600">No users found</p>
      ) : (
        <div className="space-y-3">
          {users.map((user, index) => (
            <div
              key={user._id}
              className={`card ${index < 3 ? 'border-l-4 border-yellow-500' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="text-3xl font-bold text-gray-400 w-12 text-center">
                    {getMedalEmoji(index + 1) || `#${index + 1}`}
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">{user.username}</div>
                    <div className="text-sm text-gray-600">
                      {user.wasteLogsCreated || 0} logs • {user.communitiesJoined || 0} communities
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-bold text-eco-600">
                    {user.ecoScore || 0}
                  </div>
                  <div className="text-sm text-gray-600">eco points</div>
                </div>
              </div>

              <div className="mt-4 bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-eco-500 to-eco-600 h-full"
                  style={{ width: `${Math.min((user.ecoScore || 0) / 10, 100)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="btn-secondary disabled:opacity-50"
        >
          ← Previous
        </button>
        <span className="px-4 py-2 text-gray-600">Page {page}</span>
        <button
          onClick={() => setPage(p => p + 1)}
          disabled={users.length < 20}
          className="btn-secondary disabled:opacity-50"
        >
          Next →
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
        <div className="card text-center">
          <div className="text-4xl mb-2">♻️</div>
          <div className="text-sm text-gray-600">Total Waste Tracked</div>
          <div className="text-2xl font-bold text-gray-900">10,000+ kg</div>
        </div>

        <div className="card text-center">
          <div className="text-4xl mb-2">👥</div>
          <div className="text-sm text-gray-600">Active Users</div>
          <div className="text-2xl font-bold text-gray-900">500+</div>
        </div>

        <div className="card text-center">
          <div className="text-4xl mb-2">🌍</div>
          <div className="text-sm text-gray-600">CO2 Saved (est.)</div>
          <div className="text-2xl font-bold text-gray-900">50 tons</div>
        </div>
      </div>
    </div>
  )
}
