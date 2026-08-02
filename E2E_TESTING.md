# EcoCycle E2E Testing Guide

Complete guide to running end-to-end tests using Playwright.

## Overview

E2E tests verify complete user workflows from registration to logout. Tests cover:

- User authentication (register, login, logout)
- Waste logging functionality
- Community joining
- Challenge participation
- Profile management
- Error handling
- Protected routes

---

## Prerequisites

- Node.js 18+
- Backend running on `http://localhost:3000`
- Frontend running on `http://localhost:5173`
- MongoDB running and seeded with data (optional but recommended)

---

## Setup

### 1. Install Dependencies

```bash
cd frontend
npm install @playwright/test
```

### 2. Start Services

**Terminal 1 (Backend):**
```bash
npm start
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

### 3. Run Tests

```bash
npm run e2e
```

---

## Running Tests

### Headless Mode (Default)
```bash
npm run e2e
```
- Tests run without browser UI
- Fastest execution
- Good for CI/CD pipelines

### Headed Mode (See Browser)
```bash
npm run e2e:headed
```
- Browser window opens showing test execution
- Better for debugging
- Useful for understanding test behavior

### Debug Mode (Interactive)
```bash
npm run e2e:debug
```
- Step through tests line by line
- Inspect page state at each step
- Best for fixing failing tests

---

## Test Coverage

### Included Tests

| Test | Purpose | Duration |
|------|---------|----------|
| **User Registration and Login** | Verify signup and login flow | 10s |
| **Waste Logging Workflow** | Test waste log creation and display | 15s |
| **Community Join Workflow** | Create community and verify display | 15s |
| **Challenge Participation** | Create challenge and participate | 15s |
| **Leaderboard Display** | Verify leaderboard is accessible | 5s |
| **User Profile Update** | Test profile editing | 15s |
| **Logout Functionality** | Verify logout and redirect | 10s |
| **Protected Routes** | Verify auth-protected pages redirect | 5s |
| **API Error Handling** | Test duplicate email error | 20s |
| **Complete User Journey** | Full workflow (register → log → view) | 30s |

**Total Duration**: ~2 minutes

---

## Test Structure

Each test follows this pattern:

```javascript
test('Test Name', async ({ page }) => {
  // 1. Navigate
  await page.goto(FRONTEND_URL)

  // 2. Interact
  await page.click('text=Button')
  await page.fill('input', 'value')

  // 3. Verify
  await expect(page).toHaveURL(/pattern/)
  await expect(page).toContainText('expected text')
})
```

---

## Key Test Helpers

### Navigation
```javascript
await page.goto(FRONTEND_URL)
await page.click('a:has-text("Communities")')
```

### Form Interaction
```javascript
await page.fill('input[placeholder="username"]', 'testuser')
await page.selectOption('select', 'value')
await page.check('input[type="checkbox"]')
```

### Verification
```javascript
await expect(page).toHaveURL(/dashboard/)
await expect(page).toContainText('Expected text')
await expect(page).toBeVisible()
```

### Waiting
```javascript
await page.waitForURL(/pattern/)
await page.waitForTimeout(1000)
await page.waitForSelector('.element')
```

---

## Customizing Tests

### Add New Test

```javascript
test('My New Test', async ({ page }) => {
  // Test implementation
})
```

Add to `frontend/e2e.spec.js`

### Modify Test Data

Edit `getTestUser()` function:

```javascript
function getTestUser(suffix) {
  return {
    username: `testuser_${Date.now()}_${suffix}`,
    email: `test_${Date.now()}_${suffix}@example.com`,
    password: 'TestPassword123!'
  }
}
```

### Change Timeouts

```javascript
test.setTimeout(60000) // 60 seconds for this test
await page.waitForTimeout(5000) // Wait 5 seconds
```

---

## Debugging Failed Tests

### 1. Run in Headed Mode
```bash
npm run e2e:headed
```
See the browser doing exactly what the test does.

### 2. Debug Mode
```bash
npm run e2e:debug
```
Step through test line-by-line:
- `Step over` - next line
- `Step into` - inside function call
- `Step out` - exit function
- `Continue` - run to breakpoint

### 3. View Screenshots
Tests save screenshots when they fail:
```bash
ls test-results/
# Open .png files to see where test failed
```

### 4. Check Logs
```bash
# Playwright logs to console
npm run e2e 2>&1 | tee test.log
cat test.log  # Review output
```

### 5. Common Issues

**Problem**: Tests fail with "element not found"
**Solution**: 
- Check selector is correct
- Add wait: `await page.waitForSelector('text=Button')`
- Verify frontend is running on correct port

**Problem**: Tests timeout
**Solution**:
- Increase timeout: `test.setTimeout(120000)`
- Check backend is running
- Check database is accessible

**Problem**: Tests pass locally but fail in CI
**Solution**:
- Ensure both backend and frontend start in CI
- Use proper `baseURL` in playwright.config.js
- Check port availability

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: 18

      # Start backend
      - run: npm ci
      - run: npm start &

      # Start frontend and tests
      - run: cd frontend && npm ci
      - run: cd frontend && npm run e2e

      # Upload results
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: frontend/playwright-report/
```

