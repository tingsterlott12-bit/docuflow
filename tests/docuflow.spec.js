import { test, expect } from '@playwright/test';

test.describe('DocuFlow World-Class Platform E2E Tests', () => {
  test('1. Home page loads with hero, feature cards, and CTAs', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('interactive 3D flipbooks');
    await expect(page.locator('text=Zero Commercial Dependencies')).toBeVisible();
    await expect(page.locator('text=3D StPageFlip Engine')).toBeVisible();
  });

  test('2. Auth page toggles password and magic link modes', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('h1')).toHaveText('Welcome to DocuFlow');
    await expect(page.locator('input[type="password"]')).toBeVisible();

    // Toggle magic link
    await page.click('button:has-text("Prefer passwordless?")');
    await expect(page.locator('button:has-text("Send Magic Link")')).toBeVisible();
  });

  test('3. Dashboard lists flipbooks and action triggers', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.locator('h1')).toHaveText('FlipBook Library');
    await expect(page.locator('h3:has-text("Building Real Wealth")')).toBeVisible();
    await expect(page.locator('a:has-text("Open Reader")')).toBeVisible();
    await expect(page.locator('a:has-text("Analytics")')).toBeVisible();
  });

  test('4. Upload shell configures title and gating modes', async ({ page }) => {
    await page.goto('/upload');
    await expect(page.locator('h1')).toHaveText('Create Interactive Publication');
    
    // Test clicking Lead Gate
    await page.click('button:has-text("Lead Gate")');
    await expect(page.locator('button:has-text("Lead Gate")')).toHaveClass(/border-brand-600/);

    // Test clicking Password Gate
    await page.click('button:has-text("Password Gate")');
    await expect(page.locator('input[placeholder*="Passcode"]')).toBeVisible();
  });

  test('5. 3D Viewer renders book, controls, and deep links', async ({ page }) => {
    await page.goto('/d/annual-report');
    
    // Verify book container is rendered
    await expect(page.locator('.flipbook-container')).toBeVisible();
    await expect(page.locator('text=Page 1 of 6')).toBeVisible();

    // Verify next page button
    const nextBtn = page.locator('button[aria-label="Next Page"]');
    await expect(nextBtn).toBeVisible();
    await nextBtn.click();
    
    // Expect URL hash update
    await expect(page).toHaveURL(/#page=2/);
  });

  test('6. Analytics dashboard displays KPIs, chart, and leads table', async ({ page }) => {
    await page.goto('/dashboard/annual-report/analytics');
    await expect(page.locator('h1')).toContainText('Executive Brief 2026');
    await expect(page.locator('text=Total Views')).toBeVisible();
    await expect(page.locator('text=Page Turns')).toBeVisible();
    await expect(page.locator('text=Avg Dwell Time')).toBeVisible();
    await expect(page.locator('text=Qualified Leads')).toBeVisible();
  });

  test('7. Missing doc route handles 404 cleanly', async ({ page }) => {
    await page.goto('/d/non-existent-publication-slug-xyz');
    await expect(page.locator('h1:has-text("Publication Not Found")')).toBeVisible();
    await expect(page.locator('a:has-text("Return to Dashboard")')).toBeVisible();
  });
});
