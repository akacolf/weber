import { test, expect } from '@playwright/test';

test.describe('Portfolio website tests', () => {
  test('homepage renders clean slate', async ({ page }) => {
    await page.goto('/');
    const main = page.locator('main');
    await expect(main).toBeVisible();
  });
});
