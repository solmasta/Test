require('dotenv').config()
const mongoose = require('mongoose')
const User = require('../src/models/User')
const WasteLog = require('../src/models/WasteLog')
const Community = require('../src/models/Community')
const Business = require('../src/models/Business')
const Challenge = require('../src/models/Challenge')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecocycle'

const seedData = {
  users: [
    { username: 'eco_warrior_1', email: 'warrior1@example.com', password: 'password123', ecoScore: 850 },
    { username: 'green_goddess', email: 'goddess@example.com', password: 'password123', ecoScore: 920 },
    { username: 'waste_warrior', email: 'waste@example.com', password: 'password123', ecoScore: 780 },
    { username: 'recycle_king', email: 'king@example.com', password: 'password123', ecoScore: 1050 },
    { username: 'earth_lover', email: 'lover@example.com', password: 'password123', ecoScore: 650 },
    { username: 'nature_ninja', email: 'ninja@example.com', password: 'password123', ecoScore: 890 },
    { username: 'planet_guardian', email: 'guardian@example.com', password: 'password123', ecoScore: 760 },
    { username: 'trash_master', email: 'trash@example.com', password: 'password123', ecoScore: 620 },
    { username: 'sustainability_star', email: 'star@example.com', password: 'password123', ecoScore: 1100 },
    { username: 'carbon_cutter', email: 'carbon@example.com', password: 'password123', ecoScore: 700 },
  ],

  wasteLogs: [
    { category: 'plastic', weight: 2.5, ecoScore: 25, description: 'Plastic bottles and bags' },
    { category: 'paper', weight: 1.5, ecoScore: 15, description: 'Cardboard boxes' },
    { category: 'metal', weight: 0.8, ecoScore: 20, description: 'Aluminum cans' },
    { category: 'glass', weight: 1.2, ecoScore: 12, description: 'Glass bottles' },
    { category: 'organic', weight: 3.0, ecoScore: 30, description: 'Food waste and compost' },
    { category: 'electronics', weight: 0.5, ecoScore: 50, description: 'Old phone' },
  ],

  communities: [
    {
      name: 'Urban Composters',
      description: 'City-based composting initiative to reduce organic waste',
      location: 'New York, NY'
    },
    {
      name: 'Zero Waste Warriors',
      description: 'Dedicated to achieving zero-waste lifestyle',
      location: 'San Francisco, CA'
    },
    {
      name: 'Plastic-Free Paradise',
      description: 'Reducing single-use plastics in our community',
      location: 'Portland, OR'
    },
    {
      name: 'Recycling Revolution',
      description: 'Promoting effective recycling practices',
      location: 'Seattle, WA'
    },
    {
      name: 'Green City Initiative',
      description: 'Making our city more sustainable together',
      location: 'Boulder, CO'
    },
  ],

  businesses: [
    {
      name: 'EcoShop Market',
      category: 'retail',
      city: 'San Francisco',
      description: 'Sustainable products and zero-waste goods',
      averageRating: 4.8,
      totalReviews: 124
    },
    {
      name: 'Green Cycle Repair',
      category: 'service',
      city: 'Portland',
      description: 'Bicycle repair and maintenance',
      averageRating: 4.6,
      totalReviews: 89
    },
    {
      name: 'Organic Harvest Farm',
      category: 'food',
      city: 'Boulder',
      description: 'Locally grown organic vegetables and fruits',
      averageRating: 4.9,
      totalReviews: 234
    },
    {
      name: 'Renewable Energy Solutions',
      category: 'energy',
      city: 'Seattle',
      description: 'Solar and wind energy installation',
      averageRating: 4.7,
      totalReviews: 145
    },
    {
      name: 'Waste Not Cafe',
      category: 'food',
      city: 'New York',
      description: 'Zero-waste restaurant with sustainable practices',
      averageRating: 4.5,
      totalReviews: 67
    },
  ],

  challenges: [
    {
      title: 'Plastic-Free Week',
      description: 'Avoid single-use plastics for 7 days and track your waste reduction',
      category: 'recycling',
      difficulty: 'medium',
      targetPoints: 100,
      isActive: true
    },
    {
      title: 'Compost Challenge',
      description: 'Start composting and achieve 50kg of composted waste',
      category: 'composting',
      difficulty: 'hard',
      targetPoints: 150,
      isActive: true
    },
    {
      title: 'Zero Waste Shopping',
      description: 'Buy groceries without producing any packaging waste',
      category: 'recycling',
      difficulty: 'hard',
      targetPoints: 120,
      isActive: true
    },
    {
      title: 'Bike to Work Week',
      description: 'Commute by bike for 5 days instead of driving',
      category: 'conservation',
      difficulty: 'easy',
      targetPoints: 75,
      isActive: true
    },
    {
      title: 'Energy Saver Sprint',
      description: 'Reduce energy consumption by 20% for one month',
      category: 'renewable',
      difficulty: 'medium',
      targetPoints: 110,
      isActive: true
    },
  ],
}

