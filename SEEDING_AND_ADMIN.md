# EcoCycle Database Seeding & Admin Dashboard Guide

Complete guide to seeding demo data and using the admin dashboard.

---

## Database Seeding

### Overview

The seed script pre-populates your database with realistic demo data:
- 10 user accounts
- 30 waste logs
- 5 communities with members
- 5 businesses with reviews
- 5 challenges with participants

Perfect for:
- Testing and development
- Demos and sales
- Performance testing
- Learning the system

---

## Running the Seeder

### Prerequisites
- Backend running or connected to MongoDB
- Environment variables configured (.env file)

### Quick Start

```bash
# Run the seeder
npm run seed
```

Output:
```
🌱 Connecting to MongoDB...
✅ Connected
🗑️  Clearing existing data...
✅ Cleared
👥 Creating users...
✅ Created 10 users
♻️  Creating waste logs...
✅ Created 30 waste logs
...
🌟 Seeding complete!
📊 Database Summary:
   Users: 10
   Waste Logs: 30
   Communities: 5
   Businesses: 5
   Challenges: 5
```

---

## Seeded Data

### Test Users

All created with password: `password123`

```
1. eco_warrior_1        (eco score: 850)
2. green_goddess        (eco score: 920)
3. waste_warrior        (eco score: 780)
4. recycle_king         (eco score: 1050)
5. earth_lover          (eco score: 650)
6. nature_ninja         (eco score: 890)
7. planet_guardian      (eco score: 760)
8. trash_master         (eco score: 620)
9. sustainability_star  (eco score: 1100)
10. carbon_cutter       (eco score: 700)
```

**Login with any of these credentials**

### Communities

1. **Urban Composters** (New York, NY)
   - Members: 3-5 random users
   - Focus: Composting initiative

2. **Zero Waste Warriors** (San Francisco, CA)
   - Members: 3-5 random users
   - Focus: Zero-waste lifestyle

3. **Plastic-Free Paradise** (Portland, OR)
   - Members: 3-5 random users
   - Focus: Plastic reduction

4. **Recycling Revolution** (Seattle, WA)
   - Members: 3-5 random users
   - Focus: Effective recycling

5. **Green City Initiative** (Boulder, CO)
   - Members: 3-5 random users
   - Focus: City sustainability

### Challenges

1. **Plastic-Free Week** (Medium)
   - Target: 100 points
   - Participants: 2-5 users
   - Status: Active

2. **Compost Challenge** (Hard)
   - Target: 150 points
   - Participants: 2-5 users
   - Status: Active

3. **Zero Waste Shopping** (Hard)
   - Target: 120 points
   - Participants: 2-5 users
   - Status: Active

4. **Bike to Work Week** (Easy)
   - Target: 75 points
   - Participants: 2-5 users
   - Status: Active

5. **Energy Saver Sprint** (Medium)
   - Target: 110 points
   - Participants: 2-5 users
   - Status: Active

### Businesses

1. **EcoShop Market** (San Francisco)
   - Category: Retail
   - Rating: 4.8/5 (124 reviews)

2. **Green Cycle Repair** (Portland)
   - Category: Service
   - Rating: 4.6/5 (89 reviews)

3. **Organic Harvest Farm** (Boulder)
   - Category: Food
   - Rating: 4.9/5 (234 reviews)

4. **Renewable Energy Solutions** (Seattle)
   - Category: Energy
   - Rating: 4.7/5 (145 reviews)

5. **Waste Not Cafe** (New York)
   - Category: Food
   - Rating: 4.5/5 (67 reviews)

---

## Customizing Seeds

### Edit Seed Data

Open `scripts/seed.js` and modify:

```javascript
const seedData = {
  users: [
    { username: 'your_user', email: 'you@example.com', password: 'password123', ecoScore: 800 },
    // ... more users
  ],
  communities: [
    {
      name: 'Your Community',
      description: 'Your description',
      location: 'Your City'
    },
    // ... more communities
  ]
}
```

### Add More Seed Data

```javascript
// In the waste logs section
for (const user of users) {
  for (let i = 0; i < 5; i++) {  // Change 3 to 5 for more logs
    // Creates 5 logs per user
  }
}
```

### Custom Seeder

Create a new seed file:

```bash
touch scripts/seed-custom.js
```

Copy structure from `seed.js` and modify for your needs.

---

## Seeding Strategy

### Before Demos
```bash
npm run seed
# Database now has impressive data to show
```

### Before Testing
```bash
npm run seed
npm run test
npm run e2e
# Tests run against clean, consistent data
```

### Local Development
```bash
npm run seed
npm run dev
# Start developing with realistic data already present
```

---

## Admin Dashboard

### Overview

The admin dashboard provides tools for:
- Monitoring platform metrics
- Managing challenges
- Viewing top users
- Monitoring communities
- Content moderation

### Accessing Admin Panel

1. **Log in** as any user
2. **URL**: `http://localhost:5173/admin`
3. **Note**: Currently, all logged-in users can access admin (update routes for real security)

### Admin Features

#### 📊 Overview Tab

Shows system-wide statistics:
- Total challenges
- Active challenges
- Total participants
- Completion rate
- Waste statistics by category

#### 👥 Users Tab

Top users leaderboard with:
- User ranking
- Username
- Eco score
- Waste logs created
- Communities joined
- Challenges completed

### Sortable metrics for identifying:
- Most active users
- Top eco-warriors
- Highly engaged community members

#### 🏆 Challenges Tab

Manage all challenges:
- View challenge details
- See participant count
- Enable/disable challenges
- Track completion metrics

