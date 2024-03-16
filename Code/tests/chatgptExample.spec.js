const { test, expect } = require('@playwright/test');

test.describe('Navbar', () => {
  let browser;
  let page;

  test.beforeAll(async () => {
    browser = await test.playwright.chromium.launch();
  });

  test.beforeEach(async () => {
    page = await browser.newPage();
    await page.goto('http://localhost:3000'); // Adjust URL as needed
  });

  test.afterEach(async () => {
    await page.close();
  });

  test.afterAll(async () => {
    await browser.close();
  });

  test('should display the logo', async () => {
    const logo = await page.waitForSelector('img[alt="Ka\'an Massage and Beauty"]');
    expect(logo).not.toBeNull();
  });

  test('should navigate to the correct page when a menu item is clicked', async () => {
    await page.click('text=ABOUT');
    await page.waitForNavigation();
    expect(page.url()).toContain('/about');
  });

  test('should navigate to the booking page when "BOOK NOW" button is clicked', async () => {
    await Promise.all([
      page.waitForNavigation(),
      page.click('#go-to-booking-page-from-navbar')
    ]);
    expect(page.url()).toContain('/booking');
  });

  // Add more test cases as needed
});
