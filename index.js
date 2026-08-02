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

// Start server
app.listen(PORT, () => {
  console.log(`EcoCycle server running on port ${PORT}`);
});

module.exports = app;