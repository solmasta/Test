const express = require('express');
const {
  createCommunity,
  getAllCommunities,
  getCommunityById,
  joinCommunity,
  leaveCommunity,
} = require('../controllers/communityController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, createCommunity)
  .get(getAllCommunities);

router.route('/:id')
  .get(getCommunityById);

router.route('/:id/join')
  .post(protect, joinCommunity);

router.route('/:id/leave')
  .delete(protect, leaveCommunity);

module.exports = router;