const request = require('supertest');
const app = require('../server');

describe('Authentication Validation Security Tests', () => {
  it('POST /api/auth/register should reject empty payload with 400 Bad Request', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Validation failed');
    expect(Array.isArray(response.body.errors)).toBe(true);
  });

  it('POST /api/auth/register should reject weak password missing complexity requirements', async () => {
    const weakUser = {
      name: 'Test Cadet',
      email: 'cadet@godevops.com',
      password: 'weakpassword' // Missing uppercase, number, special char
    };

    const response = await request(app)
      .post('/api/auth/register')
      .send(weakUser);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Validation failed');
    const passwordError = response.body.errors.find(e => e.path === 'password');
    expect(passwordError).toBeDefined();
    expect(passwordError.msg).toContain('Password must contain at least one uppercase');
  });

  it('POST /api/auth/register should reject invalid email format', async () => {
    const invalidEmailUser = {
      name: 'Test Cadet',
      email: 'not-a-valid-email',
      password: 'SecurePassword123!'
    };

    const response = await request(app)
      .post('/api/auth/register')
      .send(invalidEmailUser);

    expect(response.status).toBe(400);
    const emailError = response.body.errors.find(e => e.path === 'email');
    expect(emailError).toBeDefined();
  });
});
