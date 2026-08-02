const express = require('express');
const {
  createChallenge,
  getAllChallenges,
  getChallengeById,
  joinChallenge,
  completeChallenge,
} = require('../controllers/challengeController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, createChallenge)
  .get(getAllChallenges);

router.route('/:id')
  .get(getChallengeById);

router.route('/:id/join')
  .post(protect, joinChallenge);

router.route('/:id/complete')
  .put(protect, completeChallenge);

module.exports = router;