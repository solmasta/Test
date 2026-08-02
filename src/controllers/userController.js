const User = require('../models/User');
const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const { errors } = require('../utils/errorHandler');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const registerUser = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;

  const userExists = await User.findOne({ $or: [{ email }, { username }] });
  if (userExists) {
    return next(errors.alreadyExists('User'));
  }

  const user = await User.create({ username, email, password });

  res.status(201).json({
    _id: user._id,
    username: user.username,
    email: user.email,
    ecoScore: user.ecoScore,
    token: generateToken(user._id),
  });
});

const authUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    return next(errors.invalidCredentials());
  }

  res.json({
    _id: user._id,
    username: user.username,
    email: user.email,
    ecoScore: user.ecoScore,
    token: generateToken(user._id),
  });
});

const getUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id)
    .populate('wasteLog')
    .populate('communityMemberships');

  if (!user) {
    return next(errors.notFound('User'));
  }

  res.json({
    _id: user._id,
    username: user.username,
    email: user.email,
    profile: user.profile,
    ecoScore: user.ecoScore,
    wasteLog: user.wasteLog,
    communityMemberships: user.communityMemberships,
  });
});

const updateUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return next(errors.notFound('User'));
  }

  user.profile = { ...user.profile, ...req.body.profile };
  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    username: updatedUser.username,
    email: updatedUser.email,
    profile: updatedUser.profile,
    ecoScore: updatedUser.ecoScore,
  });
});

module.exports = {
  registerUser,
  authUser,
  getUserProfile,
  updateUserProfile,
};