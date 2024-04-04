const { test, expect } = require('@playwright/test');

//npx playwright test

//This test should not be capable of failing
test('Exists', async ({ page }) => {
  await page.goto('http://127.0.0.1:3000');
});

test('Test next button in calendar', async ({ page }) => {
  await page.goto('http://localhost:3000/booking');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
})