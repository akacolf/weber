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

    // Verify center desktop navigation links
    const nav = header.locator('nav[aria-label="Main Navigation"]');
    await expect(nav.getByRole('link', { name: 'About me' })).toBeVisible();
    await expect(nav.getByRole('link', { name: "Products I've built" })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'My resume/cv' })).toBeVisible();

    // Verify white contact me button is present in the header
    const contactBtn = header.getByRole('link', { name: 'Contact me' });
    await expect(contactBtn).toBeVisible();
    await expect(contactBtn).toHaveClass(/bg-white/);
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

    // Test "Contact me" white button
    await header.getByRole('link', { name: 'Contact me' }).click();
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

  test('website loads and applies Libre Baskerville font', async ({ page }) => {
    await page.goto('/');

    // Check that html has the font variable class
    const html = page.locator('html');
    await expect(html).toHaveAttribute('class', /libre_baskerville/i);

    // Check computed font-family on body contains Libre Baskerville
    const bodyFont = await page.evaluate(() => {
      return window.getComputedStyle(document.body).fontFamily;
    });
    expect(bodyFont.toLowerCase()).toContain('libre baskerville');
  });
});

test.describe('Footer tests', () => {
  test('footer renders with brand, navigation, connect links, and copyright', async ({ page }) => {
    await page.goto('/');

    const footer = page.locator('footer[aria-label="Site Footer"]');
    await expect(footer).toBeVisible();

    // Verify logo and brand presence
    const footerLogo = footer.locator('a[aria-label*="Khalid Al Shareef"]');
    await expect(footerLogo).toBeVisible();

    // Verify bio / description text
    await expect(
      footer.getByText("I'm a full stack developer building complex and scalable products")
    ).toBeVisible();

    // Verify availability badge is not present
    await expect(footer.getByText('Available for selected projects')).not.toBeVisible();

    // Verify footer navigation links
    const footerNav = footer.locator('nav[aria-label="Footer Navigation"]');
    await expect(footerNav.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(footerNav.getByRole('link', { name: 'About me' })).toBeVisible();
    await expect(footerNav.getByRole('link', { name: "Products I've built" })).toBeVisible();
    await expect(footerNav.getByRole('link', { name: 'My resume/cv' })).toBeVisible();
    await expect(footerNav.getByRole('link', { name: 'Contact me' })).toBeVisible();

    // Verify connect links and their href attributes
    const githubLink = footer.getByRole('link', { name: /GitHub/i });
    await expect(githubLink).toBeVisible();
    await expect(githubLink).toHaveAttribute('href', 'https://github.com/akacolf');

    const xLink = footer.getByRole('link', { name: /X \/ Twitter/i });
    await expect(xLink).toBeVisible();
    await expect(xLink).toHaveAttribute('href', 'https://x.com/akacolf');

    const linkedinLink = footer.getByRole('link', { name: /LinkedIn/i });
    await expect(linkedinLink).toBeVisible();
    await expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/in/colf');

    const emailLink = footer.getByRole('link', { name: /Email/i });
    await expect(emailLink).toBeVisible();
    await expect(emailLink).toHaveAttribute('href', 'mailto:khalidthenoble@gmail.com');

    // Verify copyright and verify tech colophon is not present
    await expect(footer.getByText(/© \d{4} Khalid Al Shareef/i)).toBeVisible();
    await expect(footer.getByText(/Crafted with Next.js/i)).not.toBeVisible();

    // Verify back to top button
    const backToTopBtn = footer.locator('button[aria-label="Back to top"]');
    await expect(backToTopBtn).toBeVisible();
  });

  test('footer navigation links navigate to correct pages', async ({ page }) => {
    await page.goto('/');

    const footer = page.locator('footer[aria-label="Site Footer"]');
    const footerNav = footer.locator('nav[aria-label="Footer Navigation"]');

    // Click "Contact me" in footer
    await footerNav.getByRole('link', { name: 'Contact me' }).click();
    await expect(page).toHaveURL(/\/contact$/);

    // Click "Products I've built" in footer from contact page
    const contactFooterNav = page.locator('footer[aria-label="Site Footer"] nav[aria-label="Footer Navigation"]');
    await contactFooterNav.getByRole('link', { name: "Products I've built" }).click();
    await expect(page).toHaveURL(/\/products$/);

    // Click "Home" in footer
    const productsFooterNav = page.locator('footer[aria-label="Site Footer"] nav[aria-label="Footer Navigation"]');
    await productsFooterNav.getByRole('link', { name: 'Home' }).click();
    await expect(page).toHaveURL(/\/$/);
  });

  test('back to top button triggers page scroll', async ({ page }) => {
    await page.goto('/');

    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 500));

    const footer = page.locator('footer[aria-label="Site Footer"]');
    const backToTopBtn = footer.locator('button[aria-label="Back to top"]');

    await backToTopBtn.click();
    // Verify scroll position approaches top
    await expect.poll(async () => {
      return await page.evaluate(() => window.scrollY);
    }).toBeLessThan(100);
  });
});

test.describe('Dark and Light Mode tests', () => {
  test('renders theme mode toggle and switches between light and dark themes', async ({ page }) => {
    await page.goto('/');

    const toggleBtn = page.getByRole('button', { name: 'Toggle theme' });
    await expect(toggleBtn).toBeVisible();

    // Click toggle to open theme options dropdown
    await toggleBtn.click();

    // Verify menu items are visible
    const lightOption = page.getByRole('menuitem', { name: 'Light' });
    const darkOption = page.getByRole('menuitem', { name: 'Dark' });
    const systemOption = page.getByRole('menuitem', { name: 'System' });

    await expect(lightOption).toBeVisible();
    await expect(darkOption).toBeVisible();
    await expect(systemOption).toBeVisible();

    // Switch to Light mode
    await lightOption.click();
    const html = page.locator('html');
    await expect(html).toHaveClass(/light/);

    // Switch to Dark mode
    await toggleBtn.click();
    await darkOption.click();
    await expect(html).toHaveClass(/dark/);
  });
});
