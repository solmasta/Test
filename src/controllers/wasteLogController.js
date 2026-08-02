const WasteLog = require('../models/WasteLog');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { errors } = require('../utils/errorHandler');
const { getPaginationParams, paginatedResponse } = require('../utils/pagination');

const createWasteLog = asyncHandler(async (req, res, next) => {
  const { category, amount, unit, description } = req.body;

  const wasteLog = await WasteLog.create({
    user: req.user._id,
    category,
    amount,
    unit,
    description,
  });

  const user = await User.findById(req.user._id);
  user.wasteLog.push(wasteLog._id);

  const ecoScoreImpact = Math.floor(amount * (unit === 'grams' ? 0.1 : 1));
  wasteLog.ecoScoreImpact = ecoScoreImpact;
  user.ecoScore += ecoScoreImpact;

  await user.save();
  await wasteLog.save();

  res.status(201).json(wasteLog);
});

const getUserWasteLogs = asyncHandler(async (req, res, next) => {
  const { page, limit, skip } = getPaginationParams(req);

  const [wasteLogs, total] = await Promise.all([
    WasteLog.find({ user: req.user._id })
      .skip(skip)
      .limit(limit)
      .sort({ date: -1 }),
    WasteLog.countDocuments({ user: req.user._id })
  ]);

  res.json(paginatedResponse(wasteLogs, page, limit, total));
});

const getWasteLogById = asyncHandler(async (req, res, next) => {
  const wasteLog = await WasteLog.findById(req.params.id);

  if (!wasteLog) {
    return next(errors.notFound('Waste log'));
  }

  if (wasteLog.user.toString() !== req.user._id.toString()) {
    return next(errors.unauthorized('You can only view your own waste logs'));
  }

  res.json(wasteLog);
});

const updateWasteLog = asyncHandler(async (req, res, next) => {
  const wasteLog = await WasteLog.findById(req.params.id);

  if (!wasteLog) {
    return next(errors.notFound('Waste log'));
  }

  if (wasteLog.user.toString() !== req.user._id.toString()) {
    return next(errors.unauthorized('You can only update your own waste logs'));
  }

  const { category, amount, unit, description } = req.body;
  const previousEcoScoreImpact = wasteLog.ecoScoreImpact;

  wasteLog.category = category || wasteLog.category;
  wasteLog.amount = amount || wasteLog.amount;
  wasteLog.unit = unit || wasteLog.unit;
  wasteLog.description = description || wasteLog.description;

  const newEcoScoreImpact = Math.floor(
    wasteLog.amount * (wasteLog.unit === 'grams' ? 0.1 : 1)
  );
  wasteLog.ecoScoreImpact = newEcoScoreImpact;

  const updatedWasteLog = await wasteLog.save();

  const user = await User.findById(req.user._id);
  user.ecoScore = user.ecoScore - previousEcoScoreImpact + newEcoScoreImpact;
  await user.save();

  res.json(updatedWasteLog);
});

const deleteWasteLog = asyncHandler(async (req, res, next) => {
  const wasteLog = await WasteLog.findById(req.params.id);

  if (!wasteLog) {
    return next(errors.notFound('Waste log'));
  }

  if (wasteLog.user.toString() !== req.user._id.toString()) {
    return next(errors.unauthorized('You can only delete your own waste logs'));
  }

  const user = await User.findById(req.user._id);
  user.ecoScore -= wasteLog.ecoScoreImpact;
  await user.save();

  await wasteLog.deleteOne();
  res.json({ message: 'Waste log removed successfully' });
});

module.exports = {
  createWasteLog,
  getUserWasteLogs,
  getWasteLogById,
  updateWasteLog,
  deleteWasteLog,
};