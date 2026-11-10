import { test, expect } from '@playwright/test';

test.describe('Contact Form Rate Limiting', () => {
  test('enforces rate limit on repeated submissions and returns 429', async ({ request }) => {
    // Use a unique IP for this test run to avoid cross-test contamination
    const uniqueIp = `198.51.100.${Math.floor(Math.random() * 200) + 10}`;

    const payload = {
      name: 'Rate Limit Tester',
      email: 'tester@example.com',
      subject: 'Security Assessment',
      message: 'Testing API rate limiting threshold compliance.',
      captchaToken: 'test-captcha-token',
      captchaAnswer: '12345',
    };

    // First 5 requests within the window should succeed
    for (let i = 1; i <= 5; i++) {
      const response = await request.post('/api/contact', {
        data: payload,
        headers: {
          'x-forwarded-for': uniqueIp,
        },
      });

      expect(response.status()).toBe(200);
      const remainingHeader = response.headers()['x-ratelimit-remaining'];
      expect(remainingHeader).toBe(String(5 - i));
    }

    // 6th request should be rate-limited with HTTP 429
    const blockedResponse = await request.post('/api/contact', {
      data: payload,
      headers: {
        'x-forwarded-for': uniqueIp,
      },
    });

    expect(blockedResponse.status()).toBe(429);
    expect(blockedResponse.headers()['retry-after']).toBeDefined();
    expect(blockedResponse.headers()['x-ratelimit-remaining']).toBe('0');

    const errorJson = await blockedResponse.json();
    expect(errorJson.error).toMatch(/too many requests/i);
    expect(errorJson.retryAfter).toBeGreaterThan(0);
  });

  test('contact UI displays rate limit alert error when 429 is encountered', async ({ page }) => {
    // Mock the contact API to return 429 Too Many Requests
    await page.route('**/api/contact', async (route) => {
      await route.fulfill({
        status: 429,
        contentType: 'application/json',
        headers: {
          'Retry-After': '3600',
          'X-RateLimit-Limit': '5',
          'X-RateLimit-Remaining': '0',
        },
        body: JSON.stringify({
          error: 'Too many requests. Please wait 1 hour before submitting another message.',
          retryAfter: 3600,
        }),
      });
    });

    await page.goto('/contact?skipIntro=true');
    await page.waitForLoadState('networkidle');

    const nameInput = page.locator('#name');
    await expect(nameInput).toBeVisible();
    await nameInput.click();
    await nameInput.fill('Grace Hopper');
    await expect(nameInput).toHaveValue('Grace Hopper');

    const emailInput = page.locator('#email');
    await emailInput.click();
    await emailInput.fill('grace@navy.mil');
    await expect(emailInput).toHaveValue('grace@navy.mil');

    const subjectInput = page.locator('#subject');
    await subjectInput.click();
    await subjectInput.fill('Compiler Inquiry');

    const messageInput = page.locator('#message');
    await messageInput.click();
    await messageInput.fill('Checking that client-side rate limit messaging renders properly.');
    await expect(messageInput).toHaveValue('Checking that client-side rate limit messaging renders properly.');

    const captchaInput = page.locator('#captchaAnswer');
    await captchaInput.fill('15');

    await page.getByRole('button', { name: /Send message/i }).click();

    // Verify error alert is rendered with the rate limit notice
    const errorAlert = page.locator('[data-testid="contact-error-alert"]');
    await expect(errorAlert).toBeVisible();
    await expect(errorAlert).toContainText(/Too many requests/i);

    // Ensure success card is NOT displayed
    const successCard = page.locator('[data-testid="contact-success-state"]');
    await expect(successCard).not.toBeVisible();
  });
});
