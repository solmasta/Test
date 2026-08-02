import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { authAPI, statsAPI } from '../api'

export default function Profile() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || ''
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await statsAPI.getUserStats(user._id)
      setStats(response.data.data)
    } catch (err) {
      setError('Failed to load stats')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    try {
      setError('')
      setSuccess('')
      await authAPI.updateProfile({
        username: formData.username,
        email: formData.email
      })
      setSuccess('Profile updated successfully!')
      setEditing(false)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile')
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading profile...</div>
  }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-gray-900">Profile</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-eco-50 border border-eco-200 text-eco-700 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="card lg:col-span-1">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">👤</div>
            <h2 className="text-2xl font-bold">{user?.username}</h2>
            <p className="text-gray-600">{user?.email}</p>
          </div>

          {editing ? (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field"
                />
              </div>

              <div className="flex gap-2">
                <button type="submit" className="flex-1 btn-primary py-2">
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="flex-1 btn-secondary py-2"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="w-full btn-primary py-2"
            >
              Edit Profile
            </button>
          )}
        </div>

        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-2xl font-bold">Statistics</h2>

          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="card bg-gradient-to-br from-eco-50 to-white">
                <div className="text-sm text-gray-600">Eco Score</div>
                <div className="text-4xl font-bold text-eco-600 mt-2">
                  {stats.ecoScore || 0}
                </div>
              </div>

              <div className="card bg-gradient-to-br from-blue-50 to-white">
                <div className="text-sm text-gray-600">Waste Logs Created</div>
                <div className="text-4xl font-bold text-blue-600 mt-2">
                  {stats.wasteLogsCreated || 0}
                </div>
              </div>

              <div className="card bg-gradient-to-br from-purple-50 to-white">
                <div className="text-sm text-gray-600">Total Points Earned</div>
                <div className="text-4xl font-bold text-purple-600 mt-2">
                  {stats.totalEcoScoreEarned || 0}
                </div>
              </div>

              <div className="card bg-gradient-to-br from-yellow-50 to-white">
                <div className="text-sm text-gray-600">Challenges Completed</div>
                <div className="text-4xl font-bold text-yellow-600 mt-2">
                  {stats.challengesCompleted || 0}
                </div>
              </div>

              <div className="card bg-gradient-to-br from-pink-50 to-white md:col-span-2">
                <div className="text-sm text-gray-600">Global Rank</div>
                <div className="text-4xl font-bold text-pink-600 mt-2">
                  #{stats.currentRank || 'N/A'}
                </div>
                <div className="mt-4 bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-eco-500 to-eco-600 h-full"
                    style={{ width: `${Math.min((stats.ecoScore || 0) / 100, 100)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-600 mt-2">
                  {stats.ecoScore || 0} / 1000 points to next tier
                </div>
              </div>
            </div>
          )}

          <div className="card bg-gradient-to-br from-green-50 to-white">
            <h3 className="text-lg font-bold mb-4">Environmental Impact</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Estimated CO2 Saved</span>
                <span className="font-bold text-eco-600">
                  {((stats?.totalEcoScoreEarned || 0) * 0.5).toFixed(1)} kg
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Waste Diverted from Landfill</span>
                <span className="font-bold text-eco-600">
                  {(stats?.wasteLogsCreated || 0) * 2.5} kg
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Contribution to Communities</span>
                <span className="font-bold text-eco-600">
                  {stats?.communitiesJoined || 0} communities
                </span>
              </div>
            </div>
          </div>

          <div className="card bg-blue-50 border border-blue-200">
            <h3 className="text-lg font-bold mb-2">Member Since</h3>
            <p className="text-gray-600">
              {new Date(user?.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
