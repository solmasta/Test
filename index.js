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

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    status: 404,
    message: 'Endpoint not found'
  });
});

// Global error handler (must be last)
const errorHandler = require('./src/middleware/errorHandler');
app.use(errorHandler);

// Connect to MongoDB (skip in test environment)
if (process.env.NODE_ENV !== 'test') {
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
}

// Start server
app.listen(PORT, () => {
  console.log(`EcoCycle server running on port ${PORT}`);
});

module.exports = app;