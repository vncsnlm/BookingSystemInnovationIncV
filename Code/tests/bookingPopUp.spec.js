const { test, expect } = require('@playwright/test');

test('Booking popup full', async ({ page }) => {
    await page.goto('http://localhost:3000/booking');
    await page.locator('div:nth-child(8) > div:nth-child(25) > .rbc-events-container').click();
    await expect(page.getByLabel('Client Name *')).toBeVisible();
    await expect(page.getByRole('combobox')).toBeVisible();
    await expect(page.locator('div').filter({ hasText: /^Confirm$/ })).toBeVisible();
    //await expect(page.getByText('Thursday, March 28, 2024 ,')).toBeVisible();//This test is expected to fail later
    await expect(page.getByRole('button').first()).toBeVisible();
  });

test('Booking popup client name', async ({ page }) => {
    await page.goto('http://localhost:3000/booking');
    await page.locator('div:nth-child(8) > div:nth-child(25) > .rbc-events-container').click();
    await expect(page.getByLabel('Client Name *')).toBeVisible();
  });

test('Booking popup massage types', async ({ page }) => {
    await page.goto('http://localhost:3000/booking');
    await page.locator('div:nth-child(8) > div:nth-child(25) > .rbc-events-container').click();
    await expect(page.getByRole('combobox')).toBeVisible();
  });

test('Booking popup confirm button', async ({ page }) => {
    await page.goto('http://localhost:3000/booking');
    await page.locator('div:nth-child(8) > div:nth-child(25) > .rbc-events-container').click();
    await expect(page.locator('div').filter({ hasText: /^Confirm$/ })).toBeVisible();
  });

//This test will not work right now due to it checking the current date, will need to be reworked or moving time to a variable
test('Booking popup tell time', async ({ page }) => {
    await page.goto('http://localhost:3000/booking');
    await page.locator('div:nth-child(8) > div:nth-child(25) > .rbc-events-container').click();
    await expect(page.getByText('Thursday, March 28, 2024 ,')).toBeVisible();
  });

test('Booking popup close button', async ({ page }) => {
    await page.goto('http://localhost:3000/booking');
    await page.locator('div:nth-child(8) > div:nth-child(25) > .rbc-events-container').click();
    await expect(page.getByRole('button').first()).toBeVisible();
  });

  