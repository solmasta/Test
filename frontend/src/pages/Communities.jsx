import { useState, useEffect } from 'react'
import { communityAPI } from '../api'

export default function Communities() {
  const [communities, setCommunities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('')
  const [joinedCommunities, setJoinedCommunities] = useState(new Set())

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: ''
  })

  useEffect(() => {
    fetchCommunities()
  }, [search, location])

  const fetchCommunities = async () => {
    try {
      setLoading(true)
      const response = await communityAPI.getAll(1, 20, search, location)
      setCommunities(response.data.data)
    } catch (err) {
      setError('Failed to load communities')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCommunity = async (e) => {
    e.preventDefault()
    try {
      await communityAPI.create(
        formData.name,
        formData.description,
        formData.location
      )
      setFormData({ name: '', description: '', location: '' })
      fetchCommunities()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create community')
    }
  }

  const handleJoinCommunity = async (id) => {
    try {
      await communityAPI.join(id)
      setJoinedCommunities(new Set([...joinedCommunities, id]))
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to join community')
    }
  }

  const handleLeaveCommunity = async (id) => {
    try {
      await communityAPI.leave(id)
      const newJoined = new Set(joinedCommunities)
      newJoined.delete(id)
      setJoinedCommunities(newJoined)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to leave community')
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-gray-900">Communities</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="card lg:col-span-1">
          <h2 className="text-2xl font-bold mb-6">Create Community</h2>
          <form onSubmit={handleCreateCommunity} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="input-field"
                placeholder="Green Warriors"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                className="input-field"
                placeholder="Describe your community..."
                rows="3"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
                className="input-field"
                placeholder="San Francisco, CA"
              />
            </div>

            <button type="submit" className="w-full btn-primary py-2">
              Create
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="space-y-3 mb-6">
            <input
              type="text"
              placeholder="Search communities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field"
            />
            <input
              type="text"
              placeholder="Filter by location..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Browse Communities</h2>
            {loading ? (
              <p>Loading communities...</p>
            ) : communities.length === 0 ? (
              <p className="text-gray-600">No communities found</p>
            ) : (
              <div className="space-y-3">
                {communities.map(community => (
                  <div key={community._id} className="card">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold">{community.name}</h3>
                        <p className="text-gray-600 mb-2">{community.description}</p>
                        <div className="flex gap-4 text-sm text-gray-500">
                          <span>📍 {community.location}</span>
                          <span>👥 {community.members?.length || 0} members</span>
                        </div>
                      </div>
                      <button
                        onClick={() => joinedCommunities.has(community._id)
                          ? handleLeaveCommunity(community._id)
                          : handleJoinCommunity(community._id)
                        }
                        className={joinedCommunities.has(community._id) ? 'btn-secondary' : 'btn-primary'}
                      >
                        {joinedCommunities.has(community._id) ? 'Leave' : 'Join'}
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
