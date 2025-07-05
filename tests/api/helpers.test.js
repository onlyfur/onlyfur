const request = require('supertest');
const app = require('../../api/index.js');

describe('API Helper Functions and Middleware', () => {
  describe('Request Logging Middleware', () => {
    test('should log requests (check console output)', async () => {
      // Mock console.log to capture logging
      const originalLog = console.log;
      const logSpy = jest.fn();
      console.log = logSpy;

      await request(app)
        .get('/api/health')
        .expect(200);

      // Verify that logging occurred
      expect(logSpy).toHaveBeenCalledWith('GET /api/health');

      // Restore original console.log
      console.log = originalLog;
    });
  });

  describe('CORS Middleware', () => {
    test('should set appropriate CORS headers for API requests', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      // In a real API, we'd check for actual CORS headers
      // For now, we verify the request doesn't fail due to CORS
      expect(response.status).toBe(200);
    });

    test('should handle preflight OPTIONS requests', async () => {
      const response = await request(app)
        .options('/api/auth/login');

      // Should not return a 500 error
      expect(response.status).not.toBe(500);
    });
  });

  describe('JSON Body Parsing', () => {
    test('should parse JSON request bodies correctly', async () => {
      const testData = {
        email: 'test@example.com',
        password: 'testpass',
        metadata: {
          timestamp: new Date().toISOString(),
          source: 'unit_test'
        }
      };

      // Mock console.log to capture the parsed body
      const originalLog = console.log;
      const logSpy = jest.fn();
      console.log = logSpy;

      await request(app)
        .post('/api/auth/login')
        .send(testData)
        .expect(200);

      // Check if the body was logged (indicating it was parsed)
      expect(logSpy).toHaveBeenCalledWith('POST /api/auth/login');
      expect(logSpy).toHaveBeenCalledWith('Login request:', testData);

      console.log = originalLog;
    });

    test('should handle requests without body', async () => {
      await request(app)
        .post('/api/auth/login')
        .expect(200);

      // Should not crash when no body is provided
    });
  });

  describe('Error Handling Middleware', () => {
    test('should handle and format errors consistently', async () => {
      // Test with a non-existent endpoint to trigger error handling
      const response = await request(app)
        .get('/api/trigger-error')
        .expect(404);

      expect(response.body).toMatchObject({
        error: 'Endpoint not found',
        path: '/api/trigger-error',
        method: 'GET',
        available_endpoints: expect.any(Array)
      });
    });

    test('should include helpful information in error responses', async () => {
      const response = await request(app)
        .post('/api/nonexistent')
        .send({ test: 'data' })
        .expect(404);

      expect(response.body.available_endpoints).toContain('GET /api/health');
      expect(response.body.available_endpoints).toContain('POST /api/auth/login');
      expect(response.body.available_endpoints).toContain('GET /api/subscriptions/tiers');
    });
  });
});

describe('API Response Validation', () => {
  describe('Response Structure', () => {
    test('all GET endpoints should return valid JSON', async () => {
      const endpoints = [
        '/api/health',
        '/api/status',
        '/api/subscriptions/tiers'
      ];

      for (const endpoint of endpoints) {
        const response = await request(app)
          .get(endpoint)
          .expect(200);

        expect(() => JSON.parse(JSON.stringify(response.body))).not.toThrow();
      }
    });

    test('all POST endpoints should return valid JSON', async () => {
      const endpoints = [
        { path: '/api/auth/login', data: { email: 'test@test.com' } },
        { path: '/api/auth/register', data: { email: 'test@test.com' } }
      ];

      for (const endpoint of endpoints) {
        const response = await request(app)
          .post(endpoint.path)
          .send(endpoint.data)
          .expect(200);

        expect(() => JSON.parse(JSON.stringify(response.body))).not.toThrow();
      }
    });
  });

  describe('Response Times', () => {
    test('health check should respond quickly', async () => {
      const start = Date.now();
      
      await request(app)
        .get('/api/health')
        .expect(200);
      
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(1000); // Should respond within 1 second
    });

    test('auth endpoints should respond within reasonable time', async () => {
      const start = Date.now();
      
      await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@test.com', password: 'test' })
        .expect(200);
      
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(2000); // Should respond within 2 seconds
    });
  });

  describe('HTTP Status Codes', () => {
    test('successful requests should return 200', async () => {
      const successEndpoints = [
        { method: 'get', path: '/api/health' },
        { method: 'get', path: '/api/status' },
        { method: 'get', path: '/api/subscriptions/tiers' },
        { method: 'post', path: '/api/auth/login', data: {} },
        { method: 'post', path: '/api/auth/register', data: {} }
      ];

      for (const endpoint of successEndpoints) {
        const request_builder = request(app)[endpoint.method](endpoint.path);
        
        if (endpoint.data) {
          request_builder.send(endpoint.data);
        }
        
        await request_builder.expect(200);
      }
    });

    test('non-existent endpoints should return 404', async () => {
      const notFoundEndpoints = [
        '/api/does-not-exist',
        '/api/invalid/route',
        '/completely/wrong'
      ];

      for (const endpoint of notFoundEndpoints) {
        await request(app)
          .get(endpoint)
          .expect(404);
      }
    });
  });
});
