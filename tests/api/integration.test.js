const request = require('supertest');
const app = require('../../api/index.js');

describe('API Integration Tests', () => {
  describe('Full User Journey Simulation', () => {
    test('should handle complete user registration and login flow', async () => {
      // Step 1: Check if API is healthy
      const healthResponse = await request(app)
        .get('/api/health')
        .expect(200);

      expect(healthResponse.body.status).toBe('healthy');

      // Step 2: Get subscription tiers
      const tiersResponse = await request(app)
        .get('/api/subscriptions/tiers')
        .expect(200);

      expect(tiersResponse.body.success).toBe(true);
      expect(Array.isArray(tiersResponse.body.data)).toBe(true);

      // Step 3: Register a new user
      const userData = {
        email: 'integration-test@example.com',
        username: 'integration_user',
        password: 'secure_password_123',
        displayName: 'Integration Test User'
      };

      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(200);

      expect(registerResponse.body.success).toBe(true);
      expect(registerResponse.body.message).toBe('Register endpoint is working');

      // Step 4: Login with the same credentials
      const loginData = {
        email: userData.email,
        password: userData.password
      };

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(loginResponse.body.success).toBe(true);
      expect(loginResponse.body.message).toBe('Login endpoint is working');
    });

    test('should handle API discovery workflow', async () => {
      // Step 1: Try an invalid endpoint to get available endpoints
      const errorResponse = await request(app)
        .get('/api/discover')
        .expect(404);

      expect(errorResponse.body.error).toBe('Endpoint not found');
      expect(Array.isArray(errorResponse.body.available_endpoints)).toBe(true);

      // Step 2: Test each available endpoint mentioned in the error
      const availableEndpoints = errorResponse.body.available_endpoints;
      
      for (const endpoint of availableEndpoints) {
        if (endpoint.startsWith('GET ')) {
          const path = endpoint.replace('GET ', '');
          await request(app)
            .get(path)
            .expect(200);
        }
      }
    });
  });

  describe('API Performance and Stress Tests', () => {
    test('should handle multiple concurrent requests', async () => {
      const concurrentRequests = 10;
      const promises = [];

      // Create multiple concurrent requests
      for (let i = 0; i < concurrentRequests; i++) {
        promises.push(
          request(app)
            .get('/api/health')
            .expect(200)
        );
      }

      // Wait for all requests to complete
      const responses = await Promise.all(promises);

      // Verify all responses are successful
      responses.forEach(response => {
        expect(response.body.status).toBe('healthy');
      });
    });

    test('should handle rapid sequential requests', async () => {
      const requestCount = 20;
      const results = [];

      for (let i = 0; i < requestCount; i++) {
        const response = await request(app)
          .get('/api/status')
          .expect(200);
        
        results.push(response.body);
      }

      // Verify all requests succeeded
      expect(results).toHaveLength(requestCount);
      results.forEach(result => {
        expect(result.status).toBe('running');
        expect(typeof result.uptime).toBe('number');
      });
    });

    test('should maintain consistent response times under load', async () => {
      const requestCount = 15;
      const responseTimes = [];

      for (let i = 0; i < requestCount; i++) {
        const start = Date.now();
        
        await request(app)
          .get('/api/health')
          .expect(200);
        
        const duration = Date.now() - start;
        responseTimes.push(duration);
      }

      // Calculate average response time
      const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
      
      // Verify average response time is reasonable
      expect(avgResponseTime).toBeLessThan(500); // Should average less than 500ms
      
      // Verify no single request took too long
      responseTimes.forEach(time => {
        expect(time).toBeLessThan(2000); // No single request should take more than 2 seconds
      });
    });
  });

  describe('Error Recovery and Resilience', () => {
    test('should recover gracefully from malformed requests', async () => {
      // Test various malformed requests
      const malformedRequests = [
        { path: '/api/auth/login', data: 'invalid-json-string' },
        { path: '/api/auth/login', data: '{"invalid": json}' },
        { path: '/api/auth/register', data: null }
      ];

      for (const req of malformedRequests) {
        const response = await request(app)
          .post(req.path)
          .send(req.data);

        // Should not crash the server (status should not be 500)
        expect(response.status).not.toBe(500);
      }

      // Verify the API is still functioning after malformed requests
      await request(app)
        .get('/api/health')
        .expect(200);
    });

    test('should handle edge case data inputs', async () => {
      const edgeCases = [
        { email: '', password: '' },
        { email: 'a'.repeat(1000), password: 'b'.repeat(1000) },
        { email: 'test@test.com', password: '', extraField: 'unexpected' },
        { email: null, password: undefined },
        { special: '!@#$%^&*()[]{}|\\:";\'<>?,./' }
      ];

      for (const testCase of edgeCases) {
        const response = await request(app)
          .post('/api/auth/login')
          .send(testCase);

        // Should handle gracefully without crashing
        expect(response.status).toBeLessThan(500);
      }
    });
  });

  describe('Cross-Origin and Security Tests', () => {
    test('should handle requests with various headers', async () => {
      const headers = [
        { 'User-Agent': 'Mozilla/5.0 (Test Browser)' },
        { 'Accept-Language': 'en-US,en;q=0.9' },
        { 'Accept-Encoding': 'gzip, deflate, br' },
        { 'Cache-Control': 'no-cache' },
        { 'X-Requested-With': 'XMLHttpRequest' }
      ];

      for (const header of headers) {
        const response = await request(app)
          .get('/api/health')
          .set(header)
          .expect(200);

        expect(response.body.status).toBe('healthy');
      }
    });

    test('should handle different content types', async () => {
      // Test with explicit JSON content type
      await request(app)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify({ email: 'test@test.com' }))
        .expect(200);

      // Test with default content type
      await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@test.com' })
        .expect(200);
    });
  });

  describe('Endpoint Consistency Tests', () => {
    test('all endpoints should return consistent response structure', async () => {
      const endpoints = [
        { method: 'get', path: '/api/health', expectedFields: ['status', 'service', 'version', 'timestamp', 'environment'] },
        { method: 'get', path: '/api/status', expectedFields: ['status', 'uptime', 'timestamp', 'environment'] },
        { method: 'get', path: '/api/subscriptions/tiers', expectedFields: ['success', 'data'] }
      ];

      for (const endpoint of endpoints) {
        const response = await request(app)[endpoint.method](endpoint.path)
          .expect(200);

        // Check that all expected fields are present
        endpoint.expectedFields.forEach(field => {
          expect(response.body).toHaveProperty(field);
        });
      }
    });

    test('all auth endpoints should have consistent success response format', async () => {
      const authEndpoints = [
        { path: '/api/auth/login', data: { email: 'test@test.com' } },
        { path: '/api/auth/register', data: { email: 'test@test.com' } }
      ];

      for (const endpoint of authEndpoints) {
        const response = await request(app)
          .post(endpoint.path)
          .send(endpoint.data)
          .expect(200);

        // Check consistent response structure
        expect(response.body).toHaveProperty('success');
        expect(response.body).toHaveProperty('message');
        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('timestamp');
        
        expect(typeof response.body.success).toBe('boolean');
        expect(typeof response.body.message).toBe('string');
        expect(typeof response.body.timestamp).toBe('string');
      }
    });
  });
});
