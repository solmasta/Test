const rateLimit = require('express-rate-limit');

const createLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: { success: false, message },
    standardHeaders: false,
    legacyHeaders: false,
    skip: (req) => process.env.NODE_ENV === 'test',
  });
};

// General API limiter: 100 requests per 15 minutes
const apiLimiter = createLimiter(
  15 * 60 * 1000,
  100,
  'Too many requests from this IP, please try again later'
);

// Strict limiter for auth endpoints: 5 requests per 15 minutes
const authLimiter = createLimiter(
  15 * 60 * 1000,
  5,
  'Too many authentication attempts, please try again later'
);

// Account creation limiter: 3 requests per hour per IP
const createAccountLimiter = createLimiter(
  60 * 60 * 1000,
  3,
  'Too many accounts created from this IP, please try again later'
);

// Review limiter: 10 reviews per hour per user
const reviewLimiter = createLimiter(
  60 * 60 * 1000,
  10,
  'Too many reviews submitted, please try again later'
);

module.exports = {
  apiLimiter,
  authLimiter,
  createAccountLimiter,
  reviewLimiter,
};
