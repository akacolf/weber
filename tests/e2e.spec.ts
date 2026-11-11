import { test, expect, type Locator } from '@playwright/test';

/**
 * Helper to reliably open Base UI dropdown menus across Chromium and WebKit.
 * WebKit drivers can struggle with synthetic pointerdown/up sequences on Base UI triggers,
 * whereas keyboard activation (Enter/Space) cleanly activates the trigger without
 * rapid open/close toggle races or focus-guard traps.
 */
async function openDropdownMenu(trigger: Locator, dropdown: Locator) {
  await expect(trigger).toBeVisible();
  if (await dropdown.isVisible()) {
    return;
  }
  await trigger.focus();
  await trigger.press('Enter');
  try {
    await expect(dropdown).toBeVisible({ timeout: 2000 });
    return;
  } catch {
    // If Enter didn't open it, attempt Space
    await trigger.press('Space');
  }
  try {
    await expect(dropdown).toBeVisible({ timeout: 2000 });
    return;
  } catch {
    // Fallback to click if keyboard didn't open it
    await trigger.click({ force: true });
    await expect(dropdown).toBeVisible({ timeout: 5000 });
  }
}

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
    await expect(nav.locator('button[aria-label="About me dropdown menu"]')).toBeVisible();
    await expect(nav.getByRole('link', { name: "Products I've built" })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'My resume/cv' })).toBeVisible();

    // Verify Try Weber button is present and links to AI model route (/weber)
    const weberBtn = header.getByRole('link', { name: /Try Weber/i });
    await expect(weberBtn).toBeVisible();
    await expect(weberBtn).toHaveAttribute('href', '/weber');

    // Verify white contact me button is present in the header
    const contactBtn = header.getByRole('link', { name: 'Contact me' });
    await expect(contactBtn).toBeVisible();
    await expect(contactBtn).toHaveClass(/bg-white/);
  });

  test('navigation links work and navigate correctly', async ({ page }) => {
    await page.goto('/?skipIntro=true');

    const header = page.locator('header');
    const nav = header.locator('nav[aria-label="Main Navigation"]');
    const aboutTrigger = nav.locator('button[aria-label="About me dropdown menu"]');
    const dropdown = page.locator('[data-slot="dropdown-menu-content"]');

    // Test "About me" dropdown menu -> "About me" item
    const aboutMenuItem = dropdown.getByRole('link', { name: 'About me' });
    await openDropdownMenu(aboutTrigger, dropdown);
    await expect(aboutMenuItem).toBeVisible();
    await aboutMenuItem.click();
    await expect(page).toHaveURL(/\/about$/);

    // Test "About me" dropdown menu -> "My constitution" item
    const constitutionMenuItem = dropdown.getByRole('link', { name: 'My constitution' });
    await openDropdownMenu(aboutTrigger, dropdown);
    await expect(constitutionMenuItem).toBeVisible();
    await constitutionMenuItem.click();
    await expect(page).toHaveURL(/\/constitution$/);

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
    await expect(mobileNav.getByRole('link', { name: 'My constitution' })).toBeVisible();
    await expect(mobileNav.getByRole('link', { name: "Products I've built" })).toBeVisible();
    await expect(mobileNav.getByRole('link', { name: 'My resume/cv' })).toBeVisible();
    await expect(mobileNav.getByRole('link', { name: /Try Weber/i })).toBeVisible();
    await expect(mobileNav.getByRole('link', { name: /Try Weber/i })).toHaveAttribute('href', '/weber');
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
    await page.goto('/?skipIntro=true');

    const toggleBtn = page.getByRole('button', { name: 'Toggle theme' });
    await expect(toggleBtn).toBeVisible();

    const dropdown = page.locator('[data-slot="dropdown-menu-content"]');
    // Verify menu items are visible
    const lightOption = page.getByRole('menuitem', { name: 'Light' });
    const darkOption = page.getByRole('menuitem', { name: 'Dark' });
    const systemOption = page.getByRole('menuitem', { name: 'System' });

    // Open theme options dropdown
    await openDropdownMenu(toggleBtn, dropdown);
    await expect(lightOption).toBeVisible();
    await expect(darkOption).toBeVisible();
    await expect(systemOption).toBeVisible();

    // Switch to Light mode
    await lightOption.click();
    const html = page.locator('html');
    await expect(html).toHaveClass(/light/);

    // Switch to Dark mode
    await expect(dropdown).not.toBeVisible();
    await openDropdownMenu(toggleBtn, dropdown);
    await expect(darkOption).toBeVisible();
    await darkOption.click();
    await expect(html).toHaveClass(/dark/);
  });
});

test.describe('Favicon & Document Title tests', () => {
  test('homepage has <Home> title and custom favicon icon', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('<Home>');

    const iconLink = page.locator('link[rel="icon"]');
    await expect(iconLink).toHaveAttribute('href', /\/icon\.svg/);
  });

  test('subpages have route-matching titles with angle brackets', async ({ page }) => {
    await page.goto('/about');
    await expect(page).toHaveTitle('<About me>');

    await page.goto('/products');
    await expect(page).toHaveTitle("<Products I've built>");

    await page.goto('/resume');
    await expect(page).toHaveTitle('<My resume/cv>');

    await page.goto('/contact');
    await expect(page).toHaveTitle('<Contact me>');
  });
});

