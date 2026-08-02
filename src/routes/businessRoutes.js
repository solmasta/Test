const express = require('express');
const {
  createBusiness,
  getAllBusinesses,
  getBusinessById,
  updateBusiness,
  deleteBusiness,
  addBusinessReview,
} = require('../controllers/businessController');
const { protect } = require('../middleware/authMiddleware');
const {
  validateCreateBusiness,
  validateBusinessReview,
  validateMongoId
} = require('../middleware/validators');

const router = express.Router();

router.route('/')
  .post(protect, validateCreateBusiness, createBusiness)
  .get(getAllBusinesses);

router.route('/:id')
  .get(validateMongoId, getBusinessById)
  .put(protect, validateMongoId, validateCreateBusiness, updateBusiness)
  .delete(protect, validateMongoId, deleteBusiness);

router.route('/:id/reviews')
  .post(protect, validateMongoId, validateBusinessReview, addBusinessReview);

module.exports = router;