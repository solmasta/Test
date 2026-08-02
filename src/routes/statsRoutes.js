const express = require('express');
const {
  getEcoLeaderboard,
  getUserStats,
  getChallengeStats,
  getWasteStats
} = require('../controllers/statsController');
const { validateMongoId } = require('../middleware/validators');

const router = express.Router();

/**
 * @swagger
 * /stats/leaderboard:
 *   get:
 *     summary: Get eco score leaderboard
 *     tags: [Stats]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Leaderboard with rankings
 */
router.get('/leaderboard', getEcoLeaderboard);

/**
 * @swagger
 * /stats/users/{id}:
 *   get:
 *     summary: Get user statistics
 *     tags: [Stats]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User stats and ranking
 *       404:
 *         description: User not found
 */
router.get('/users/:id', validateMongoId, getUserStats);

/**
 * @swagger
 * /stats/challenges:
 *   get:
 *     summary: Get challenge statistics
 *     tags: [Stats]
 *     responses:
 *       200:
 *         description: Challenge stats and completion rates
 */
router.get('/challenges', getChallengeStats);

/**
 * @swagger
 * /stats/waste:
 *   get:
 *     summary: Get waste log statistics
 *     tags: [Stats]
 *     responses:
 *       200:
 *         description: Waste stats by category
 */
router.get('/waste', getWasteStats);

module.exports = router;
