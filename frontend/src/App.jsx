import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Communities from './pages/Communities'
import Challenges from './pages/Challenges'
import Leaderboard from './pages/Leaderboard'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('ecocycle_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('ecocycle_user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('ecocycle_user')
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <BrowserRouter>
      <div className="app">
        <Header user={user} onLogout={logout} />
        <main>
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/dashboard" element={<Dashboard user={user} />} />
            <Route path="/communities" element={<Communities user={user} />} />
            <Route path="/challenges" element={<Challenges user={user} />} />
            <Route path="/leaderboard" element={<Leaderboard user={user} />} />
            <Route path="/profile" element={<Profile user={user} onLogin={login} />} />
            <Route path="/login" element={<Login onLogin={login} />} />
            <Route path="/register" element={<Register onLogin={login} />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App