test.describe('Featured Projects Showcase tests', () => {
  test('renders featured projects section directly below hero with Quantum Club card', async ({ page }) => {
    await page.goto('/?skipIntro=true');

    // Verify hero section is present
    const greeting = page.getByRole('heading', { name: 'Welcome to my website.' });
    await expect(greeting).toBeVisible();

    // Verify featured projects section exists
    const projectsSection = page.locator('section#projects');
    await expect(projectsSection).toBeVisible();

    // Verify section heading and description
    await expect(projectsSection.getByRole('heading', { name: 'Featured Projects' })).toBeVisible();
    await expect(
      projectsSection.getByText("Some of what I've built. From a wide range of categories, including web apps, AI, mobile, and desktop.")
    ).toBeVisible();

    // Verify "Selected Works" badge was deleted
    await expect(projectsSection.getByText('Selected Works')).not.toBeVisible();

    // Verify Quantum Club project card is rendered
    await expect(projectsSection.getByRole('heading', { name: 'Quantum Club' })).toBeVisible();
    await expect(
      projectsSection.getByText(
        'Web3 super app that combined DeFi, social, and AI on TON. Scaled to 3000 users and counting and received a grant from STON.fi.'
      )
    ).toBeVisible();

    // Verify badges (Blockchain • Web3 • AI and Webapp)
    await expect(projectsSection.getByText('Blockchain • Web3 • AI')).toBeVisible();
    await expect(projectsSection.getByText('Webapp').first()).toBeVisible();

    // Verify project banner image is displayed
    await expect(projectsSection.getByAltText(/quantum club banner/i)).toBeVisible();

    // Verify spec callout badge (highlight) was deleted
    await expect(projectsSection.getByText(/contrast audit/i)).not.toBeVisible();
    await expect(projectsSection.getByText(/WCAG AAA/i)).not.toBeVisible();

    // Verify tech stack tags on Quantum Club card
    const quantumArticle = projectsSection.locator('article').filter({ hasText: 'Quantum Club' });
    await expect(quantumArticle.getByText('TypeScript')).toBeVisible();
    await expect(quantumArticle.getByText('JavaScript')).toBeVisible();
    await expect(quantumArticle.getByText('Next.js')).toBeVisible();
    await expect(quantumArticle.getByText('Tailwind CSS')).toBeVisible();

    // Verify direct repo links for Quantum Club & Jarvis Wallet
    const quantumLink = quantumArticle.getByRole('link', { name: /repository for quantum club/i });
    await expect(quantumLink).toHaveAttribute('href', 'https://github.com/akacolf/quantum-club-webapp');

    // Verify Jarvis Wallet project card, repo link, and cohort 1 description
    const jarvisArticle = projectsSection.locator('article').filter({ hasText: 'Jarvis Wallet' });
    await expect(jarvisArticle.getByRole('heading', { name: 'Jarvis Wallet' })).toBeVisible();
    await expect(jarvisArticle.getByAltText(/jarvis wallet banner/i)).toBeVisible();
    await expect(jarvisArticle.getByText(/Built during the STON\.fi hackathon cohort 1/i)).toBeVisible();
    const jarvisLink = jarvisArticle.getByRole('link', { name: /repository for jarvis wallet/i });
    await expect(jarvisLink).toHaveAttribute('href', 'https://github.com/akacolf/jarvis-wallet');

    // Verify Codeus project card, cohort 2 description, and dropdown menu with 3 repo links
    const codeusArticle = projectsSection.locator('article').filter({ hasText: 'Codeus' });
    await expect(codeusArticle.getByRole('heading', { name: 'Codeus' })).toBeVisible();
    await expect(codeusArticle.getByAltText(/codeus cli banner/i)).toBeVisible();
    await expect(codeusArticle.getByText(/Built during the STON\.fi hackathon cohort 2/i)).toBeVisible();

    const codeusMenuTrigger = codeusArticle.getByRole('button', { name: /repositories for codeus/i });
    await expect(codeusMenuTrigger).toBeVisible();

    const cliItem = page.getByRole('menuitem', { name: /codeus cli/i });
    const appItem = page.getByRole('menuitem', { name: /codeus app/i });
    const apiItem = page.getByRole('menuitem', { name: /codeus api/i });

    const codeusDropdown = page.locator('[data-slot="dropdown-menu-content"]');
    await openDropdownMenu(codeusMenuTrigger, codeusDropdown);
    await expect(cliItem).toBeVisible();

    await expect(cliItem.locator('a')).toHaveAttribute('href', 'https://github.com/akacolf/codeus-cli');

    await expect(appItem).toBeVisible();
    await expect(appItem.locator('a')).toHaveAttribute('href', 'https://github.com/akacolf/codeus-app');

    await expect(apiItem).toBeVisible();
    await expect(apiItem.locator('a')).toHaveAttribute('href', 'https://github.com/akacolf/codeus-api');
  });

  test('featured projects link to products archive', async ({ page }) => {
    await page.goto('/?skipIntro=true');

    const projectsSection = page.locator('section#projects');
    const viewAllBtn = projectsSection.getByRole('link', { name: 'View all products' });
    await expect(viewAllBtn).toBeVisible();
    await viewAllBtn.click();
    await expect(page).toHaveURL(/\/products$/);
  });
});

