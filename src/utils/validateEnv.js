const validateEnv = () => {
  // Set defaults for missing variables
  if (!process.env.JWT_SECRET) {
    // In production, JWT_SECRET must be set
    if (process.env.NODE_ENV === 'production') {
      console.error(
        '❌ Missing required JWT_SECRET environment variable'
      );
      console.error('Please set JWT_SECRET in Railway variables and redeploy.');
      process.exit(1);
    }
    // In development, use a default
    process.env.JWT_SECRET = 'dev-secret-key-change-in-production-12345678';
    console.warn('⚠️  Using default JWT_SECRET (development only)');
  }

  if (!process.env.JWT_EXPIRES_IN) {
    process.env.JWT_EXPIRES_IN = '7d';
  }

  if (!process.env.PORT) {
    process.env.PORT = 3000;
  }

  if (!process.env.MONGODB_URI) {
    process.env.MONGODB_URI = 'mongodb://localhost:27017/ecocycle';
  }

  // Log loaded environment
  console.log('✓ Environment variables configured:');
  console.log(`  - NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
  console.log(`  - PORT: ${process.env.PORT}`);
  console.log(`  - MONGODB_URI: ${process.env.MONGODB_URI ? '✓ configured' : '✗ using default'}`);
  console.log(`  - JWT_SECRET: ${process.env.JWT_SECRET.substring(0, 10)}... ✓`);
};

module.exports = validateEnv;
