// @ts-check
const { test, expect } = require('@playwright/test');

//npx playwright test

//This test should not be capable of failing
test('Exists', async ({ page }) => {
  await page.goto('http://127.0.0.1:3000');
});

test('Title', async ({ page }) => {
  await page.goto('http://127.0.0.1:3000');

  // Expect a title "to contain" a substring
  await expect(page).toHaveTitle(/App/);
});

test('Test to fail title', async ({ page }) => {
  await page.goto('http://127.0.0.1:3000');

  // Expect a title "to contain" a substring
  await expect(page).toHaveTitle(/Fail/);
  //.toBeFalsy()
});

test('Booking pages', async ({ page }) => {
  await page.goto('http://127.0.0.1:3000/booking');
});

test('Admin page', async ({ page }) => {
  await page.goto('http://127.0.0.1:3000/admin');
});

test('404 page', async ({ page }) => {
  await page.goto('http://127.0.0.1:3000/goto404');
});

test('Calender today button', async ({ page }) => {
  await page.goto('http://127.0.0.1:3000/booking');

  const locator = page.locator('draganddropcalendar');
  await expect(locator).toHaveText(/Today/);
});

test('Calender basic text', async ({ page }) => {
  await page.goto('http://127.0.0.1:3000/admin');

  const locator = page.locator('div');
  await expect(locator).toHaveText(/Admin sections/);
});