test.describe('Stats section tests', () => {
  test('renders Stats section with updated title, description, and cards without icons or badges', async ({ page }) => {
    await page.goto('/');

    const statsSection = page.locator('section#stats');
    await expect(statsSection).toBeVisible();

    // Verify section heading is "Stats"
    await expect(statsSection.getByRole('heading', { name: 'Stats', exact: true })).toBeVisible();
    await expect(statsSection.getByText('Key Metrics & Impact')).not.toBeVisible();

    // Verify description
    await expect(statsSection.getByText('Here are some numbers related to me.')).toBeVisible();

    // Verify 4 stat cards exist
    await expect(statsSection.getByText('3,000+')).toBeVisible();
    await expect(statsSection.getByText('Active users scaled')).toBeVisible();

    await expect(statsSection.getByText('3+')).toBeVisible();
    await expect(statsSection.getByRole('heading', { name: 'Experience' })).toBeVisible();

    // Verify Projects completed replaces STON.fi grant recipient
    await expect(statsSection.getByText('Projects completed')).toBeVisible();
    await expect(statsSection.getByText('Grant Recipient')).not.toBeVisible();

    // Verify Worldwide clients replaces 99.9% production reliability
    await expect(statsSection.getByText('Worldwide clients')).toBeVisible();
    await expect(statsSection.getByText('Production Reliability')).not.toBeVisible();

    // Verify badges at the bottom are removed
    await expect(statsSection.getByText('Community')).not.toBeVisible();
    await expect(statsSection.getByText('Track Record')).not.toBeVisible();
    await expect(statsSection.getByText('Ecosystem Grant')).not.toBeVisible();
    await expect(statsSection.getByText('Performance', { exact: true })).not.toBeVisible();
  });
});

test.describe('Contact page tests', () => {
  test('renders contact form from shadcn and Google Calendar booking section', async ({ page }) => {
    await page.goto('/contact');

    // Page title and heading
    await expect(page).toHaveTitle('<Contact me>');
    await expect(page.getByRole('heading', { name: "Let's build together." })).toBeVisible();

    // Verify shadcn contact form exists with all fields
    const form = page.locator('[data-testid="contact-form"]');
    await expect(form).toBeVisible();
    await expect(page.getByLabel(/Your Name/i)).toBeVisible();
    await expect(page.getByLabel(/Email Address/i)).toBeVisible();
    await expect(page.getByLabel(/Subject \/ Project Category/i)).toBeVisible();
    await expect(page.getByLabel(/Message/i)).toBeVisible();
    await expect(page.getByLabel(/Security Verification/i)).toBeVisible();
    await expect(page.locator('[data-testid="captcha-display"]')).toBeVisible();
    await expect(form.getByRole('button', { name: /Send message/i })).toBeVisible();

    // Verify Google Calendar meeting booking section
    const calendarSection = page.locator('[data-testid="calendar-booking-section"]');
    await expect(calendarSection).toBeVisible();
    await expect(calendarSection.getByRole('heading', { name: 'Book a meeting' })).toBeVisible();

    const calendarBtn = calendarSection.locator('[data-testid="book-calendar-btn"]');
    await expect(calendarBtn).toBeVisible();
    await expect(calendarBtn).toHaveAttribute('href', 'https://calendar.app.google/EtDmg8dKUaTUUYWw7');
    await expect(calendarBtn).toHaveAttribute('target', '_blank');
  });

  test('submitting contact form displays interactive success feedback and allows reset', async ({ page }) => {
    // Mock the contact API to guarantee no real emails are sent during E2E testing
    await page.route('**/api/contact', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          simulated: true,
          message: 'Message received in development/test mode.',
        }),
      });
    });

    await page.goto('/contact');
    await page.waitForLoadState('domcontentloaded');

    // Fill out form
    const nameInput = page.locator('#name');
    await expect(nameInput).toBeVisible();
    await nameInput.click();
    await nameInput.fill('Sarah Connor');

    const emailInput = page.locator('#email');
    await emailInput.click();
    await emailInput.fill('sarah@cyberdyne.io');

    const subjectInput = page.locator('#subject');
    await subjectInput.click();
    await subjectInput.fill('Full Stack AI Platform');

    const messageInput = page.locator('#message');
    await messageInput.click();
    await messageInput.fill('Looking to collaborate on a new high-throughput application.');

    // Fill security verification code
    const captchaInput = page.locator('#captchaAnswer');
    await captchaInput.fill('24');

    // Submit form
    await page.getByRole('button', { name: /Send message/i }).click();

    // Verify success confirmation card
    const successCard = page.locator('[data-testid="contact-success-state"]');
    await expect(successCard).toBeVisible({ timeout: 8000 });
    await expect(successCard.getByText('Message received!')).toBeVisible();
    await expect(successCard.getByText('Sarah Connor')).toBeVisible();
    await expect(successCard.getByText('sarah@cyberdyne.io')).toBeVisible();

    // Click "Send another message"
    const resetBtn = successCard.getByRole('button', { name: /Send another message/i });
    await expect(resetBtn).toBeVisible();
    await resetBtn.click();

    // Form is restored and empty
    const form = page.locator('[data-testid="contact-form"]');
    await expect(form).toBeVisible();
    await expect(page.locator('#name')).toHaveValue('');
  });

  test('contact form captcha challenge can be refreshed and displays security feedback', async ({ page }) => {
    await page.goto('/contact?skipIntro=true');
    await page.waitForLoadState('networkidle');

    // Captcha section is present
    const captchaSection = page.locator('[data-testid="captcha-section"]');
    await expect(captchaSection).toBeVisible();

    // Verify refresh button exists and can be clicked
    const refreshBtn = captchaSection.locator('[data-testid="refresh-captcha-btn"]');
    await expect(refreshBtn).toBeVisible();
    await refreshBtn.click();

    // Challenge SVG continues to display properly
    const captchaDisplay = page.locator('[data-testid="captcha-display"]');
    await expect(captchaDisplay).toBeVisible();
    await expect(captchaDisplay.locator('svg')).toBeVisible();
  });
});

