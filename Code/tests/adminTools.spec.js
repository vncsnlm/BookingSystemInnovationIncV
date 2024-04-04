const { test, expect } = require('@playwright/test');

//This test might be able to randomly fail for firefox
test('Admin tool default name button full', async ({ page }) => {
    await page.goto('http://localhost:3000/admin');
    await page.getByText('11:00 AM – 11:30 AMvictor1:30').click();
    await page.getByRole('button').first().click();
    await expect(page.getByRole('button', { name: 'Default' })).toBeVisible();
    await page.getByRole('button', { name: 'Default' }).click();
    //await page.getByPlaceholder('Client name').click();
    await expect(page.getByPlaceholder('Client name')).toHaveValue('Reserved');
  });

test('Admin tool default name button exists', async ({ page }) => {
    await page.goto('http://localhost:3000/admin');
    await page.getByText('11:00 AM – 11:30 AMvictor1:30').click();
    await expect(page.getByRole('button', { name: 'Default' })).toBeVisible();
  });

test('Admin tool default name button works', async ({ page }) => {
    await page.goto('http://localhost:3000/admin');
    await page.getByText('11:00 AM – 11:30 AMvictor1:30').click();
    await page.getByRole('button', { name: 'Default' }).click();
    //await page.getByPlaceholder('Client name').click();
    await expect(page.getByPlaceholder('Client name')).toHaveValue('Reserved');
  });