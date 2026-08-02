import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-b from-eco-50 to-white">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <span className="text-2xl font-bold text-eco-600">🌱 EcoCycle</span>
          <div className="flex gap-4">
            {user ? (
              <Link to="/dashboard" className="btn-primary">
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn-secondary">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Track Your Environmental Impact
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Join EcoCycle to log waste, join communities, compete in challenges, and make a real difference.
        </p>

        {!user && (
          <div className="flex gap-4 justify-center mb-16">
            <Link to="/register" className="bg-eco-500 hover:bg-eco-600 text-white px-8 py-3 rounded-lg text-lg font-medium transition">
              Get Started
            </Link>
            <Link to="/login" className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-lg text-lg font-medium transition">
              Login
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-16">
          <div className="card text-center">
            <div className="text-4xl mb-4">♻️</div>
            <h3 className="text-lg font-bold mb-2">Log Waste</h3>
            <p className="text-gray-600">Track every piece of waste you recycle and earn eco points</p>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-lg font-bold mb-2">Join Communities</h3>
            <p className="text-gray-600">Connect with local eco-warriors and collaborate on green initiatives</p>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-lg font-bold mb-2">Compete in Challenges</h3>
            <p className="text-gray-600">Test your skills in environmental challenges and win rewards</p>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-lg font-bold mb-2">View Leaderboard</h3>
            <p className="text-gray-600">See who's making the biggest environmental impact</p>
          </div>
        </div>

        <div className="mt-20 bg-eco-50 rounded-lg p-8 text-left max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Why EcoCycle?</h2>
          <ul className="space-y-3 text-gray-700">
            <li>✅ Track your environmental footprint in real-time</li>
            <li>✅ Gamified experience with challenges and leaderboards</li>
            <li>✅ Join local communities working toward sustainability</li>
            <li>✅ Earn eco scores and compete globally</li>
            <li>✅ Make data-driven decisions about your waste</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