test.describe('Keynote Greeting Intro tests', () => {
  test('displays keynote greeting on mount with 2s per slide without lights or skip buttons, then transitions to home', async ({ page }) => {
    // Visit page on normal mount (no query params needed)
    await page.goto('/');

    // Overlay is present on mount
    const overlay = page.locator('[data-testid="keynote-intro-overlay"]');
    await expect(overlay).toBeVisible();

    // Verify skip button does NOT exist
    const skipBtn = page.locator('[data-testid="skip-intro-btn"]');
    await expect(skipBtn).toHaveCount(0);

    // Slide 1 contains "Hi I'm Colf."
    const slide1 = page.locator('[data-testid="keynote-greeting-1"]');
    await expect(slide1).toBeVisible();
    await expect(slide1).toContainText("Hi I'm Colf.");

    // Verify timer line is visible without any text
    const timer = page.locator('[data-testid="keynote-timer"]');
    await expect(timer).toBeVisible();
    await expect(timer).toHaveText('');

    // Clicking anywhere does NOT dismiss the intro
    await page.mouse.click(200, 200);
    await expect(overlay).toBeVisible();

    // Slide 2 contains "Awesome meeting you." (appears at 2 seconds)
    const slide2 = page.locator('[data-testid="keynote-greeting-2"]');
    await expect(slide2).toBeVisible({ timeout: 5000 });
    await expect(slide2).toContainText("Awesome meeting you.");

    // Eventually overlay exits at ~4s + 700ms and reveals the landing page with "Welcome to my website."
    await expect(overlay).not.toBeVisible({ timeout: 7000 });
    await expect(page.getByRole('heading', { name: 'Welcome to my website.' })).toBeVisible();
  });

  test('skipIntro query param bypasses the keynote greeting on mount', async ({ page }) => {
    await page.goto('/?skipIntro=true');

    const overlay = page.locator('[data-testid="keynote-intro-overlay"]');
    await expect(overlay).not.toBeVisible();
    await expect(page.getByRole('heading', { name: 'Welcome to my website.' })).toBeVisible();
  });

  test('navigating away from home and returning does not replay the keynote greeting', async ({ page }) => {
    await page.goto('/');

    const overlay = page.locator('[data-testid="keynote-intro-overlay"]');
    // Wait for the intro to finish on initial mount
    await expect(overlay).not.toBeVisible({ timeout: 8000 });
    await expect(page.getByRole('heading', { name: 'Welcome to my website.' })).toBeVisible();

    // Navigate to "About me"
    const header = page.locator('header');
    const nav = header.locator('nav[aria-label="Main Navigation"]');
    const aboutTrigger = nav.locator('button[aria-label="About me dropdown menu"]');
    const dropdown = page.locator('[data-slot="dropdown-menu-content"]');
    const aboutLink = dropdown.getByRole('link', { name: 'About me' });

    await openDropdownMenu(aboutTrigger, dropdown);
    await expect(aboutLink).toBeVisible();
    await aboutLink.click();
    await expect(page).toHaveURL(/\/about$/);

    // Verify dropdown menu closes after navigation
    await expect(dropdown).not.toBeVisible();

    // Return to home by clicking the Logo
    await header.locator('a[aria-label*="Khalid Al Shareef"]').click({ force: true });
    await expect(page).toHaveURL(/\/$/);

    // Overlay should NOT be visible when returning to home
    await expect(overlay).not.toBeVisible();
    await expect(page.getByRole('heading', { name: 'Welcome to my website.' })).toBeVisible();
  });
});

