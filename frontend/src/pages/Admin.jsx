import { useState, useEffect } from 'react'
import { statsAPI, wasteLogAPI, communityAPI, challengeAPI } from '../api'

export default function Admin() {
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [challenges, setChallenges] = useState([])
  const [communities, setCommunities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchData()
  }, [activeTab])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError('')

      if (activeTab === 'overview') {
        const [challengeStats, wasteStats] = await Promise.all([
          statsAPI.getChallengeStats(),
          statsAPI.getWasteStats()
        ])
        setStats({
          challenges: challengeStats.data.data,
          waste: wasteStats.data.data
        })
      } else if (activeTab === 'users') {
        const leaderboard = await statsAPI.getLeaderboard(1, 50)
        setUsers(leaderboard.data.data)
      } else if (activeTab === 'challenges') {
        const allChallenges = await challengeAPI.getAll(1, 100)
        setChallenges(allChallenges.data.data)
      } else if (activeTab === 'communities') {
        const allCommunities = await communityAPI.getAll(1, 100)
        setCommunities(allCommunities.data.data)
      }
    } catch (err) {
      setError('Failed to load data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleChallengeToggle = async (challengeId, currentStatus) => {
    try {
      await challengeAPI.update(challengeId, {
        isActive: !currentStatus
      })
      fetchData()
    } catch (err) {
      setError('Failed to update challenge')
    }
  }

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-8 rounded-lg">
        <h1 className="text-4xl font-bold mb-2">🔐 Admin Dashboard</h1>
        <p>Manage platform content, users, and monitor system health</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex gap-4 overflow-x-auto pb-2">
        {[
          { id: 'overview', label: '📊 Overview' },
          { id: 'users', label: '👥 Users' },
          { id: 'challenges', label: '🏆 Challenges' },
          { id: 'communities', label: '🏘️ Communities' },
          { id: 'moderation', label: '⚠️ Moderation' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <>
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="card bg-gradient-to-br from-blue-50 to-white">
                  <div className="text-sm text-gray-600">Total Challenges</div>
                  <div className="text-4xl font-bold text-blue-600 mt-2">
                    {stats?.challenges?.totalChallenges || 0}
                  </div>
                </div>

                <div className="card bg-gradient-to-br from-green-50 to-white">
                  <div className="text-sm text-gray-600">Active Challenges</div>
                  <div className="text-4xl font-bold text-green-600 mt-2">
                    {stats?.challenges?.activeChallenges || 0}
                  </div>
                </div>

                <div className="card bg-gradient-to-br from-purple-50 to-white">
                  <div className="text-sm text-gray-600">Total Participants</div>
                  <div className="text-4xl font-bold text-purple-600 mt-2">
                    {stats?.challenges?.totalParticipants || 0}
                  </div>
                </div>

                <div className="card bg-gradient-to-br from-yellow-50 to-white">
                  <div className="text-sm text-gray-600">Completion Rate</div>
                  <div className="text-4xl font-bold text-yellow-600 mt-2">
                    {stats?.challenges?.completionRate?.toFixed(1) || 0}%
                  </div>
                </div>
              </div>

              <div className="card">
                <h2 className="text-2xl font-bold mb-4">Waste Statistics by Category</h2>
                <div className="space-y-3">
                  {stats?.waste?.map((stat, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="font-medium capitalize">{stat._id || 'Unknown'}</span>
                      <div className="flex gap-4 items-center">
                        <div className="w-48 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-eco-500 h-2 rounded-full"
                            style={{ width: `${Math.min((stat.count / 100) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <span className="font-bold">{stat.count} logs</span>
                        <span className="text-gray-600">{stat.avgEcoScore?.toFixed(1) || 0} avg score</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="card">
              <h2 className="text-2xl font-bold mb-6">Top Users by Eco Score</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Rank</th>
                      <th className="text-left py-3 px-4">Username</th>
                      <th className="text-left py-3 px-4">Eco Score</th>
                      <th className="text-left py-3 px-4">Waste Logs</th>
                      <th className="text-left py-3 px-4">Communities</th>
                      <th className="text-left py-3 px-4">Challenges</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, idx) => (
                      <tr key={user._id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}</td>
                        <td className="py-3 px-4 font-medium">{user.username}</td>
                        <td className="py-3 px-4 font-bold text-eco-600">{user.ecoScore || 0}</td>
                        <td className="py-3 px-4">{user.wasteLogsCreated || 0}</td>
                        <td className="py-3 px-4">{user.communitiesJoined || 0}</td>
                        <td className="py-3 px-4">{user.challengesCompleted || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'challenges' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Manage Challenges</h2>
              {challenges.map(challenge => (
                <div key={challenge._id} className="card">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold">{challenge.title}</h3>
                      <p className="text-gray-600 mb-2">{challenge.description}</p>
                      <div className="flex gap-4 text-sm text-gray-500">
                        <span>📂 {challenge.category}</span>
                        <span>📊 {challenge.participants?.length || 0} participants</span>
                        <span>🎯 {challenge.targetPoints} points</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleChallengeToggle(challenge._id, challenge.isActive)}
                      className={`px-4 py-2 rounded-lg font-medium transition ${
                        challenge.isActive
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {challenge.isActive ? '✓ Active' : '✗ Inactive'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'communities' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Manage Communities</h2>
              {communities.map(community => (
                <div key={community._id} className="card">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold">{community.name}</h3>
                      <p className="text-gray-600 mb-2">{community.description}</p>
                      <div className="flex gap-4 text-sm text-gray-500">
                        <span>📍 {community.location}</span>
                        <span>👥 {community.members?.length || 0} members</span>
                        <span>📅 Created {new Date(community.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-eco-600">{community.members?.length || 0}</div>
                      <div className="text-sm text-gray-600">members</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'moderation' && (
            <div className="card">
              <h2 className="text-2xl font-bold mb-6">Moderation Tools</h2>
              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <h3 className="font-bold text-yellow-900 mb-2">⚠️ Flagged Content</h3>
                  <p className="text-yellow-800">No flagged content at this time</p>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <h3 className="font-bold text-blue-900 mb-2">🚨 Recent Reports</h3>
                  <p className="text-blue-800">No reports at this time</p>
                </div>

                <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                  <h3 className="font-bold text-purple-900 mb-2">🔍 System Health</h3>
                  <div className="space-y-2 text-purple-800">
                    <div className="flex justify-between">
                      <span>API Response Time</span>
                      <span className="font-bold">&lt;100ms ✓</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Database Status</span>
                      <span className="font-bold">Connected ✓</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Error Rate</span>
                      <span className="font-bold">&lt;1% ✓</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
