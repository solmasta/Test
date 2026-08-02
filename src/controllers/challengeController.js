const Challenge = require('../models/Challenge');

// Create a new challenge
const createChallenge = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      difficulty,
      points,
      duration
    } = req.body;

    // Create challenge
    const challenge = await Challenge.create({
      title,
      description,
      category,
      difficulty,
      points,
      duration,
      createdBy: req.user._id
    });

    res.status(201).json(challenge);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all challenges
const getAllChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find({ isActive: true })
      .populate('createdBy', 'username');

    res.json(challenges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific challenge
const getChallengeById = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id)
      .populate('createdBy', 'username')
      .populate('participants.user', 'username');

    if (challenge) {
      res.json(challenge);
    } else {
      res.status(404).json({ message: 'Challenge not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Join a challenge
const joinChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (challenge) {
      // Check if user is already a participant
      const isParticipant = challenge.participants.some(
        participant => participant.user.toString() === req.user._id.toString()
      );

      if (isParticipant) {
        return res.status(400).json({ message: 'Already a participant' });
      }

      // Add user to challenge
      challenge.participants.push({
        user: req.user._id
      });

      const updatedChallenge = await challenge.save();
      res.json(updatedChallenge);
    } else {
      res.status(404).json({ message: 'Challenge not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Complete a challenge
const completeChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (challenge) {
      // Find participant
      const participant = challenge.participants.find(
        p => p.user.toString() === req.user._id.toString()
      );

      if (!participant) {
        return res.status(400).json({ message: 'Not a participant' });
      }

      if (participant.completed) {
        return res.status(400).json({ message: 'Challenge already completed' });
      }

      // Mark as completed
      participant.completed = true;
      participant.completedAt = Date.now();

      const updatedChallenge = await challenge.save();
      res.json(updatedChallenge);
    } else {
      res.status(404).json({ message: 'Challenge not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createChallenge,
  getAllChallenges,
  getChallengeById,
  joinChallenge,
  completeChallenge,
};