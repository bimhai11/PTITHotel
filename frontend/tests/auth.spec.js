import { test, expect } from '@playwright/test';

const profile = { id: 1, email: 'student@example.com', createdAtUtc: '2026-11-17T00:00:00Z' };

async function mockAuth(page) {
  let signedIn = false;
  const registrations = [];
  await page.route('**/api/auth/**', async route => {
    const endpoint = new URL(route.request().url()).pathname.split('/').pop();
    if (endpoint === 'me') return route.fulfill({ status: signedIn ? 200 : 401, json: signedIn ? profile : {} });
    if (endpoint === 'register') {
      registrations.push(route.request().postDataJSON());
      return route.fulfill({ status: 201, json: profile });
    }
    if (endpoint === 'login') {
      if (route.request().postDataJSON().password !== 'Correct password 123!')
        return route.fulfill({ status: 401, json: { message: 'Email hoặc mật khẩu không đúng.' } });
      signedIn = true;
      return route.fulfill({ json: profile });
    }
    signedIn = false;
    return route.fulfill({ status: 204 });
  });
  return registrations;
}

async function fillCredentials(page, password = 'Correct password 123!') {
  await page.getByLabel('Email', { exact: true }).fill(profile.email);
  await page.getByLabel('Mật khẩu', { exact: true }).fill(password);
}

test('registration, login, persisted profile, reload and logout', async ({ page }) => {
  const registrations = await mockAuth(page);
  await page.goto('/register');
  await fillCredentials(page);
  await page.getByLabel('Xác nhận mật khẩu').fill('mismatched');
  await page.getByRole('button', { name: 'Đăng ký', exact: true }).click();
  await expect(page.getByText('Mật khẩu xác nhận không khớp.')).toBeVisible();
  expect(registrations).toHaveLength(0);
  await page.getByLabel('Xác nhận mật khẩu').fill('Correct password 123!');
  await page.getByRole('button', { name: 'Đăng ký', exact: true }).click();
  await expect(page).toHaveURL('/login');
  await expect(page.getByRole('status')).toContainText('Đăng ký thành công');
  expect(registrations).toHaveLength(1);
  await fillCredentials(page, 'Wrong password 123!');
  await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Email hoặc mật khẩu không đúng');
  await page.getByLabel('Mật khẩu', { exact: true }).fill('Correct password 123!');
  await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
  await expect(page).toHaveURL('/account');
  await expect(page.getByText(profile.email, { exact: true })).toBeVisible();
  const cached = await page.evaluate(() => JSON.parse(localStorage.getItem('ptithotel.user')));
  expect(cached).toEqual(profile);
  expect(JSON.stringify(cached)).not.toContain('password');
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Tài khoản của bạn' })).toBeVisible();
  await page.getByRole('button', { name: 'Đăng xuất' }).click();
  await expect(page).toHaveURL('/login');
  expect(await page.evaluate(() => localStorage.getItem('ptithotel.user'))).toBeNull();
  await page.goto('/account');
  await expect(page).toHaveURL('/login');
});

test('invalid input stays on form and cached profile cannot grant access', async ({ page }) => {
  await mockAuth(page);
  await page.addInitScript(profile => localStorage.setItem('ptithotel.user', JSON.stringify(profile)), profile);
  await page.goto('/account');
  await expect(page).toHaveURL('/login');
  expect(await page.evaluate(() => localStorage.getItem('ptithotel.user'))).toBeNull();
  await page.getByLabel('Email', { exact: true }).fill('not-an-email');
  await page.getByLabel('Mật khẩu', { exact: true }).fill('short');
  await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
  await expect(page.getByText('Vui lòng nhập email hợp lệ (tối đa 254 ký tự).')).toBeVisible();
  await expect(page.getByText('Mật khẩu phải có từ 8 đến 128 ký tự.')).toBeVisible();
});

test('registration conflict is shown and submit becomes available again', async ({ page }) => {
  await mockAuth(page);
  await page.route('**/api/auth/register', route => route.fulfill({ status: 409, json: { message: 'Email đã được đăng ký.' } }));
  await page.goto('/register');
  await fillCredentials(page);
  await page.getByLabel('Xác nhận mật khẩu').fill('Correct password 123!');
  await page.getByRole('button', { name: 'Đăng ký', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Email đã được đăng ký.');
  await expect(page.getByRole('button', { name: 'Đăng ký', exact: true })).toBeEnabled();
});
