import { Link } from 'react-router-dom'

export default function Home({ user }) {
  return (
    <div className="min-h-screen">
      <section className="py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Track Your Environmental Impact
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
          Join EcoCycle to log waste, join communities, compete in challenges, and make a real difference to our planet.
        </p>
        
        {!user ? (
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/register" className="btn btn-primary">
              Get Started
            </Link>
            <Link to="/login" className="btn btn-secondary">
              Login
            </Link>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/dashboard" className="btn btn-primary">
              Go to Dashboard
            </Link>
            <Link to="/challenges" className="btn btn-outline">
              View Challenges
            </Link>
          </div>
        )}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        <div className="card text-center">
          <div className="text-4xl mb-4">♻️</div>
          <h3 className="text-xl font-bold mb-2">Log Waste</h3>
          <p className="text-gray-600">Track every piece of waste you recycle and earn eco points</p>
        </div>

        <div className="card text-center">
          <div className="text-4xl mb-4">👥</div>
          <h3 className="text-xl font-bold mb-2">Join Communities</h3>
          <p className="text-gray-600">Connect with local eco-warriors and collaborate on green initiatives</p>
        </div>

        <div className="card text-center">
          <div className="text-4xl mb-4">🏆</div>
          <h3 className="text-xl font-bold mb-2">Compete in Challenges</h3>
          <p className="text-gray-600">Test your skills in environmental challenges and win rewards</p>
        </div>

        <div className="card text-center">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-xl font-bold mb-2">View Leaderboard</h3>
          <p className="text-gray-600">See who's making the biggest environmental impact</p>
        </div>
      </section>

      <section className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why EcoCycle?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start">
            <div className="text-green-500 text-2xl mr-3">✅</div>
            <div>
              <h3 className="font-bold text-lg mb-1">Track Your Environmental Footprint</h3>
              <p className="text-gray-600">Monitor your impact in real-time with our intuitive dashboard</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="text-green-500 text-2xl mr-3">✅</div>
            <div>
              <h3 className="font-bold text-lg mb-1">Gamified Experience</h3>
              <p className="text-gray-600">Challenges and leaderboards make sustainability fun</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="text-green-500 text-2xl mr-3">✅</div>
            <div>
              <h3 className="font-bold text-lg mb-1">Community Engagement</h3>
              <p className="text-gray-600">Join local communities working toward sustainability</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="text-green-500 text-2xl mr-3">✅</div>
            <div>
              <h3 className="font-bold text-lg mb-1">Data-Driven Decisions</h3>
              <p className="text-gray-600">Make informed choices about your waste habits</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}