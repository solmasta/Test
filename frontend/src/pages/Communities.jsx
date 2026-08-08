import { useState, useEffect } from 'react'

export default function Communities({ user }) {
  const [communities, setCommunities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching communities
    setTimeout(() => {
      setCommunities([
        {
          id: 1,
          name: 'Green Neighborhoods',
          members: 1240,
          description: 'Making our neighborhoods more sustainable one block at a time',
          location: 'San Francisco, CA',
          image: 'https://images.unsplash.com/photo-1472289065619-e7a032019694?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
        },
        {
          id: 2,
          name: 'Zero Waste Warriors',
          members: 890,
          description: 'Committed to producing zero waste in our daily lives',
          location: 'Global',
          image: 'https://images.unsplash.com/photo-1589047601160-9c70f1a0d9c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
        },
        {
          id: 3,
          name: 'Urban Gardeners',
          members: 2100,
          description: 'Growing food sustainably in city environments',
          location: 'New York, NY',
          image: 'https://images.unsplash.com/photo-1599744996156-7d704f0f1e0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
        },
        {
          id: 4,
          name: 'Ocean Conservation',
          members: 3500,
          description: 'Protecting our oceans and marine life',
          location: 'Global',
          image: 'https://images.unsplash.com/photo-1518021505636-1ed90c5c5e2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  if (!user) {
    return (
      <div className="card text-center">
        <h2 className="text-2xl font-bold mb-4">Please log in</h2>
        <p className="mb-6">You need to be logged in to view communities.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Eco Communities</h1>
        <p className="text-gray-600">Join like-minded individuals working toward sustainability</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communities.map((community) => (
            <div key={community.id} className="card">
              <img 
                src={community.image} 
                alt={community.name} 
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-bold mb-2">{community.name}</h3>
              <p className="text-gray-600 mb-3">{community.description}</p>
              <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                <span>{community.location}</span>
                <span>{community.members.toLocaleString()} members</span>
              </div>
              <button className="btn btn-outline w-full">
                Join Community
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="card mt-8">
        <h2 className="text-xl font-bold mb-4">Create Your Own Community</h2>
        <p className="text-gray-600 mb-4">
          Can't find a community that matches your interests? Create your own and start making a difference.
        </p>
        <button className="btn btn-primary">
          Create Community
        </button>
      </div>
    </div>
  )
}