---

## Test Report

After running tests:

```bash
npx playwright show-report
```

Opens HTML report with:
- Test results (✓ pass, ✗ fail)
- Execution time
- Screenshots/videos (if failed)
- Browser details

---

## Performance Benchmarks

Expected test times with seeded data:

| Scenario | Time |
|----------|------|
| Quick test (no data)  | 5-10s |
| Full E2E suite | 1-2 min |
| With headless | ~1 min |
| With headed | ~2 min |

---

## Best Practices

### ✅ Do
- Use meaningful test names
- Test complete workflows
- Wait for elements to be ready
- Clean up test data after tests
- Run tests regularly

### ❌ Don't
- Hardcode timestamps (use `Date.now()`)
- Share test data between tests
- Use fragile selectors (prefer text matching)
- Ignore timeouts
- Run all tests in parallel (can cause conflicts)

---

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5173
lsof -i :5173
kill -9 <PID>

# Or use different port
PORT=5174 npm run dev
```

### MongoDB Connection Issues
```bash
# Ensure MongoDB is running
mongod

# Or use Docker
docker run -d -p 27017:27017 mongo
```

### Tests Hanging
```bash
# Check if frontend dev server started
curl http://localhost:5173

# Increase timeout
test.setTimeout(120000)
```

---

## Advanced Testing

### Custom Fixtures

```javascript
test.beforeEach(async ({ page }) => {
  // Run before each test
  await page.goto(FRONTEND_URL)
  // Login
})

test.afterEach(async ({ page }) => {
  // Run after each test
  // Cleanup
})
```

### Parallel Execution

Enable in `playwright.config.js`:
```javascript
export default defineConfig({
  workers: 4,  // Run 4 tests in parallel
})
```

### Visual Regression Testing

```javascript
await expect(page).toHaveScreenshot()
```

---

## Test Data Management

### Reset Between Tests
Each test creates its own user with unique email:
```javascript
email: `test_${Date.now()}_${suffix}@example.com`
```

Ensures no conflicts between tests.

### Use Seeded Data
Run seed script before tests:
```bash
npm run seed
npm run e2e
```

Creates 10 test users you can reuse.

---

## Continuous Testing

### Watch Mode
```bash
npm run e2e -- --watch
```
Re-run tests when files change.

### Slow Motion
```bash
npm run e2e -- --slow-mo=1000
```
Slow down each action by 1000ms for debugging.

---

## Reporting Issues

When reporting E2E test failures:

1. **Run in debug mode**
   ```bash
   npm run e2e:debug
   ```

2. **Capture information**
   - Test name
   - Error message
   - Screenshot (if available)
   - Browser/OS version

3. **Reproduce locally**
   ```bash
   npm run e2e:headed
   ```

4. **Check logs**
   ```bash
   npm run e2e 2>&1 | tail -50
   ```

---

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright Debugging Guide](https://playwright.dev/docs/debug)
- [Selectors Guide](https://playwright.dev/docs/locators)
- [Best Practices](https://playwright.dev/docs/best-practices)

---

## Example Test Commands

```bash
# Run all tests
npm run e2e

# Run specific test
npm run e2e -- --grep "Registration"

# Run with verbose output
npm run e2e -- --verbose

# Run in headed mode with slowdown
npm run e2e:headed -- --slow-mo=500

# Update snapshots
npm run e2e -- --update-snapshots

# Run tests in browser UI (experimental)
npm run e2e -- --ui
```

---

**Status**: E2E tests ready for use ✅

Start with: `npm run e2e` to verify your setup works!
