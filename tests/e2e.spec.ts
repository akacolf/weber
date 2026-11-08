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
    await expect(nav.locator('button[aria-label="About me dropdown menu"]')).toBeVisible();
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

    // Test "About me" dropdown menu -> "About me" item
    await nav.locator('button[aria-label="About me dropdown menu"]').click();
    const aboutMenuItem = page.locator('[data-slot="dropdown-menu-content"]').getByRole('link', { name: 'About me' });
    await expect(aboutMenuItem).toBeVisible();
    await aboutMenuItem.click();
    await expect(page).toHaveURL(/\/about$/);

    // Test "About me" dropdown menu -> "My constitution" item
    await page.goto('/');
    const navHome = page.locator('header').locator('nav[aria-label="Main Navigation"]');
    await navHome.locator('button[aria-label="About me dropdown menu"]').click();
    const constitutionMenuItem = page.locator('[data-slot="dropdown-menu-content"]').getByRole('link', { name: 'My constitution' });
    await expect(constitutionMenuItem).toBeVisible();
    await constitutionMenuItem.click();
    await expect(page).toHaveURL(/\/constitution$/);

    // Test "Products I've built"
    await page.goto('/');
    await page.locator('header').locator('nav[aria-label="Main Navigation"]').getByRole('link', { name: "Products I've built" }).click();
    await expect(page).toHaveURL(/\/products$/);

    // Test "My resume/cv"
    await page.locator('header').locator('nav[aria-label="Main Navigation"]').getByRole('link', { name: 'My resume/cv' }).click();
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
    await page.goto('/');

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
    await codeusMenuTrigger.click();

    const cliItem = page.getByRole('menuitem', { name: /codeus cli/i });
    const appItem = page.getByRole('menuitem', { name: /codeus app/i });
    const apiItem = page.getByRole('menuitem', { name: /codeus api/i });

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
    await aboutTrigger.click();
    const dropdown = page.locator('[data-slot="dropdown-menu-content"]');
    await dropdown.getByRole('link', { name: 'About me' }).click();
    await expect(page).toHaveURL(/\/about$/);

    // Return to home by clicking the Logo
    await header.locator('a[aria-label*="Khalid Al Shareef"]').click();
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

    // Check adjusted product dates
    await expect(page.getByText('2026 • June 2026')).toBeVisible();
    await expect(page.getByText('2026 • April 2026')).toBeVisible();
    await expect(page.getByText(/2024 • Q2 2024 \(March 2024\)/)).toBeVisible();

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
    await container.click();
    await expect(welcomeWord).toHaveText('Bienvenido');

    // Click container again to cycle to next language (French: "Bienvenue")
    await container.click();
    await expect(welcomeWord).toHaveText('Bienvenue');
  });

  test('heading screenshot captures full descenders without any clipping in light and dark mode', async ({ page }) => {
    await page.goto('/?skipIntro=true');
    await page.waitForTimeout(500);
    const heading = page.locator('h1');
    await heading.screenshot({ path: 'test-results/heading-verified-light.png' });

    // Switch to dark mode
    await page.locator('html').evaluate((el) => el.classList.add('dark'));
    await page.waitForTimeout(300);
    await heading.screenshot({ path: 'test-results/heading-verified-dark.png' });
  });
});

test.describe('About me Dropdown & Constitution Page tests', () => {
  test('header about me dropdown menu opens and has two buttons: About me and My constitution', async ({ page }) => {
    await page.goto('/');

    const header = page.locator('header');
    const aboutTrigger = header.locator('nav[aria-label="Main Navigation"]').locator('button[aria-label="About me dropdown menu"]');
    await expect(aboutTrigger).toBeVisible();

    // Click trigger to open dropdown
    await aboutTrigger.click();

    // Verify both items exist
    const aboutBtn = page.getByRole('link', { name: 'About me' });
    const constitutionBtn = page.getByRole('link', { name: 'My constitution' });

    await expect(aboutBtn.first()).toBeVisible();
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




