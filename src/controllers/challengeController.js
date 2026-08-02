const Challenge = require('../models/Challenge');
const asyncHandler = require('../utils/asyncHandler');
const { errors } = require('../utils/errorHandler');

const createChallenge = asyncHandler(async (req, res, next) => {
  const {
    title,
    description,
    category,
    difficulty,
    points,
    duration
  } = req.body;

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
});

const getAllChallenges = asyncHandler(async (req, res, next) => {
  const challenges = await Challenge.find({ isActive: true })
    .populate('createdBy', 'username');

  res.json(challenges);
});

const getChallengeById = asyncHandler(async (req, res, next) => {
  const challenge = await Challenge.findById(req.params.id)
    .populate('createdBy', 'username')
    .populate('participants.user', 'username');

  if (!challenge) {
    return next(errors.notFound('Challenge'));
  }

  res.json(challenge);
});

const joinChallenge = asyncHandler(async (req, res, next) => {
  const challenge = await Challenge.findById(req.params.id);

  if (!challenge) {
    return next(errors.notFound('Challenge'));
  }

  const isParticipant = challenge.participants.some(
    participant => participant.user.toString() === req.user._id.toString()
  );

  if (isParticipant) {
    return next(errors.conflict('You are already a participant in this challenge'));
  }

  challenge.participants.push({
    user: req.user._id
  });

  const updatedChallenge = await challenge.save();
  res.json(updatedChallenge);
});

const completeChallenge = asyncHandler(async (req, res, next) => {
  const challenge = await Challenge.findById(req.params.id);

  if (!challenge) {
    return next(errors.notFound('Challenge'));
  }

  const participant = challenge.participants.find(
    p => p.user.toString() === req.user._id.toString()
  );

  if (!participant) {
    return next(errors.conflict('You are not a participant in this challenge'));
  }

  if (participant.completed) {
    return next(errors.conflict('You have already completed this challenge'));
  }

  participant.completed = true;
  participant.completedAt = Date.now();

  const updatedChallenge = await challenge.save();
  res.json(updatedChallenge);
});

module.exports = {
  createChallenge,
  getAllChallenges,
  getChallengeById,
  joinChallenge,
  completeChallenge,
};