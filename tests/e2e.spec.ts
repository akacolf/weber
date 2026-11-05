import { test, expect } from '@playwright/test';

test.describe('Portfolio website tests', () => {
  test('homepage renders hero, title, 3D elements, and key sections', async ({ page }) => {
    await page.goto('/');

    // 1. Heading is present and readable
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    await expect(heading).toContainText(/crafting fluid/i);

    // 2. Navigation CTAs
    const viewWorkBtn = page.getByRole('link', { name: 'View Work' });
    await expect(viewWorkBtn).toBeVisible();

    // 3. Liquid Logo component exists
    const liquidLogo = page.locator('[aria-label="Liquid Logo Mark"]').first();
    await expect(liquidLogo).toBeVisible();

    // 4. Projects section and cards exist
    const projectsSection = page.locator('#projects');
    await expect(projectsSection).toBeVisible();
    await expect(page.getByText('Liquid Chroma Engine')).toBeVisible();

    // 5. Experience / Skills section exists
    const experienceSection = page.locator('#experience');
    await expect(experienceSection).toBeVisible();

    // 6. Contact section exists
    const contactSection = page.locator('#contact');
    await expect(contactSection).toBeVisible();
  });
});
