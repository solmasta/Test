import { useState, useEffect } from 'react'

export default function Dashboard({ user }) {
  const [stats, setStats] = useState({
    wasteLogged: 0,
    challengesCompleted: 0,
    communityPoints: 0,
    ecoScore: 0
  })

  const [recentActivity, setRecentActivity] = useState([])

  useEffect(() => {
    // Simulate fetching user stats
    setStats({
      wasteLogged: 24,
      challengesCompleted: 5,
      communityPoints: 120,
      ecoScore: 85
    })

    // Simulate fetching recent activity
    setRecentActivity([
      { id: 1, action: 'Logged 3 plastic bottles', date: '2023-06-15', points: 15 },
      { id: 2, action: 'Completed "Zero Waste Week" challenge', date: '2023-06-12', points: 50 },
      { id: 3, action: 'Joined "Green Neighborhoods" community', date: '2023-06-10', points: 20 },
      { id: 4, action: 'Logged 2 paper items', date: '2023-06-08', points: 10 }
    ])
  }, [])

  if (!user) {
    return (
      <div className="card text-center">
        <h2 className="text-2xl font-bold mb-4">Please log in</h2>
        <p className="mb-6">You need to be logged in to view your dashboard.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
        <p className="text-gray-600">Here's your environmental impact summary</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card text-center">
          <div className="text-3xl font-bold text-green-600">{stats.wasteLogged}</div>
          <div className="text-gray-600">Items Logged</div>
        </div>
        
        <div className="card text-center">
          <div className="text-3xl font-bold text-green-600">{stats.challengesCompleted}</div>
          <div className="text-gray-600">Challenges Completed</div>
        </div>
        
        <div className="card text-center">
          <div className="text-3xl font-bold text-green-600">{stats.communityPoints}</div>
          <div className="text-gray-600">Community Points</div>
        </div>
        
        <div className="card text-center">
          <div className="text-3xl font-bold text-green-600">{stats.ecoScore}</div>
          <div className="text-gray-600">Eco Score</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0">
                <div>
                  <div className="font-medium">{activity.action}</div>
                  <div className="text-sm text-gray-500">{activity.date}</div>
                </div>
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  +{activity.points} pts
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="btn btn-outline w-full text-left">
              Log New Waste Item
            </button>
            <button className="btn btn-outline w-full text-left">
              Join a Challenge
            </button>
            <button className="btn btn-outline w-full text-left">
              Find Local Community
            </button>
            <button className="btn btn-outline w-full text-left">
              View Leaderboard
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}