// @ts-check
const { test, expect } = require('@playwright/test');

//npx playwright test

test('has title', async ({ page }) => {
  await page.goto('https://localhost:3000/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Calendar App/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://localhost:3000/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
