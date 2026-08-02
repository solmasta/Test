const express = require('express');
const {
  registerUser,
  authUser,
  getUserProfile,
  updateUserProfile,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const {
  validateRegister,
  validateLogin,
  validateUpdateProfile
} = require('../middleware/validators');

const router = express.Router();

router.route('/').post(validateRegister, registerUser);
router.route('/login').post(validateLogin, authUser);
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, validateUpdateProfile, updateUserProfile);

module.exports = router;