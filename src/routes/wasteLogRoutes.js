const express = require('express');
const {
  createWasteLog,
  getUserWasteLogs,
  getWasteLogById,
  updateWasteLog,
  deleteWasteLog,
} = require('../controllers/wasteLogController');
const { protect } = require('../middleware/authMiddleware');
const {
  validateCreateWasteLog,
  validateUpdateWasteLog,
  validateMongoId
} = require('../middleware/validators');

const router = express.Router();

router.route('/')
  .post(protect, validateCreateWasteLog, createWasteLog)
  .get(protect, getUserWasteLogs);

router.route('/:id')
  .get(protect, validateMongoId, getWasteLogById)
  .put(protect, validateMongoId, validateUpdateWasteLog, updateWasteLog)
  .delete(protect, validateMongoId, deleteWasteLog);

module.exports = router;