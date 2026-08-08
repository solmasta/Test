import { Link, useNavigate } from 'react-router-dom'

export default function Header({ user, onLogout }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    onLogout()
    navigate('/')
  }

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-green-600 flex items-center">
          <span className="mr-2">🌱</span>
          EcoCycle
        </Link>
        
        <nav className="flex items-center space-x-4">
          {user ? (
            <>
              <Link to="/dashboard" className="text-gray-700 hover:text-green-600">
                Dashboard
              </Link>
              <Link to="/communities" className="text-gray-700 hover:text-green-600">
                Communities
              </Link>
              <Link to="/challenges" className="text-gray-700 hover:text-green-600">
                Challenges
              </Link>
              <Link to="/leaderboard" className="text-gray-700 hover:text-green-600">
                Leaderboard
              </Link>
              <Link to="/profile" className="text-gray-700 hover:text-green-600">
                Profile
              </Link>
              <button 
                onClick={handleLogout}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-green-600">
                Login
              </Link>
              <Link to="/register" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition">
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}