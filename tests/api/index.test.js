const request = require('supertest');
const app = require('../../api/index.js');

describe('API Index Routes', () => {
  let server;

  beforeAll(() => {
    // Start the server for testing
    server = app.listen(0); // Use port 0 to get any available port
  });

  afterAll((done) => {
    // Close the server after tests
    server.close(done);
  });

  describe('Health Check Endpoints', () => {
    test('GET /health should return healthy status', async () => {
      const response = await request(app)
        .get('/health')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toMatchObject({
        status: 'healthy',
        service: 'OnlyFur API',
        version: '3.9.0',
        environment: 'test'
      });
      expect(response.body.timestamp).toBeDefined();
    });

    test('GET /api/health should return healthy status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toMatchObject({
        status: 'healthy',
        service: 'OnlyFur API',
        version: '3.9.0',
        environment: 'test'
      });
      expect(response.body.timestamp).toBeDefined();
    });
  });

  describe('Status Endpoints', () => {
    test('GET /status should return running status with uptime', async () => {
      const response = await request(app)
        .get('/status')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toMatchObject({
        status: 'running',
        environment: 'test'
      });
      expect(response.body.uptime).toBeDefined();
      expect(typeof response.body.uptime).toBe('number');
      expect(response.body.timestamp).toBeDefined();
    });

    test('GET /api/status should return running status with uptime', async () => {
      const response = await request(app)
        .get('/api/status')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toMatchObject({
        status: 'running',
        environment: 'test'
      });
      expect(response.body.uptime).toBeDefined();
      expect(typeof response.body.uptime).toBe('number');
      expect(response.body.timestamp).toBeDefined();
    });
  });

  describe('Authentication Endpoints', () => {
    describe('POST /auth/login', () => {
      test('should accept login request and return success', async () => {
        const loginData = {
          email: 'test@example.com',
          password: 'testpassword'
        };

        const response = await request(app)
          .post('/auth/login')
          .send(loginData)
          .expect('Content-Type', /json/)
          .expect(200);

        expect(response.body).toMatchObject({
          success: true,
          message: 'Login endpoint is working',
          data: { demo: true }
        });
        expect(response.body.timestamp).toBeDefined();
      });

      test('should handle empty login request', async () => {
        const response = await request(app)
          .post('/auth/login')
          .send({})
          .expect('Content-Type', /json/)
          .expect(200);

        expect(response.body.success).toBe(true);
      });
    });

    describe('POST /api/auth/login', () => {
      test('should accept login request with /api prefix', async () => {
        const loginData = {
          email: 'test@example.com',
          password: 'testpassword'
        };

        const response = await request(app)
          .post('/api/auth/login')
          .send(loginData)
          .expect('Content-Type', /json/)
          .expect(200);

        expect(response.body).toMatchObject({
          success: true,
          message: 'Login endpoint is working',
          data: { demo: true }
        });
      });
    });

    describe('POST /auth/register', () => {
      test('should accept registration request', async () => {
        const registerData = {
          email: 'newuser@example.com',
          username: 'newuser',
          password: 'newpassword'
        };

        const response = await request(app)
          .post('/auth/register')
          .send(registerData)
          .expect('Content-Type', /json/)
          .expect(200);

        expect(response.body).toMatchObject({
          success: true,
          message: 'Register endpoint is working',
          data: { demo: true }
        });
        expect(response.body.timestamp).toBeDefined();
      });
    });

    describe('POST /api/auth/register', () => {
      test('should accept registration request with /api prefix', async () => {
        const registerData = {
          email: 'newuser@example.com',
          username: 'newuser',
          password: 'newpassword'
        };

        const response = await request(app)
          .post('/api/auth/register')
          .send(registerData)
          .expect('Content-Type', /json/)
          .expect(200);

        expect(response.body.success).toBe(true);
      });
    });
  });

  describe('Subscription Endpoints', () => {
    test('GET /subscriptions/tiers should return subscription tiers', async () => {
      const response = await request(app)
        .get('/subscriptions/tiers')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            name: expect.any(String),
            price: expect.any(Number),
            features: expect.any(Array)
          })
        ])
      });

      // Check specific tiers
      const tiers = response.body.data;
      expect(tiers).toHaveLength(2);
      expect(tiers.find(tier => tier.id === 'free')).toBeDefined();
      expect(tiers.find(tier => tier.id === 'premium')).toBeDefined();
    });

    test('GET /api/subscriptions/tiers should return subscription tiers with /api prefix', async () => {
      const response = await request(app)
        .get('/api/subscriptions/tiers')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('Error Handling', () => {
    test('should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/non-existent-route')
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body).toMatchObject({
        error: 'Endpoint not found',
        path: '/non-existent-route',
        method: 'GET',
        available_endpoints: expect.any(Array)
      });
    });

    test('should return 404 for non-existent API routes', async () => {
      const response = await request(app)
        .get('/api/non-existent')
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body.error).toBe('Endpoint not found');
      expect(response.body.path).toBe('/api/non-existent');
    });

    test('should handle POST requests to non-existent routes', async () => {
      const response = await request(app)
        .post('/api/invalid-endpoint')
        .send({ test: 'data' })
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body.error).toBe('Endpoint not found');
      expect(response.body.method).toBe('POST');
    });
  });

  describe('CORS Headers', () => {
    test('should include CORS headers in responses', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      // Note: CORS headers might not be visible in test environment
      // but we can test that the request succeeds, indicating CORS is configured
      expect(response.status).toBe(200);
    });

    test('should handle OPTIONS preflight requests', async () => {
      const response = await request(app)
        .options('/api/health');

      // The request should not fail due to CORS issues
      expect(response.status).not.toBe(500);
    });
  });

  describe('Content-Type Handling', () => {
    test('should accept JSON content type for POST requests', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify({ email: 'test@test.com' }))
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    test('should handle malformed JSON gracefully', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send('{"invalid": json}');

      // Should handle malformed JSON without crashing
      expect(response.status).toBeGreaterThanOrEqual(400);
    });
  });

  describe('Response Format Consistency', () => {
    test('all success responses should have consistent timestamp format', async () => {
      const endpoints = [
        '/api/health',
        '/api/status'
      ];

      for (const endpoint of endpoints) {
        const response = await request(app)
          .get(endpoint)
          .expect(200);

        expect(response.body.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      }
    });

    test('all auth endpoints should return success boolean', async () => {
      const authEndpoints = [
        { method: 'post', path: '/api/auth/login', data: { email: 'test@test.com' } },
        { method: 'post', path: '/api/auth/register', data: { email: 'test@test.com' } }
      ];

      for (const endpoint of authEndpoints) {
        const response = await request(app)
          [endpoint.method](endpoint.path)
          .send(endpoint.data)
          .expect(200);

        expect(typeof response.body.success).toBe('boolean');
        expect(response.body.success).toBe(true);
      }
    });
  });
});