async function seed() {
  try {
    console.log('🌱 Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected')

    // Clear existing data
    console.log('🗑️  Clearing existing data...')
    await Promise.all([
      User.deleteMany({}),
      WasteLog.deleteMany({}),
      Community.deleteMany({}),
      Business.deleteMany({}),
      Challenge.deleteMany({})
    ])
    console.log('✅ Cleared')

    // Create users
    console.log('👥 Creating users...')
    const users = await User.create(seedData.users)
    console.log(`✅ Created ${users.length} users`)

    // Create waste logs
    console.log('♻️  Creating waste logs...')
    const wasteLogs = []
    for (const user of users) {
      for (let i = 0; i < 3; i++) {
        const log = seedData.wasteLogs[i % seedData.wasteLogs.length]
        wasteLogs.push({
          user: user._id,
          category: log.category,
          weight: log.weight + (Math.random() - 0.5),
          ecoScore: log.ecoScore + Math.floor(Math.random() * 10),
          description: log.description,
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        })
      }
    }
    await WasteLog.create(wasteLogs)
    console.log(`✅ Created ${wasteLogs.length} waste logs`)

    // Create communities
    console.log('👥 Creating communities...')
    const communities = await Community.create(
      seedData.communities.map(c => ({
        ...c,
        createdBy: users[0]._id,
        members: [{ user: users[0]._id, joinedAt: new Date() }]
      }))
    )
    console.log(`✅ Created ${communities.length} communities`)

    // Add random members to communities
    for (const community of communities) {
      const randomUsers = users.slice(1, 1 + Math.floor(Math.random() * 5))
      for (const user of randomUsers) {
        community.members.push({ user: user._id, joinedAt: new Date() })
      }
      await community.save()
    }
    console.log('✅ Added members to communities')

    // Create businesses
    console.log('🏢 Creating businesses...')
    const businesses = await Business.create(
      seedData.businesses.map(b => ({
        ...b,
        createdBy: users[0]._id
      }))
    )
    console.log(`✅ Created ${businesses.length} businesses`)

    // Add reviews to businesses
    for (const business of businesses) {
      for (let i = 0; i < 2; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)]
        business.reviews.push({
          user: randomUser._id,
          rating: 3 + Math.floor(Math.random() * 3),
          comment: 'Great place! Highly recommend.',
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        })
      }
    }
    for (const business of businesses) {
      await business.save()
    }
    console.log('✅ Added reviews to businesses')

    // Create challenges
    console.log('🏆 Creating challenges...')
    const challenges = await Challenge.create(
      seedData.challenges.map(c => ({
        ...c,
        createdBy: users[0]._id
      }))
    )
    console.log(`✅ Created ${challenges.length} challenges`)

    // Add participants to challenges
    for (const challenge of challenges) {
      const randomUsers = users.slice(0, Math.floor(Math.random() * 5) + 2)
      for (const user of randomUsers) {
        challenge.participants.push({
          user: user._id,
          status: Math.random() > 0.3 ? 'in-progress' : 'completed',
          joinedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
          completedAt: Math.random() > 0.3 ? new Date() : null
        })
      }
      await challenge.save()
    }
    console.log('✅ Added participants to challenges')

    console.log('\n🌟 Seeding complete!')
    console.log(`
📊 Database Summary:
   Users: ${users.length}
   Waste Logs: ${wasteLogs.length}
   Communities: ${communities.length}
   Businesses: ${businesses.length}
   Challenges: ${challenges.length}

🚀 Ready for testing!
Login with any of these credentials:
   - eco_warrior_1 / password123
   - green_goddess / password123
   - recycle_king / password123
`)

    process.exit(0)
  } catch (error) {
    console.error('❌ Seeding failed:', error.message)
    process.exit(1)
  }
}

seed()
