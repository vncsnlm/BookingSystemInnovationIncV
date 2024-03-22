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

test('Log in test 2', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Log in' }).click();
  await page.getByLabel('Email address').click();
  await page.getByLabel('Email address').fill('your@email.com');
  await page.getByLabel('Password').click();
  await page.getByLabel('Password').fill('passwordExample0)');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(page).toHaveURL('http://localhost:3000/')
});

//Currently fails because the URL changes and it need the exist URL
test('Log in fail test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Log in' }).click();
  await expect(page).toHaveURL('https://dev-s0m58ukmiyevj58p.us.auth0.com/u/login?state=hKFo2SBRbnc4MTA1RG9Fak1sVW9PR29taU02OFlrVktMVl9sd6Fur3VuaXZlcnNhbC1sb2dpbqN0aWTZIHBRX29ISXY2Wk9ZYmdJaS1EdWNQSzYyV242aXJJejZmo2NpZNkgREE2eTI3ZEVEY2xGVTlQU213MERUdzNXaWpCZm1kQ3U')
  await page.getByLabel('Email address').click();
  await page.getByLabel('Email address').fill('your@email.com');
  await page.getByLabel('Password').click();
  await page.getByLabel('Password').fill('notThePassword');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(page).toHaveURL('https://dev-s0m58ukmiyevj58p.us.auth0.com/u/login?state=hKFo2SBRbnc4MTA1RG9Fak1sVW9PR29taU02OFlrVktMVl9sd6Fur3VuaXZlcnNhbC1sb2dpbqN0aWTZIHBRX29ISXY2Wk9ZYmdJaS1EdWNQSzYyV242aXJJejZmo2NpZNkgREE2eTI3ZEVEY2xGVTlQU213MERUdzNXaWpCZm1kQ3U')
});

//Will work because it test that not taken back to mainpage
test('Log in fail test 2', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Log in' }).click();
  await page.getByLabel('Email address').click();
  await page.getByLabel('Email address').fill('your@email.com');
  await page.getByLabel('Password').click();
  await page.getByLabel('Password').fill('notThePassword');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(page).not.toHaveURL('http://localhost:3000/')
});

//Make sure you leave localhost:3000
test('Go to Auth0 page', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Log in' }).click();
  await expect(page).not.toHaveURL('http://localhost:3000/')
})

test('Login button', async ({ page }) => {
  await page.goto('http://127.0.0.1:3000');

  await expect(page.getByRole('link', { name: 'Log in' })).toBeVisible();
});

test('Login with google available', async ({ page }) => {
  await page.goto('http://127.0.0.1:3000');

  await page.getByRole('link', { name: 'Log in' }).click();
  await expect(page.getByRole('button', { name: 'Continue with Google' })).toBeVisible();
});

test('Login with google sign in', async ({ page }) => {
  await page.goto('http://127.0.0.1:3000');

  await page.getByRole('link', { name: 'Log in' }).click();
  await page.getByRole('button', { name: 'Continue with Google' }).click();
});

test('Login with facebook available', async ({ page }) => {
  await page.goto('http://127.0.0.1:3000');

  await page.getByRole('link', { name: 'Log in' }).click();
  await expect(page.getByRole('button', { name: 'Continue with Facebook' })).toBeVisible();
});

test('Login with facebook sign in', async ({ page }) => {
  await page.goto('http://127.0.0.1:3000');

  await page.getByRole('link', { name: 'Log in' }).click();
  await page.getByRole('button', { name: 'Continue with Facebook' }).click();
});