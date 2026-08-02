const express = require('express');
const {
  createWasteLog,
  getUserWasteLogs,
  getWasteLogById,
  updateWasteLog,
  deleteWasteLog,
} = require('../controllers/wasteLogController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, createWasteLog)
  .get(protect, getUserWasteLogs);

router.route('/:id')
  .get(protect, getWasteLogById)
  .put(protect, updateWasteLog)
  .delete(protect, deleteWasteLog);

module.exports = router;