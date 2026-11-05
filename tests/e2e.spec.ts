import { test, expect } from '@playwright/test';

test.describe('Header & Navigation tests', () => {
  test('homepage renders header with logo and navigation links without badge or extra borders', async ({ page }) => {
    await page.goto('/');

    // Verify header exists
    const header = page.locator('header');
    await expect(header).toBeVisible();

    // Verify logo exists and links to homepage
    const logo = header.locator('a[aria-label*="Khalid Al Shareef"]');
    await expect(logo).toBeVisible();
    await expect(logo).toHaveAttribute('href', '/');

    // Verify "Portfolio" text is NOT present in the header
    await expect(header.getByText('Portfolio')).not.toBeVisible();

    // Verify "Available for projects" badge is NOT present
    await expect(header.getByText('Available for projects')).not.toBeVisible();

    // Verify all 4 desktop navigation links are present with exact expected titles
    const nav = header.locator('nav[aria-label="Main Navigation"]');
    await expect(nav.getByRole('link', { name: 'About me' })).toBeVisible();
    await expect(nav.getByRole('link', { name: "Products I've built" })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'My resume/cv' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Contact me' })).toBeVisible();
  });

  test('navigation links work and navigate correctly', async ({ page }) => {
    await page.goto('/');

    const header = page.locator('header');
    const nav = header.locator('nav[aria-label="Main Navigation"]');

    // Test "About me"
    await nav.getByRole('link', { name: 'About me' }).click();
    await expect(page).toHaveURL(/\/about$/);

    // Test "Products I've built"
    await nav.getByRole('link', { name: "Products I've built" }).click();
    await expect(page).toHaveURL(/\/products$/);

    // Test "My resume/cv"
    await nav.getByRole('link', { name: 'My resume/cv' }).click();
    await expect(page).toHaveURL(/\/resume$/);

    // Test "Contact me"
    await nav.getByRole('link', { name: 'Contact me' }).click();
    await expect(page).toHaveURL(/\/contact$/);

    // Test clicking Logo returns to home
    await header.locator('a[aria-label*="Khalid Al Shareef"]').click();
    await expect(page).toHaveURL(/\/$/);
  });

  test('mobile navigation drawer opens and displays page links', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Mobile menu button should be visible
    const menuButton = page.locator('button[aria-label="Open navigation menu"]');
    await expect(menuButton).toBeVisible();

    // Open mobile menu
    await menuButton.click();

    // Mobile nav drawer should be visible and contain links
    const mobileNav = page.locator('nav[aria-label="Mobile Navigation"]');
    await expect(mobileNav).toBeVisible();
    await expect(mobileNav.getByRole('link', { name: 'About me' })).toBeVisible();
    await expect(mobileNav.getByRole('link', { name: "Products I've built" })).toBeVisible();
    await expect(mobileNav.getByRole('link', { name: 'My resume/cv' })).toBeVisible();
    await expect(mobileNav.getByRole('link', { name: 'Contact me' })).toBeVisible();
  });
});
