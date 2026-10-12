const request = require('supertest');
const app = require('../server');

describe('Health Check API Endpoint', () => {
  it('GET /api/health should return HTTP 200 and operational status', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'OK');
    expect(response.body).toHaveProperty('message', 'GoDevOps API is running');
    expect(response.body).toHaveProperty('timestamp');
  });

  it('GET /api/unknown-route should return HTTP 404 Route not found', async () => {
    const response = await request(app).get('/api/unknown-nonexistent-route');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Route not found');
  });
});
