const { test, expect } = require('@playwright/test');

test('Navbar link to booking page correct text', async ({ page }) => {
    await page.goto('http://127.0.0.1:3000/booking');
  
    const locator = page.locator('go-to-booking-page-from-navbar');
    await expect(locator).toHaveText(/BOOK NOW/);
  });
  
  test('Calender basic text', async ({ page }) => {
    await page.goto('http://127.0.0.1:3000/booking');
  
    const locator = page.locator('Custom Calendar');
    await expect(locator).toHaveText(/Today/);
  });

  test('Booking pull up exists', async ({ page }) => {
    await page.goto('http://localhost:3000/booking');
    await page.locator('div:nth-child(8) > div:nth-child(25) > .rbc-events-container').click();
    await expect(page.getByLabel('Client Name *')).toBeVisible();
    await expect(page.getByRole('combobox')).toBeVisible();
    await page.getByRole('button').first().click();
  });