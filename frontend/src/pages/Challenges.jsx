import { useState, useEffect } from 'react'
import { challengeAPI } from '../api'

const difficulties = ['easy', 'medium', 'hard', 'extreme']
const categories = ['recycling', 'composting', 'conservation', 'renewable', 'education']

export default function Challenges() {
  const [challenges, setChallenges] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [category, setCategory] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [participatingChallenges, setParticipatingChallenges] = useState(new Set())

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'recycling',
    difficulty: 'medium',
    targetPoints: ''
  })

  useEffect(() => {
    fetchChallenges()
  }, [category, difficulty])

  const fetchChallenges = async () => {
    try {
      setLoading(true)
      const response = await challengeAPI.getAll(1, 20, category, difficulty)
      setChallenges(response.data.data)
    } catch (err) {
      setError('Failed to load challenges')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateChallenge = async (e) => {
    e.preventDefault()
    try {
      await challengeAPI.create(
        formData.title,
        formData.description,
        formData.category,
        formData.difficulty,
        parseInt(formData.targetPoints)
      )
      setFormData({
        title: '',
        description: '',
        category: 'recycling',
        difficulty: 'medium',
        targetPoints: ''
      })
      fetchChallenges()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create challenge')
    }
  }

  const handleParticipate = async (id) => {
    try {
      await challengeAPI.participate(id)
      setParticipatingChallenges(new Set([...participatingChallenges, id]))
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to participate in challenge')
    }
  }

  const getDifficultyColor = (diff) => {
    const colors = {
      easy: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      hard: 'bg-orange-100 text-orange-800',
      extreme: 'bg-red-100 text-red-800'
    }
    return colors[diff] || ''
  }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-gray-900">Challenges</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="card lg:col-span-1">
          <h2 className="text-2xl font-bold mb-6">Create Challenge</h2>
          <form onSubmit={handleCreateChallenge} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="input-field"
                placeholder="Zero Waste Week"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                className="input-field"
                placeholder="Challenge description..."
                rows="2"
              />
            </div>

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
              <label className="block text-gray-700 font-medium mb-2">Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="input-field"
              >
                {difficulties.map(diff => (
                  <option key={diff} value={diff}>{diff.charAt(0).toUpperCase() + diff.slice(1)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Target Points</label>
              <input
                type="number"
                value={formData.targetPoints}
                onChange={(e) => setFormData({ ...formData, targetPoints: e.target.value })}
                required
                className="input-field"
                placeholder="100"
              />
            </div>

            <button type="submit" className="w-full btn-primary py-2">
              Create
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="space-y-3 mb-6">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-field"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
              ))}
            </select>

            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="input-field"
            >
              <option value="">All Difficulties</option>
              {difficulties.map(diff => (
                <option key={diff} value={diff}>{diff.charAt(0).toUpperCase() + diff.slice(1)}</option>
              ))}
            </select>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Active Challenges</h2>
            {loading ? (
              <p>Loading challenges...</p>
            ) : challenges.length === 0 ? (
              <p className="text-gray-600">No challenges found</p>
            ) : (
              <div className="space-y-3">
                {challenges.map(challenge => (
                  <div key={challenge._id} className="card">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold">{challenge.title}</h3>
                        <p className="text-gray-600 mb-2">{challenge.description}</p>
                        <div className="flex gap-2 mb-2">
                          <span className={`text-xs px-3 py-1 rounded-full ${getDifficultyColor(challenge.difficulty)}`}>
                            {challenge.difficulty}
                          </span>
                          <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                            {challenge.targetPoints} points
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          👥 {challenge.participants?.length || 0} participants
                        </div>
                      </div>
                      <button
                        onClick={() => handleParticipate(challenge._id)}
                        disabled={participatingChallenges.has(challenge._id)}
                        className={participatingChallenges.has(challenge._id) ? 'btn-secondary opacity-50' : 'btn-primary'}
                      >
                        {participatingChallenges.has(challenge._id) ? 'Joined' : 'Join'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
