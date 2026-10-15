const request = require('supertest');
const app = require('../server');

describe('Prometheus Metrics Endpoint Verification', () => {
  it('GET /metrics should return 200 OK with Prometheus formatted metrics', async () => {
    // 1. Send a request to an endpoint to populate metrics
    await request(app).get('/api/health');

    // 2. Query /metrics
    const response = await request(app).get('/metrics');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('text/plain');
    expect(response.text).toContain('godevops_http_requests_total');
    expect(response.text).toContain('godevops_http_request_duration_seconds');
    expect(response.text).toContain('nodejs_heap_size_used_bytes');
  });
});
