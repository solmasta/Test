import { test, expect } from '@playwright/test'

const FRONTEND_URL = 'http://localhost:5173'
const API_URL = 'http://localhost:3000/api'

// Helper to create unique test data
function getTestUser(suffix) {
  return {
    username: `testuser_${Date.now()}_${suffix}`,
    email: `test_${Date.now()}_${suffix}@example.com`,
    password: 'TestPassword123!'
  }
}

test.describe('EcoCycle E2E Tests', () => {
  test('User Registration and Login Flow', async ({ page }) => {
    const user = getTestUser('registration')

    // Navigate to home
    await page.goto(FRONTEND_URL)
    await expect(page).toHaveTitle(/EcoCycle/)

    // Click signup
    await page.click('text=Sign Up')
    await expect(page).toHaveURL(/\/register/)

    // Fill registration form
    await page.fill('input[placeholder="eco_warrior"]', user.username)
    await page.fill('input[placeholder="you@example.com"]', user.email)
    await page.fill('input[placeholder="••••••••"]', user.password)

    // Get confirm password field (second password field)
    const passwordFields = await page.locator('input[type="password"]')
    await passwordFields.nth(1).fill(user.password)

    // Submit
    await page.click('text=Sign Up')

    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/)
    await expect(page).toContainText(user.username)
  })

  test('Complete Waste Logging Workflow', async ({ page }) => {
    const user = getTestUser('waste_log')

    // Register
    await page.goto(FRONTEND_URL)
    await page.click('text=Sign Up')
    await page.fill('input[placeholder="eco_warrior"]', user.username)
    await page.fill('input[placeholder="you@example.com"]', user.email)
    const passwordFields = await page.locator('input[type="password"]')
    await passwordFields.nth(0).fill(user.password)
    await passwordFields.nth(1).fill(user.password)
    await page.click('text=Sign Up')
    await page.waitForURL(/\/dashboard/)

    // Add waste log
    await page.selectOption('select', 'plastic')
    await page.fill('input[placeholder="2.5"]', '3.5')
    await page.fill('input[placeholder="10"]', '35')
    await page.click('text=Add Log')

    // Wait for update
    await page.waitForTimeout(1000)

    // Verify log appears
    await expect(page).toContainText('Plastic')
    await expect(page).toContainText('3.5')
  })

  test('Community Join Workflow', async ({ page }) => {
    const user = getTestUser('community')

    // Register and login
    await page.goto(FRONTEND_URL)
    await page.click('text=Sign Up')
    await page.fill('input[placeholder="eco_warrior"]', user.username)
    await page.fill('input[placeholder="you@example.com"]', user.email)
    const passwordFields = await page.locator('input[type="password"]')
    await passwordFields.nth(0).fill(user.password)
    await passwordFields.nth(1).fill(user.password)
    await page.click('text=Sign Up')
    await page.waitForURL(/\/dashboard/)

    // Navigate to communities
    await page.click('a:has-text("Communities")')
    await expect(page).toHaveURL(/\/communities/)

    // Create community
    const communityName = `Test Community ${Date.now()}`
    await page.fill('input[placeholder="Green Warriors"]', communityName)
    await page.fill('textarea', 'Test community description')
    await page.fill('input[placeholder="San Francisco, CA"]', 'Test City')
    await page.click('button:has-text("Create")')

    // Wait for creation
    await page.waitForTimeout(1000)

    // Verify community appears
    await expect(page).toContainText(communityName)
  })

  test('Challenge Participation Workflow', async ({ page }) => {
    const user = getTestUser('challenge')

    // Register
    await page.goto(FRONTEND_URL)
    await page.click('text=Sign Up')
    await page.fill('input[placeholder="eco_warrior"]', user.username)
    await page.fill('input[placeholder="you@example.com"]', user.email)
    const passwordFields = await page.locator('input[type="password"]')
    await passwordFields.nth(0).fill(user.password)
    await passwordFields.nth(1).fill(user.password)
    await page.click('text=Sign Up')
    await page.waitForURL(/\/dashboard/)

    // Navigate to challenges
    await page.click('a:has-text("Challenges")')
    await expect(page).toHaveURL(/\/challenges/)

    // Create challenge
    const challengeTitle = `Test Challenge ${Date.now()}`
    await page.fill('input[placeholder="Zero Waste Week"]', challengeTitle)
    await page.fill('textarea', 'Test challenge description')
    await page.fill('input[placeholder="100"]', '100')
    await page.click('button:has-text("Create")')

    // Wait for creation
    await page.waitForTimeout(1000)

    // Verify challenge appears
    await expect(page).toContainText(challengeTitle)
  })

  test('Leaderboard Display', async ({ page }) => {
    // Go to leaderboard (public, no login needed)
    await page.goto(`${FRONTEND_URL}/leaderboard`)

    // Should see leaderboard
    await expect(page).toHaveTitle(/EcoCycle/)

    // Should have leaderboard content
    const leaderboardHeader = page.locator('text=Leaderboard')
    await expect(leaderboardHeader).toBeVisible()
  })

  test('User Profile Update', async ({ page }) => {
    const user = getTestUser('profile')

    // Register
    await page.goto(FRONTEND_URL)
    await page.click('text=Sign Up')
    await page.fill('input[placeholder="eco_warrior"]', user.username)
    await page.fill('input[placeholder="you@example.com"]', user.email)
    const passwordFields = await page.locator('input[type="password"]')
    await passwordFields.nth(0).fill(user.password)
    await passwordFields.nth(1).fill(user.password)
    await page.click('text=Sign Up')
    await page.waitForURL(/\/dashboard/)

    // Navigate to profile
    await page.click(`text=${user.username}`)
    await expect(page).toHaveURL(/\/profile/)

    // Edit profile
    await page.click('text=Edit Profile')

    // Update username
    const usernameInput = page.locator('input').first()
    await usernameInput.fill('UpdatedUsername')

    // Save
    await page.click('text=Save')

    // Wait for update
    await page.waitForTimeout(1000)

    // Verify update (button should now show "Edit Profile" again)
    await expect(page).toContainText('Edit Profile')
  })

  test('Logout Functionality', async ({ page }) => {
    const user = getTestUser('logout')

    // Register
    await page.goto(FRONTEND_URL)
    await page.click('text=Sign Up')
    await page.fill('input[placeholder="eco_warrior"]', user.username)
    await page.fill('input[placeholder="you@example.com"]', user.email)
    const passwordFields = await page.locator('input[type="password"]')
    await passwordFields.nth(0).fill(user.password)
    await passwordFields.nth(1).fill(user.password)
    await page.click('text=Sign Up')
    await page.waitForURL(/\/dashboard/)

    // Logout
    await page.click('text=Logout')

    // Should redirect to home
    await expect(page).toHaveURL(FRONTEND_URL)

    // Sign up button should be visible again
    await expect(page).toContainText('Sign Up')
  })

  test('Protected Routes', async ({ page }) => {
    // Try to access dashboard without login
    await page.goto(`${FRONTEND_URL}/dashboard`)

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/)
  })

  test('API Error Handling - Duplicate Email', async ({ page }) => {
    const user = getTestUser('duplicate')

    // Register first time
    await page.goto(FRONTEND_URL)
    await page.click('text=Sign Up')
    await page.fill('input[placeholder="eco_warrior"]', user.username)
    await page.fill('input[placeholder="you@example.com"]', user.email)
    const passwordFields = await page.locator('input[type="password"]')
    await passwordFields.nth(0).fill(user.password)
    await passwordFields.nth(1).fill(user.password)
    await page.click('text=Sign Up')
    await page.waitForURL(/\/dashboard/)

    // Logout
    await page.click('text=Logout')

    // Try to register with same email
    await page.click('text=Sign Up')
    await page.fill('input[placeholder="eco_warrior"]', 'different_username')
    await page.fill('input[placeholder="you@example.com"]', user.email)
    const passwordFields2 = await page.locator('input[type="password"]')
    await passwordFields2.nth(0).fill(user.password)
    await passwordFields2.nth(1).fill(user.password)
    await page.click('text=Sign Up')

    // Should show error
    await expect(page).toContainText(/error|already|exists/i)
  })

  test('Complete User Journey', async ({ page }) => {
    const user = getTestUser('journey')

    // 1. Register
    await page.goto(FRONTEND_URL)
    await page.click('text=Sign Up')
    await page.fill('input[placeholder="eco_warrior"]', user.username)
    await page.fill('input[placeholder="you@example.com"]', user.email)
    const passwordFields = await page.locator('input[type="password"]')
    await passwordFields.nth(0).fill(user.password)
    await passwordFields.nth(1).fill(user.password)
    await page.click('text=Sign Up')
    await page.waitForURL(/\/dashboard/)

    // 2. Log waste
    await page.selectOption('select', 'plastic')
    await page.fill('input[placeholder="2.5"]', '2.0')
    await page.fill('input[placeholder="10"]', '20')
    await page.click('text=Add Log')
    await page.waitForTimeout(500)

    // 3. View profile
    await page.click(`text=${user.username}`)
    await page.waitForURL(/\/profile/)
    await expect(page).toContainText(/Eco Score|eco points/i)

    // 4. Visit leaderboard
    await page.click('a:has-text("Leaderboard")')
    await page.waitForURL(/\/leaderboard/)
    await expect(page).toContainText(/Leaderboard|rankings/i)

    // 5. Logout
    await page.click('text=Logout')
    await page.waitForURL(FRONTEND_URL)
  })
})
