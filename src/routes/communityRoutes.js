const express = require('express');
const {
  createCommunity,
  getAllCommunities,
  getCommunityById,
  joinCommunity,
  leaveCommunity,
} = require('../controllers/communityController');
const { protect } = require('../middleware/authMiddleware');
const {
  validateCreateCommunity,
  validateMongoId
} = require('../middleware/validators');

const router = express.Router();

router.route('/')
  .post(protect, validateCreateCommunity, createCommunity)
  .get(getAllCommunities);

router.route('/:id')
  .get(validateMongoId, getCommunityById);

router.route('/:id/join')
  .post(protect, validateMongoId, joinCommunity);

router.route('/:id/leave')
  .delete(protect, validateMongoId, leaveCommunity);

module.exports = router;