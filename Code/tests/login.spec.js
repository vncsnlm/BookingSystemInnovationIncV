import { test, expect } from '@playwright/test';

test('Attempt to sign in test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Log in' }).click();
  await page.getByLabel('Email address').click();
  await page.getByLabel('Email address').fill('your@email.com');
  await page.getByLabel('Password').click();
  await page.getByLabel('Password').fill('password');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
});

//Currently fails but is mostly wokring
test('Log in test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Log in' }).click();
  await page.getByLabel('Email address').click();
  await page.getByLabel('Email address').fill('your@email.com');
  await page.getByLabel('Password').click();
  await page.getByLabel('Password').fill('passwordExample0)');
  await page.getByRole('button', { name: 'Show password' }).click();
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
});

test('Test next button in calendar', async ({ page }) => {
  await page.goto('http://localhost:3000/booking');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
})