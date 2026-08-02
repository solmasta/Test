class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Common error factory functions
const errors = {
  notFound: (resource) =>
    new AppError(`${resource} not found`, 404),

  unauthorized: (message = 'Not authorized to access this resource') =>
    new AppError(message, 401),

  forbidden: (message = 'Forbidden') =>
    new AppError(message, 403),

  conflict: (message) =>
    new AppError(message, 409),

  badRequest: (message) =>
    new AppError(message, 400),

  serverError: (message = 'Internal server error') =>
    new AppError(message, 500),

  validationError: (field, message) =>
    new AppError(`${field}: ${message}`, 400),

  alreadyExists: (resource) =>
    new AppError(`${resource} already exists`, 409),

  invalidCredentials: () =>
    new AppError('Invalid email or password', 401),

  notAuthenticated: () =>
    new AppError('Please authenticate to access this resource', 401),

  invalidToken: () =>
    new AppError('Invalid or expired token', 401),
};

module.exports = {
  AppError,
  errors
};
