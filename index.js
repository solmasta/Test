const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Load environment variables
dotenv.config();

// Create Express server
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Cross-origin resource sharing
app.use(morgan('combined')); // Logging
app.use(express.json()); // Parse JSON bodies

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to EcoCycle API',
    version: '1.0.0',
    description: 'A platform for individuals, communities, and businesses to reduce waste, conserve resources, and promote eco-friendly practices.'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Import route files
const userRoutes = require('./src/routes/userRoutes');
const wasteLogRoutes = require('./src/routes/wasteLogRoutes');
const communityRoutes = require('./src/routes/communityRoutes');
const businessRoutes = require('./src/routes/businessRoutes');
const challengeRoutes = require('./src/routes/challengeRoutes');

// Connect routes
app.use('/api/users', userRoutes);
app.use('/api/waste-logs', wasteLogRoutes);
app.use('/api/communities', communityRoutes);
app.use('/api/businesses', businessRoutes);
app.use('/api/challenges', challengeRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecocycle', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`EcoCycle server running on port ${PORT}`);
});

module.exports = app;