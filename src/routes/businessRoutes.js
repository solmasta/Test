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

const router = express.Router();

router.route('/')
  .post(protect, createBusiness)
  .get(getAllBusinesses);

router.route('/:id')
  .get(getBusinessById)
  .put(protect, updateBusiness)
  .delete(protect, deleteBusiness);

router.route('/:id/reviews')
  .post(protect, addBusinessReview);

module.exports = router;