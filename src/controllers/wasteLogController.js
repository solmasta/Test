const WasteLog = require('../models/WasteLog');
const User = require('../models/User');

// Create a new waste log entry
const createWasteLog = async (req, res) => {
  try {
    const { category, amount, unit, description } = req.body;

    // Create waste log
    const wasteLog = await WasteLog.create({
      user: req.user._id,
      category,
      amount,
      unit,
      description,
    });

    // Add to user's waste log
    const user = await User.findById(req.user._id);
    user.wasteLog.push(wasteLog._id);
    
    // Calculate eco score impact (simplified)
    const ecoScoreImpact = Math.floor(amount * (unit === 'grams' ? 0.1 : 1));
    wasteLog.ecoScoreImpact = ecoScoreImpact;
    user.ecoScore += ecoScoreImpact;
    
    await user.save();
    await wasteLog.save();

    res.status(201).json(wasteLog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all waste logs for a user
const getUserWasteLogs = async (req, res) => {
  try {
    const wasteLogs = await WasteLog.find({ user: req.user._id })
      .sort({ date: -1 });

    res.json(wasteLogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific waste log entry
const getWasteLogById = async (req, res) => {
  try {
    const wasteLog = await WasteLog.findById(req.params.id);

    if (wasteLog) {
      // Check if user owns this waste log
      if (wasteLog.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      res.json(wasteLog);
    } else {
      res.status(404).json({ message: 'Waste log not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a waste log entry
const updateWasteLog = async (req, res) => {
  try {
    const wasteLog = await WasteLog.findById(req.params.id);

    if (wasteLog) {
      // Check if user owns this waste log
      if (wasteLog.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      const { category, amount, unit, description } = req.body;

      // Store previous eco score impact
      const previousEcoScoreImpact = wasteLog.ecoScoreImpact;

      // Update waste log
      wasteLog.category = category || wasteLog.category;
      wasteLog.amount = amount || wasteLog.amount;
      wasteLog.unit = unit || wasteLog.unit;
      wasteLog.description = description || wasteLog.description;

      // Recalculate eco score impact
      const newEcoScoreImpact = Math.floor(amount * (unit === 'grams' ? 0.1 : 1));
      wasteLog.ecoScoreImpact = newEcoScoreImpact;

      const updatedWasteLog = await wasteLog.save();

      // Update user's eco score
      const user = await User.findById(req.user._id);
      user.ecoScore = user.ecoScore - previousEcoScoreImpact + newEcoScoreImpact;
      await user.save();

      res.json(updatedWasteLog);
    } else {
      res.status(404).json({ message: 'Waste log not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a waste log entry
const deleteWasteLog = async (req, res) => {
  try {
    const wasteLog = await WasteLog.findById(req.params.id);

    if (wasteLog) {
      // Check if user owns this waste log
      if (wasteLog.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      // Remove eco score impact from user
      const user = await User.findById(req.user._id);
      user.ecoScore -= wasteLog.ecoScoreImpact;
      await user.save();

      await wasteLog.remove();
      res.json({ message: 'Waste log removed' });
    } else {
      res.status(404).json({ message: 'Waste log not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createWasteLog,
  getUserWasteLogs,
  getWasteLogById,
  updateWasteLog,
  deleteWasteLog,
};