**Actions**:
- Toggle active status
- View participants
- Monitor progress

#### 🏘️ Communities Tab

Browse all communities:
- Community name and description
- Location
- Member count
- Creation date
- Community statistics

**Useful for**:
- Identifying popular communities
- Community growth tracking
- Location-based analysis

#### ⚠️ Moderation Tab

Content moderation tools:
- Flagged content review
- User reports
- System health status
- API performance metrics
- Database status

---

## Security Considerations

### Current Implementation
- Admin dashboard accessible to all authenticated users
- Read-only for most operations
- Challenge activation toggle available

### Production Recommendations

Add admin role check:

```javascript
// In frontend/src/pages/Admin.jsx
function Admin() {
  const { user } = useAuth()

  // Check if user is admin
  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" />
  }

  // ... rest of admin component
}
```

Add backend authorization:

```javascript
// In backend routes
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' })
  }
  next()
}

app.delete('/api/users/:id', isAdmin, userController.deleteUser)
```

---

## Admin Workflows

### Scenario 1: Monitor New User Signups

1. Open Admin Dashboard
2. Click **Users** tab
3. Check newest users in leaderboard
4. Review activity levels

### Scenario 2: Promote Popular Challenge

1. Click **Challenges** tab
2. Sort by participants
3. Promote challenge via social
4. Monitor participation growth

### Scenario 3: Community Growth Analysis

1. Click **Communities** tab
2. Identify fast-growing communities
3. Feature in newsletters
4. Support organic growth

### Scenario 4: Moderation Alert

1. Click **Moderation** tab
2. Review flagged content
3. Take appropriate action
4. Document decisions

---

## Extending Admin Dashboard

### Add New Metrics

```javascript
// In Admin.jsx, add to overview
<div className="card">
  <div className="text-sm text-gray-600">New Metric</div>
  <div className="text-4xl font-bold text-blue-600 mt-2">
    {stats?.metric || 0}
  </div>
</div>
```

### Add New Tab

```javascript
{[
  { id: 'overview', label: '📊 Overview' },
  // ... other tabs
  { id: 'your_tab', label: '🎯 Your Tab' },
].map(tab => ...)}

{activeTab === 'your_tab' && (
  <div>Your tab content</div>
)}
```

### Add Admin Actions

```javascript
const handleAdminAction = async (id, action) => {
  try {
    // Make API call
    await adminAPI.performAction(id, action)
    fetchData()
  } catch (err) {
    setError('Action failed')
  }
}
```

---

## Performance Tips

### Pagination
Admin dashboard loads first 50 items:
```javascript
const leaderboard = await statsAPI.getLeaderboard(1, 50)
```

### Caching
Update data only when switching tabs:
```javascript
useEffect(() => {
  fetchData()
}, [activeTab])
```

### Lazy Loading
Consider loading heavy data on demand:
```javascript
const [detailedStats, setDetailedStats] = useState(null)

const loadDetailed = async () => {
  if (!detailedStats) {
    // Fetch detailed data
  }
}
```

---

## Troubleshooting

### Admin Dashboard Not Loading

**Problem**: Page shows loading indefinitely
**Solution**:
1. Check backend is running: `curl http://localhost:3000/health`
2. Check API URL in frontend: `.env` file
3. Check browser console for errors

### Data Not Showing

**Problem**: Admin panels empty
**Solution**:
1. Run seeder: `npm run seed`
2. Verify data in database: `mongosh`
3. Check API response: Open DevTools Network tab

### Admin Routes Not Working

**Problem**: 404 on `/admin` page
**Solution**:
1. Ensure Admin.jsx imported in App.jsx
2. Check route added correctly
3. Clear browser cache and reload

### Seeder Errors

**Problem**: Seed script fails
**Solution**:
```bash
# Check MongoDB connection
mongosh

# Check environment variables
cat .env

# Run with verbose output
DEBUG=* npm run seed
```

---

## API Endpoints Used

Admin dashboard uses these endpoints:

- `GET /api/stats/leaderboard` - User rankings
- `GET /api/stats/challenges` - Challenge statistics
- `GET /api/stats/waste` - Waste statistics
- `GET /api/challenges` - All challenges
- `GET /api/communities` - All communities
- `PUT /api/challenges/:id` - Update challenge status

---

## Example Admin Workflows

### Weekly Review
1. Open Admin Dashboard → Overview
2. Check metrics: users, waste, engagement
3. Review Communities tab for growth
4. Check Moderation for issues
5. Document findings

### New Feature Rollout
1. Create challenge/feature
2. View in Challenges tab
3. Monitor participation
4. Track metrics
5. Adjust based on engagement

### User Support
1. Click Users tab
2. Find user
3. View their stats
4. Identify issues
5. Provide targeted support

---

## Next Steps

### Short Term
- Restrict admin access to admin role users
- Add delete/edit functionality
- Add user ban/suspension features
- Add content removal tools

### Medium Term
- Add analytics dashboard
- Implement reporting features
- Add email notification system
- Create admin audit logs

### Long Term
- Add user permission system
- Build admin activity timeline
- Implement bulk operations
- Add data export tools

---

## Support

For issues with seeding or admin dashboard:

1. Check this guide's troubleshooting section
2. Review E2E_TESTING.md for related issues
3. Check backend logs: `npm run dev`
4. Check browser console for errors
5. Report issues on GitHub

---

**Status**: Seeding and Admin Dashboard ready for use ✅

Quick start:
```bash
npm run seed    # Create demo data
npm start       # Start backend
cd frontend && npm run dev  # Start frontend
# Visit http://localhost:5173/admin
```
