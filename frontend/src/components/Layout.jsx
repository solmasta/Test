import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-eco-600">
            🌱 EcoCycle
          </Link>

          <div className="flex gap-6 items-center">
            <Link to="/dashboard" className="text-gray-700 hover:text-eco-600 transition">
              Dashboard
            </Link>
            <Link to="/communities" className="text-gray-700 hover:text-eco-600 transition">
              Communities
            </Link>
            <Link to="/challenges" className="text-gray-700 hover:text-eco-600 transition">
              Challenges
            </Link>
            <Link to="/leaderboard" className="text-gray-700 hover:text-eco-600 transition">
              Leaderboard
            </Link>

            <div className="flex gap-3 items-center">
              <Link to="/profile" className="text-gray-700 hover:text-eco-600 transition">
                👤 {user?.username}
              </Link>
              <button
                onClick={handleLogout}
                className="btn-secondary"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>

      <footer className="bg-gray-800 text-gray-300 text-center py-8 mt-16">
        <p>© 2026 EcoCycle - Track Your Environmental Impact</p>
      </footer>
    </div>
  )
}
