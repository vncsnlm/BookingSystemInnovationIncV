// @ts-check
const { test, expect } = require('@playwright/test');

//npx playwright test

test('Exists', async ({ page }) => {
  await page.goto('http://127.0.0.1:3000');
});