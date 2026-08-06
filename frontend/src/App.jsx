import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { StateManager } from './state_manager'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Communities from './pages/Communities'
import Challenges from './pages/Challenges'
import Leaderboard from './pages/Leaderboard'
import Profile from './pages/Profile'
import Admin from './pages/Admin'
import './index.css'

function App() {
  const initialState = {
    user: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Guest',
      email: '',
      avatar: '',
      bio: ''
    },
    preferences: {
      theme: 'light',
      fontSize: 'medium',
      animations: true,
      quantumMode: false
    },
    version: 1
  };

  return (
    <StateManager initialState={initialState}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<Layout />}>
              <Route
                path="/dashboard"
                element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
              />
              <Route
                path="/communities"
                element={<ProtectedRoute><Communities /></ProtectedRoute>}
              />
              <Route
                path="/challenges"
                element={<ProtectedRoute><Challenges /></ProtectedRoute>}
              />
              <Route
                path="/leaderboard"
                element={<ProtectedRoute><Leaderboard /></ProtectedRoute>}
              />
              <Route
                path="/profile"
                element={<ProtectedRoute><Profile /></ProtectedRoute>}
              />
              <Route
                path="/admin"
                element={<ProtectedRoute><Admin /></ProtectedRoute>}
              />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </StateManager>
  )
}

export default App