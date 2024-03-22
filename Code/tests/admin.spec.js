const { test, expect } = require('@playwright/test');


test('Test refresh button exists', async ({ page }) => {
    await page.goto('http://localhost:3000/admin');
    await page.getByRole('button', { name: 'Refresh' }).click();
  });