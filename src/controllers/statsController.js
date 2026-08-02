const mongoose = require('mongoose');
const User = require('../models/User');
const WasteLog = require('../models/WasteLog');
const Challenge = require('../models/Challenge');
const asyncHandler = require('../utils/asyncHandler');
const { errors } = require('../utils/errorHandler');
const { getPaginationParams, paginatedResponse } = require('../utils/pagination');

const getEcoLeaderboard = asyncHandler(async (req, res, next) => {
  const { page, limit, skip } = getPaginationParams(req, 10);

  const [users, total] = await Promise.all([
    User.find()
      .select('_id username profile ecoScore createdAt')
      .sort({ ecoScore: -1 })
      .skip(skip)
      .limit(limit),
    User.countDocuments({})
  ]);

  const leaderboard = users.map((user, index) => ({
    rank: skip + index + 1,
    ...user.toObject()
  }));

  res.json(paginatedResponse(leaderboard, page, limit, total));
});

const getUserStats = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(id).select('_id username profile ecoScore createdAt');
  if (!user) {
    return next(errors.notFound('User'));
  }

  const userId = mongoose.Types.ObjectId(id);

  const [wasteLogCount, totalWaste, challengesCompleted] = await Promise.all([
    WasteLog.countDocuments({ user: id }),
    WasteLog.aggregate([
      { $match: { user: userId } },
      { $group: { _id: null, total: { $sum: '$ecoScoreImpact' } } }
    ]),
    Challenge.countDocuments({
      'participants': {
        $elemMatch: { user: id, completed: true }
      }
    })
  ]);

  const stats = {
    user: user.toObject(),
    stats: {
      wasteLogsCreated: wasteLogCount,
      totalEcoScoreEarned: totalWaste[0]?.total || 0,
      challengesCompleted,
      currentRank: await User.countDocuments({ ecoScore: { $gt: user.ecoScore } }) + 1
    }
  };

  res.json(stats);
});

const getChallengeStats = asyncHandler(async (req, res, next) => {
  const stats = await Challenge.aggregate([
    {
      $group: {
        _id: null,
        totalChallenges: { $sum: 1 },
        activeChallenges: {
          $sum: { $cond: ['$isActive', 1, 0] }
        },
        totalParticipants: {
          $sum: { $size: '$participants' }
        },
        completedCount: {
          $sum: {
            $size: {
              $filter: {
                input: '$participants',
                as: 'participant',
                cond: '$$participant.completed'
              }
            }
          }
        }
      }
    }
  ]);

  const data = stats[0] || {
    totalChallenges: 0,
    activeChallenges: 0,
    totalParticipants: 0,
    completedCount: 0
  };

  data.completionRate = data.totalParticipants > 0
    ? ((data.completedCount / data.totalParticipants) * 100).toFixed(2) + '%'
    : '0%';

  res.json(data);
});

const getWasteStats = asyncHandler(async (req, res, next) => {
  const stats = await WasteLog.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
        avgEcoScore: { $avg: '$ecoScoreImpact' }
      }
    },
    { $sort: { count: -1 } }
  ]);

  const total = await WasteLog.countDocuments({});

  res.json({
    totalLogs: total,
    byCategory: stats
  });
});

module.exports = {
  getEcoLeaderboard,
  getUserStats,
  getChallengeStats,
  getWasteStats
};
