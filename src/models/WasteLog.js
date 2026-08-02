const mongoose = require('mongoose');

const wasteLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['food', 'plastic', 'paper', 'glass', 'metal', 'electronic', 'other']
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    required: true,
    enum: ['grams', 'kilograms', 'pieces', 'liters']
  },
  description: {
    type: String,
    maxlength: 500
  },
  date: {
    type: Date,
    default: Date.now
  },
  ecoScoreImpact: {
    type: Number,
    default: 0
  },
  reductionTips: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
wasteLogSchema.pre('save', function(next) {
  if (!this.isNew) {
    this.updatedAt = new Date();
  }
  next();
});

// Update timestamp on findOneAndUpdate
wasteLogSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: new Date() });
  next();
});

module.exports = mongoose.model('WasteLog', wasteLogSchema);