test.describe('Selection highlight styling tests', () => {
  test('text selection highlight is configured with gray background', async ({ page }) => {
    await page.goto('/about');

    // Verify selection styling rule exists in document or computed pseudo-element
    const hasSelectionRule = await page.evaluate(() => {
      for (const sheet of document.styleSheets) {
        try {
          for (const rule of sheet.cssRules) {
            if (rule.cssText && rule.cssText.includes('::selection')) {
              return true;
            }
          }
        } catch {
          // ignore CORS
        }
      }
      return false;
    });

    expect(hasSelectionRule).toBe(true);
  });
});

test.describe("Products I've built timeline tests", () => {
  test('renders products page with timeline starting from 2024 and shadcn timeline primitives', async ({
    page,
  }) => {
    await page.goto('/products');

    // Check document title
    await expect(page).toHaveTitle("<Products I've built>");

    // Check main heading and lime green highlight on "journey"
    const heading = page.getByRole('heading', { name: /So far the journey\./i });
    await expect(heading).toBeVisible();
    const journeySpan = heading.locator('span', { hasText: 'journey' });
    await expect(journeySpan).toBeVisible();
    await expect(journeySpan).toHaveClass(/text-lime-/);

    // Check adjusted product dates (clean month and year without redundant leading year)
    await expect(page.getByText('June 2026')).toBeVisible();
    await expect(page.getByText('April 2026')).toBeVisible();
    await expect(page.getByText('March 2024')).toBeVisible();

    // Verify shadcn timeline primitive exists
    const timeline = page.locator('[data-slot="timeline"]');
    await expect(timeline).toBeVisible();

    // Check products present in timeline
    await expect(page.getByRole('heading', { name: 'Codeus' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Jarvis Wallet' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Quantum Club' })).toBeVisible();

    // Verify timeline items have connector and point
    const timelineItems = page.locator('[data-slot="timeline-item"]');
    await expect(timelineItems).toHaveCount(3); // Codeus, Jarvis, Quantum Club

    const connectors = page.locator('[data-slot="timeline-connector"]');
    await expect(connectors.first()).toBeVisible();

    const points = page.locator('[data-slot="timeline-point"]');
    await expect(points).toHaveCount(3);
  });

  test('category filters work and update timeline products', async ({ page }) => {
    await page.goto('/products');

    // Filter by "AI & Agents"
    await page.getByRole('tab', { name: /AI & Agents/i }).click();
    await expect(page.getByRole('heading', { name: 'Jarvis Wallet' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Codeus' })).not.toBeVisible();
    await expect(page.getByRole('heading', { name: 'Quantum Club' })).not.toBeVisible();

    // Filter by "Dev Tools"
    await page.getByRole('tab', { name: /Dev Tools/i }).click();
    await expect(page.getByRole('heading', { name: 'Codeus' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Jarvis Wallet' })).not.toBeVisible();
    await expect(page.getByRole('heading', { name: 'Quantum Club' })).not.toBeVisible();

    // Filter by "Web3 & DeFi"
    await page.getByRole('tab', { name: /Web3 & DeFi/i }).click();
    await expect(page.getByRole('heading', { name: 'Quantum Club' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Jarvis Wallet' })).not.toBeVisible();
    await expect(page.getByRole('heading', { name: 'Codeus' })).not.toBeVisible();

    // Reset back to "All Products"
    await page.getByRole('tab', { name: /All Products/i }).click();
    await expect(page.getByRole('heading', { name: 'Codeus' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Jarvis Wallet' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Quantum Club' })).toBeVisible();
  });

  test('sort order toggle switches between newest and oldest first', async ({ page }) => {
    await page.goto('/products');

    const sortButton = page.getByRole('button', { name: /Sort timeline/i });
    await expect(sortButton).toBeVisible();

    // Initially newest first: Codeus (2026), Jarvis Wallet (2026), Quantum Club (2024)
    const titles = page.locator('[data-slot="timeline-title"]');
    await expect(titles.nth(0)).toHaveText('Codeus');
    await expect(titles.nth(2)).toHaveText('Quantum Club');

    // Toggle sort order to oldest first (2024 -> 2026)
    await sortButton.click();
    await expect(sortButton).toContainText('Oldest (2024');

    // In oldest first: Quantum Club (2024) should be first among products
    await expect(titles.nth(0)).toHaveText('Quantum Club');
  });

  test('repositories dropdown opens and displays links for multi-repo products', async ({ page }) => {
    await page.goto('/products');

    const repoButton = page.getByRole('button', { name: 'Repositories for Codeus' });
    await expect(repoButton).toBeVisible();

    // Open dropdown
    await repoButton.click();

    // Dropdown content should display CLI, App, API links
    await expect(page.getByRole('menuitem', { name: /Codeus CLI/i })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: /Codeus App/i })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: /Codeus API/i })).toBeVisible();
  });
});

test.describe('Rotating Welcome in multiple languages tests', () => {
  test('displays rotating welcome word in lime green and cycles through languages', async ({
    page,
  }) => {
    await page.goto('/?skipIntro=true');

    // Heading has accessible name
    const heading = page.getByRole('heading', { name: 'Welcome to my website.' });
    await expect(heading).toBeVisible();

    // Rotating welcome container and word exist
    const welcomeWord = page.locator('[data-testid="rotating-welcome-word"]');
    await expect(welcomeWord).toBeVisible();

    // Initially displays "Welcome" and is colored lime green
    await expect(welcomeWord).toHaveText('Welcome');
    await expect(welcomeWord).toHaveClass(/text-lime-/);

    // Suffix text "to my website." is visible without clipping
    const suffix = page.locator('[data-testid="welcome-suffix"]');
    await expect(suffix).toBeVisible();

    // Verify suffix container does not have overflow-hidden causing descender clipping
    const overflowStyle = await suffix.evaluate((el) => {
      const style = window.getComputedStyle(el);
      const parentStyle = el.parentElement ? window.getComputedStyle(el.parentElement) : null;
      return {
        selfOverflow: style.overflow,
        parentOverflow: parentStyle?.overflow,
        height: el.getBoundingClientRect().height,
      };
    });
    expect(overflowStyle.selfOverflow).not.toBe('hidden');
    expect(overflowStyle.parentOverflow).not.toBe('hidden');

    // After animation interval, cycles to next language (e.g. "Bienvenido")
    await expect(welcomeWord).not.toHaveText('Welcome', { timeout: 6000 });
    await expect(welcomeWord).toHaveClass(/text-lime-/);
  });

  test('clicking rotating welcome container manually cycles to next language', async ({
    page,
  }) => {
    await page.goto('/?skipIntro=true');

    const container = page.locator('[data-testid="rotating-welcome-container"]');
    await expect(container).toBeVisible();

    const welcomeWord = page.locator('[data-testid="rotating-welcome-word"]');
    await expect(welcomeWord).toHaveText('Welcome');

    // Click container to cycle language
    await container.click({ force: true });
    await expect(welcomeWord).toHaveText('Bienvenido');

    // Click container again to cycle to next language (French: "Bienvenue")
    await container.click({ force: true });
    await expect(welcomeWord).toHaveText('Bienvenue');
  });

  test('heading screenshot captures full descenders without any clipping in light and dark mode', async ({ page }) => {
    await page.goto('/?skipIntro=true&pauseTimer=true');
    await page.waitForTimeout(800);
    const heading = page.locator('h1');
    await heading.screenshot({ path: 'test-results/heading-verified-light.png', animations: 'disabled' });

    // Switch to dark mode
    await page.locator('html').evaluate((el) => el.classList.add('dark'));
    await page.waitForTimeout(300);
    await heading.screenshot({ path: 'test-results/heading-verified-dark.png', animations: 'disabled' });
  });
});

test.describe('About me Dropdown & Constitution Page tests', () => {
  test('header about me dropdown menu opens and has two buttons: About me and My constitution', async ({ page }) => {
    await page.goto('/?skipIntro=true');

    const header = page.locator('header');
    const aboutTrigger = header.locator('nav[aria-label="Main Navigation"]').locator('button[aria-label="About me dropdown menu"]');
    await expect(aboutTrigger).toBeVisible();

    const dropdown = page.locator('[data-slot="dropdown-menu-content"]');
    const aboutBtn = dropdown.getByRole('link', { name: 'About me' });
    const constitutionBtn = dropdown.getByRole('link', { name: 'My constitution' });

    await openDropdownMenu(aboutTrigger, dropdown);

    // Verify both items exist in the dropdown
    await expect(aboutBtn).toBeVisible();
    await expect(constitutionBtn).toBeVisible();
  });

  test('constitution page renders operating code, articles, and heuristics', async ({ page }) => {
    await page.goto('/constitution');

    // Verify heading
    const title = page.getByRole('heading', { name: 'My Constitution', exact: true });
    await expect(title).toBeVisible();

    // Verify key articles
    await expect(page.getByRole('heading', { name: 'Extreme Agency & Relentless Shipping' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Relentless Craft & Micro-Precision' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'First-Principles Engineering' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'AI-Native & Compound Leverage' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Sovereignty & Open Ecosystems' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'The Long Game & Radical Integrity' })).toBeVisible();
  });

  test('about me page renders bio, founder info, and background story', async ({ page }) => {
    await page.goto('/about');

    await expect(page.getByRole('heading', { name: /Hey, I'm Khalid Al Shareef/i })).toBeVisible();
    await expect(page.getByText('Anaxonic', { exact: false })).toBeVisible();
    await expect(page.getByText('Electrical & Electronics Engineering', { exact: false })).toBeVisible();
    await expect(page.getByText('engineered a lot of projects', { exact: false })).toBeVisible();
  });
});

test.describe('Resume & CV Page tests (Khalid Al Shareef PDF-based)', () => {
  test('resume page renders full professional experience, projects, skills, and PDF download', async ({ page }) => {
    await page.goto('/resume');

    // Header info
    await expect(page.getByRole('heading', { name: 'KHALID AL SHAREEF' })).toBeVisible();
    await expect(page.getByText('AI Engineer & Full-Stack Developer', { exact: true })).toBeVisible();
    await expect(page.getByText('Ex. Founder and Lead Engineer | Anaxonic')).toBeVisible();
    await expect(page.getByAltText('KHALID AL SHAREEF')).toBeVisible();

    // Contact info
    await expect(page.getByText('Gaziantep, Turkey')).toBeVisible();
    await expect(page.getByText('khalidthenoble@gmail.com')).toBeVisible();
    await expect(page.getByText('+90 501 525 00 45')).toBeVisible();

    // Work Experience
    await expect(page.getByText('Anaxonic | Founder & Lead Engineer')).toBeVisible();
    await expect(page.getByText('Enbis Automation | Automation Systems Engineer Intern')).toBeVisible();
    await expect(page.getByText('Living It English Cafe | Teacher')).toBeVisible();

    // Featured Projects section has been removed from resume
    await expect(page.getByRole('heading', { name: 'Featured Projects' })).not.toBeVisible();

    // Education
    await expect(page.getByText('University of Gaziantep, Gaziantep, TR')).toBeVisible();
    await expect(page.getByText('Applied Linear Algebra')).toBeVisible();

    // Certifications & Extracurricular
    await expect(page.getByText('Practical Automation and PLC Training')).toBeVisible();
    await expect(page.getByText('Odaksan Engineering')).toBeVisible();
    await expect(page.getByText('CTF 3 & CTF 4 Hackathon Competitions')).toBeVisible();

    // Download PDF link
    const downloadBtn = page.getByRole('link', { name: /Download PDF/i });
    await expect(downloadBtn).toBeVisible();
    await expect(downloadBtn).toHaveAttribute('href', '/resume_KhalidAlShareef.pdf');
  });

  test('resume page has functional Print / Save action and does not reveal code (no resume.ts)', async ({ page }) => {
    await page.goto('/resume');

    // Verify resume document header
    await expect(page.getByRole('heading', { name: 'KHALID AL SHAREEF' })).toBeVisible();

    // Verify resume.ts is NOT present (no code revealed)
    await expect(page.getByRole('button', { name: /resume\.ts/i })).not.toBeVisible();
    await expect(page.getByText('khalid-alshareef.resume.ts')).not.toBeVisible();
    await expect(page.getByText('export const khalidAlShareef')).not.toBeVisible();

    // Verify Print / Save button exists and is clickable
    const printBtn = page.getByRole('button', { name: /Print \/ Save/i });
    await expect(printBtn).toBeVisible();

    // Verify window.print is called on click
    await page.evaluate(() => {
      (window as unknown as { __printCalled: boolean }).__printCalled = false;
      window.print = () => {
        (window as unknown as { __printCalled: boolean }).__printCalled = true;
      };
    });
    await printBtn.click();
    const wasCalled = await page.evaluate(() => (window as unknown as { __printCalled: boolean }).__printCalled);
    expect(wasCalled).toBe(true);
  });
});

test.describe('Weber Model Serving (/weber) tests', () => {
  test('/weber page renders correctly with Weber tab title, greeting above input, and dynamic conversation flow', async ({ page }) => {
    await page.goto('/weber');

    // Verify document tab title is strictly "Weber"
    await expect(page).toHaveTitle('Weber');

    // Verify website header and footer are NOT shown on /weber
    await expect(page.locator('header.sticky')).not.toBeVisible();
    await expect(page.locator('footer[aria-label="Site Footer"]')).not.toBeVisible();

    // Verify initial greeting text "Hi Human. What can I do for you today?"
    const greeting = page.getByRole('heading', { name: /Hi Human\. What can I do for you today\?/i });
    await expect(greeting).toBeVisible();

    // Verify "Human" has lime green styling
    const humanSpan = greeting.locator('span');
    await expect(humanSpan).toHaveText('Human');
    await expect(humanSpan).toHaveClass(/lime/);

    // In sidebar, Weber link, Preview badge, and New chat button exist
    const sidebar = page.locator('[data-slot="sidebar"]');
    await expect(sidebar.getByRole('link', { name: /Weber/i })).toBeVisible();
    await expect(sidebar.getByText('Preview')).toBeVisible();
    await expect(sidebar.getByRole('button', { name: /New chat/i })).toBeVisible();

    // Verify top bar buttons (homepage back link exists, new chat is only in sidebar)
    const topBar = page.locator('div.sticky.top-0');
    await expect(topBar.getByRole('button', { name: /New chat/i })).not.toBeVisible();
    await expect(topBar.getByRole('link', { name: /Back to homepage/i })).toBeVisible();

    // Verify placeholder conversations in sidebar are deleted
    await expect(sidebar.getByText('Deploy Jetton Token on TON')).not.toBeVisible();
    await expect(sidebar.getByText('Bonding Curves in DeFi')).not.toBeVisible();
    await expect(sidebar.getByText('FunC Cell Serialization Guide')).not.toBeVisible();
    await expect(sidebar.getByText('No past conversations')).toBeVisible();

    // Verify initial format: conversation bar is directly visible below greeting
    const textarea = page.getByPlaceholder(/Ask me anything/i);
    await expect(textarea).toBeVisible();
    const sendBtn = page.getByTitle(/Send message/i);
    await expect(sendBtn).toBeVisible();

    // Verify shift-enter text is deleted and warning text is rephrased and present
    await expect(page.getByText('Press Enter to send, Shift+Enter for new line')).not.toBeVisible();
    await expect(page.getByText('Weber can make mistakes. Verify facts.')).toBeVisible();

    // Verify starter suggestions are removed
    await expect(page.getByRole('button', { name: /Deploy on TON/i })).not.toBeVisible();

    // User types prompt -> page turns into conversation
    await textarea.click();
    await textarea.pressSequentially('How do I deploy a smart contract on TON?');
    await expect(sendBtn).toBeEnabled();
    await sendBtn.click();

    // The page turns into a conversation: greeting is replaced by conversation thread
    await expect(page.getByRole('heading', { name: /Hi Human\. What can I do for you today\?/i })).not.toBeVisible();
    await expect(page.getByRole('paragraph').filter({ hasText: 'How do I deploy a smart' }).first()).toBeVisible();

    // The conversation is stored in the sidebar
    await expect(sidebar.getByText(/How do I deploy a smart contract/i)).toBeVisible();

    // Clicking New chat in sidebar returns to initial greeting format
    await sidebar.getByRole('button', { name: /New chat/i }).click();
    await expect(page.getByRole('heading', { name: /Hi Human\. What can I do for you today\?/i })).toBeVisible();
  });

  test('Navbar Try Weber button navigates to /weber', async ({ page }) => {
    await page.goto('/?skipIntro=true');

    const weberBtn = page.locator('header').getByRole('link', { name: /Try Weber/i });
    await expect(weberBtn).toBeVisible();
    await page.waitForLoadState('domcontentloaded');
    await weberBtn.click();
    await expect(page).toHaveURL(/\/weber$/);
    await expect(page).toHaveTitle('Weber');
    await expect(page.getByRole('heading', { name: /Hi Human\. What can I do for you today\?/i })).toBeVisible();
  });

  test('clear command behavior: disabled when no messages, word highlighted and shadcn toast on clear when active', async ({ page }) => {
    // Mock /api/chat so the test doesn't depend on external network/API latency
    await page.route('/api/chat', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'text/event-stream',
        body: 'data: {"text":"Hello! I am Weber."}\n\ndata: [DONE]\n\n',
      });
    });

    await page.goto('/weber');

    const textarea = page.getByPlaceholder(/Ask me anything/i);
    await expect(textarea).toBeVisible();

    // 1. Initial screen with no messages: typing "clear" should NOT trigger clear command
    await textarea.fill('clear');
    // Command badge must NOT be visible
    await expect(page.getByText('command')).not.toBeVisible();
    // Textarea must NOT be highlighted with emerald color
    await expect(textarea).not.toHaveClass(/text-emerald/);

    // Clear the input and send a real message to start conversation
    await textarea.click();
    await textarea.fill('');
    await textarea.pressSequentially('Hello Weber');
    const sendBtn = page.getByRole('button', { name: /Send message/i });
    await expect(sendBtn).toBeEnabled();
    await sendBtn.click();

    // Wait for the conversation view to appear
    await expect(page.getByRole('heading', { name: /Hi Human\. What can I do for you today\?/i })).not.toBeVisible();
    await expect(page.getByRole('region', { name: 'Messages' }).getByText('Hello Weber')).toBeVisible();

    // 2. Active conversation: typing "clear" should highlight only the word and have no command badge
    const activeTextarea = page.getByPlaceholder(/Ask me anything/i);
    await activeTextarea.click();
    await activeTextarea.pressSequentially('clear');

    // Command badge must NOT be visible
    await expect(page.getByText('command')).not.toBeVisible();

    // Word must be highlighted (emerald font)
    await expect(activeTextarea).toHaveClass(/text-emerald/);

    // 3. Submitting clear command: clears messages and shows shadcn toast
    await activeTextarea.press('Enter');

    // Initial greeting reappears
    await expect(page.getByRole('heading', { name: /Hi Human\. What can I do for you today\?/i })).toBeVisible({ timeout: 5000 });

    // Shadcn sonner toast appears with "chat cleared"
    const toast = page.locator('[data-sonner-toast]');
    await expect(toast).toBeVisible();
    await expect(toast.getByText('chat cleared', { exact: false })).toBeVisible();
  });
});





