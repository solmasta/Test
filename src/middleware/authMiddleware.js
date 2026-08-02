const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { errors } = require('../utils/errorHandler');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return next(errors.unauthorized('User not found'));
      }

      return next();
    } catch (error) {
      return next(error);
    }
  }

  return next(errors.notAuthenticated());
};

module.exports = { protect };