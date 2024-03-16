// @ts-check
const { test, expect } = require('@playwright/test');

//npx playwright test
//npx playwright codegen localhost:3000

//This test should make sure it redirects to 404 page
test('Test to fail api/events page', async ({ page }) => {
  await page.goto('http://127.0.0.1:3000/api/events');
});

test('Calender today button', async ({ page }) => {
  await page.goto('http://127.0.0.1:3000/booking');

  const locator = page.locator('draganddropcalendar');
  await expect(locator).toHaveText(/Today/);
});

//Make sure the link to booking page works, but link should only work if you are logged in
test('Hidden link to booking page', async ({ page }) => {
  await page.goto('http://127.0.0.1:3000/booking');

  const locator = page.locator('go-to-booking-page');
  await expect(locator).not.toBeVisible()
  //toHaveText(/Go create a booking/);
});

test('Navbar link to booking page working', async ({ page }) => {
  await page.goto('http://127.0.0.1:3000/');

  const locator = page.locator('go-to-booking-page-from-navbar');
  await locator.click();

  await expect(page).toHaveTitle(/Booking/);
});

test('Navbar link to booking page working alt', async ({ page }) => {
  await page.goto('http://127.0.0.1:3000/');

  await page.click('text=BOOK NOW')

  await expect(page).toHaveURL('http://127.0.0.1:3000/booking')
});

test('Login button', async ({ page }) => {
  await page.goto('http://127.0.0.1:3000');

  const locator = page.locator('div');
  await expect(locator).toHaveText(/Admin sections/);
});