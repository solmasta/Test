const validateEnv = () => {
  const required = ['JWT_SECRET', 'JWT_EXPIRES_IN'];
  const missing = [];

  required.forEach((key) => {
    if (!process.env[key]) {
      missing.push(key);
    }
  });

  if (missing.length > 0) {
    console.error(
      `❌ Missing required environment variables: ${missing.join(', ')}`
    );
    console.error('Please set these in your .env file and try again.');
    process.exit(1);
  }

  // Log loaded environment
  console.log('✓ Environment variables loaded:');
  console.log(`  - NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
  console.log(`  - PORT: ${process.env.PORT || 3000}`);
  console.log(`  - MONGODB_URI: ${process.env.MONGODB_URI ? '✓ configured' : '✗ using default'}`);
  console.log(`  - JWT_SECRET: ✓ configured`);
};

module.exports = validateEnv;
