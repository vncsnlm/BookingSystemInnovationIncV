const { test, expect } = require('@playwright/test');

test('Test refresh button exists', async ({ page }) => {
    await page.goto('http://localhost:3000/admin');
    await page.getByRole('button', { name: 'Refresh' }).click();
  });

test('Admin empty name', async ({ page }) => {
    await page.goto('http://localhost:3000/admin');
    await page.getByText('11:00 AM – 11:30 AMvictor1:30').click();
    await expect(page.getByPlaceholder('Client name')).toHaveValue('');
  });