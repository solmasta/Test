import { useState, useEffect } from 'react'
import { wasteLogAPI, statsAPI } from '../api'
import { useAuth } from '../context/AuthContext'

const categories = ['plastic', 'paper', 'metal', 'glass', 'organic', 'electronics']

export default function Dashboard() {
  const { user } = useAuth()
  const [logs, setLogs] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    category: 'plastic',
    weight: '',
    ecoScore: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [logsRes, statsRes] = await Promise.all([
        wasteLogAPI.getAll(1, 10),
        statsAPI.getUserStats(user._id)
      ])
      setLogs(logsRes.data.data)
      setStats(statsRes.data.data)
    } catch (err) {
      setError('Failed to load dashboard')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddLog = async (e) => {
    e.preventDefault()
    try {
      await wasteLogAPI.create(
        formData.category,
        parseFloat(formData.weight),
        parseFloat(formData.ecoScore)
      )
      setFormData({ category: 'plastic', weight: '', ecoScore: '' })
      fetchData()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add log')
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading dashboard...</div>
  }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card bg-gradient-to-br from-eco-50 to-white">
            <div className="text-3xl text-eco-600 mb-2">🏆</div>
            <div className="text-sm text-gray-600">Eco Score</div>
            <div className="text-3xl font-bold text-gray-900">{stats.ecoScore || 0}</div>
          </div>

          <div className="card bg-gradient-to-br from-blue-50 to-white">
            <div className="text-3xl mb-2">♻️</div>
            <div className="text-sm text-gray-600">Waste Logs</div>
            <div className="text-3xl font-bold text-gray-900">{stats.wasteLogsCreated || 0}</div>
          </div>

          <div className="card bg-gradient-to-br from-purple-50 to-white">
            <div className="text-3xl mb-2">🏅</div>
            <div className="text-sm text-gray-600">Earned Points</div>
            <div className="text-3xl font-bold text-gray-900">{stats.totalEcoScoreEarned || 0}</div>
          </div>

          <div className="card bg-gradient-to-br from-yellow-50 to-white">
            <div className="text-3xl mb-2">🎯</div>
            <div className="text-sm text-gray-600">Rank</div>
            <div className="text-3xl font-bold text-gray-900">#{stats.currentRank || 'N/A'}</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="card lg:col-span-1">
          <h2 className="text-2xl font-bold mb-6">Log Waste</h2>
          <form onSubmit={handleAddLog} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="input-field"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                required
                className="input-field"
                placeholder="2.5"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Eco Score</label>
              <input
                type="number"
                value={formData.ecoScore}
                onChange={(e) => setFormData({ ...formData, ecoScore: e.target.value })}
                required
                className="input-field"
                placeholder="10"
              />
            </div>

            <button type="submit" className="w-full btn-primary py-2">
              Add Log
            </button>
          </form>
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-6">Recent Logs</h2>
          <div className="space-y-3">
            {logs.length === 0 ? (
              <p className="text-gray-600">No logs yet. Start logging your waste!</p>
            ) : (
              logs.map(log => (
                <div key={log._id} className="card">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-lg capitalize">{log.category}</div>
                      <div className="text-gray-600">{log.weight} kg • {log.ecoScore} points</div>
                      <div className="text-sm text-gray-500">
                        {new Date(log.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-3xl">♻️</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
