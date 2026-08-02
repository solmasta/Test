# EcoCycle Testing Guide

## Overview

The EcoCycle API includes comprehensive integration tests covering all major features and endpoints.

## Test Coverage

- **User Tests** (`tests/user.test.js`): Registration, login, profile management, authentication
- **Waste Log Tests** (`tests/wasteLog.test.js`): CRUD operations, eco score calculations, validation
- **Community Tests** (`tests/community.test.js`): Community creation, joining, leaving
- **Business Tests** (`tests/business.test.js`): Business listing, reviews, ratings
- **Challenge Tests** (`tests/challenge.test.js`): Challenge creation, participation, completion

## Prerequisites

### Required
- Node.js 14+ and npm
- MongoDB running locally on `localhost:27017`

### Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Create Test Environment File**
   ```bash
   # .env.test is already provided with test defaults
   # Ensure MongoDB is running:
   mongod
   ```

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Generate Coverage Report
```bash
npm run test:coverage
```

## Test Database

Tests use a separate test database: `ecocycle-test`

**Important**: The test database is automatically cleared after each test suite to ensure test isolation and avoid data conflicts.

## Key Testing Patterns

### Authentication
All protected endpoints require a valid JWT token:
```javascript
const res = await request(app)
  .post('/api/waste-logs')
  .set('Authorization', `Bearer ${token}`)
  .send(data);
```

### Error Validation
Tests verify both success and error cases:
- Valid input → 201/200 status
- Invalid format → 400 status with error messages
- Missing auth → 401 status
- Not found → 404 status

### Data Isolation
Each test creates fresh data and databases are cleaned after each test file:
- No test should depend on another test's data
- Data is isolated between test suites
- No manual cleanup needed

## Troubleshooting

### MongoDB Connection Errors
- Ensure MongoDB is running: `mongod`
- Check default port is 27017
- Or set `MONGODB_URI` in `.env.test`

### Tests Timeout
- Increase Jest timeout: `jest --testTimeout=10000`
- Check MongoDB is responding

### Connection Already Exists
- Jest should handle multiple test file connections
- If issues persist, restart MongoDB and run tests again

## CI/CD Integration

For GitHub Actions or other CI systems:

```yaml
services:
  mongodb:
    image: mongo:latest
    options: >-
      --health-cmd mongosh
      --health-interval 10s
      --health-timeout 5s
      --health-retries 5
    ports:
      - 27017:27017

script:
  - npm test
```

## Future Improvements

- [ ] Unit tests for controllers
- [ ] Mock database for faster test execution
- [ ] Rate limiting endpoint tests
- [ ] Performance benchmarks
- [ ] Error handling edge cases
