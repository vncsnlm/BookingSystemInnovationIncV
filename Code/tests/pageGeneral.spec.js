const { test, expect } = require('@playwright/test');

test('Title', async ({ page }) => {
    await page.goto('http://127.0.0.1:3000');
  
    // Expect a title "to contain" a substring
    await expect(page).toHaveTitle(/App/);
  });
  
  //This test should make sure title is not fail
  test('Test to fail title', async ({ page }) => {
    await page.goto('http://127.0.0.1:3000');
  
    await expect(page).not.toHaveTitle(/Fail/);
    //.toBeFalsy()
  });

  //Make sure that booking page exist
test('Booking pages', async ({ page }) => {
    await page.goto('http://127.0.0.1:3000/booking');
  });
  
  //Make sure that admin page exist
  test('Admin page', async ({ page }) => {
    await page.goto('http://127.0.0.1:3000/admin');
  });
  
  //This test should make sure it redirects to 404 page if the page does not exist
  test('404 page', async ({ page }) => {
    await page.goto('http://127.0.0.1:3000/goto404');
    
    await expect(page).toHaveTitle(/404/);
  });