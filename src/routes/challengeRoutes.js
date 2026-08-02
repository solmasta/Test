const express = require('express');
const {
  createChallenge,
  getAllChallenges,
  getChallengeById,
  joinChallenge,
  completeChallenge,
} = require('../controllers/challengeController');
const { protect } = require('../middleware/authMiddleware');
const {
  validateCreateChallenge,
  validateMongoId
} = require('../middleware/validators');

const router = express.Router();

router.route('/')
  .post(protect, validateCreateChallenge, createChallenge)
  .get(getAllChallenges);

router.route('/:id')
  .get(validateMongoId, getChallengeById);

router.route('/:id/join')
  .post(protect, validateMongoId, joinChallenge);

router.route('/:id/complete')
  .put(protect, validateMongoId, completeChallenge);

module.exports = router;