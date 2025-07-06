const http = require('http');
const { getDatabase } = require('../backend/database');
const handler = require('../api/index.js');

// Test configuration
const TEST_PORT = 3002;
const BASE_URL = `http://localhost:${TEST_PORT}`;

// Test data
const testUser = {
  email: 'test@example.com',
  username: 'testuser',
  displayName: 'Test User',
  password: 'password123'
};

const adminUser = {
  email: process.env.ADMIN_EMAIL || 'admin@onlyfur.net',
  password: process.env.ADMIN_PASSWORD || 'admin123'
};

// Helper function to make HTTP requests
function makeRequest(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: TEST_PORT,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const jsonData = data ? JSON.parse(data) : {};
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: jsonData
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data
          });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

// Test server setup
let server;
let dbInstance;

describe('Backend Integration Tests', () => {
  beforeAll(async () => {
    // Start test server
    server = http.createServer(async (req, res) => {
      const vercelReq = {
        ...req,
        query: require('url').parse(req.url, true).query,
        body: null
      };
      
      const vercelRes = {
        status: (code) => {
          res.statusCode = code;
          return vercelRes;
        },
        json: (data) => {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
        },
        send: (data) => {
          if (typeof data === 'string') {
            res.end(data);
          } else {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
          }
        },
        end: () => {
          res.end();
        },
        setHeader: (key, value) => {
          res.setHeader(key, value);
          return vercelRes;
        }
      };
      
      await handler(vercelReq, vercelRes);
    });

    // Start server and wait for it to be ready
    await new Promise((resolve) => {
      server.listen(TEST_PORT, resolve);
    });

    // Initialize database connection
    dbInstance = getDatabase();
    await dbInstance.connect();

    console.log(`🧪 Test server started on port ${TEST_PORT}`);
  });

  afterAll(async () => {
    // Cleanup test user if exists
    try {
      if (dbInstance && dbInstance.client) {
        await dbInstance.client.query(
          'DELETE FROM users WHERE email = $1',
          [testUser.email]
        );
      }
    } catch (error) {
      console.warn('Test cleanup warning:', error.message);
    }

    // Close database connection
    if (dbInstance) {
      await dbInstance.disconnect();
    }

    // Close server
    if (server) {
      await new Promise((resolve) => {
        server.close(resolve);
      });
    }

    console.log('🧪 Test server stopped');
  });

  describe('Health and Info Endpoints', () => {
    test('GET /api/health should return healthy status', async () => {
      const response = await makeRequest('GET', '/api/health');
      
      expect(response.status).toBe(200);
      expect(response.data.status).toBe('OK');
      expect(response.data.message).toContain('OnlyFur');
      expect(response.data.database).toBe('Connected');
      expect(Array.isArray(response.data.features)).toBe(true);
    });

    test('GET /api should return API information', async () => {
      const response = await makeRequest('GET', '/api');
      
      expect(response.status).toBe(200);
      expect(response.data.message).toContain('OnlyFur');
      expect(response.data.version).toBeDefined();
      expect(response.data.endpoints).toBeDefined();
      expect(response.data.endpoints.auth).toBeDefined();
    });

    test('OPTIONS requests should return CORS headers', async () => {
      const response = await makeRequest('OPTIONS', '/api/health');
      
      expect(response.status).toBe(200);
      expect(response.headers['access-control-allow-origin']).toBeDefined();
      expect(response.headers['access-control-allow-methods']).toBeDefined();
      expect(response.headers['access-control-allow-headers']).toBeDefined();
    });
  });

  describe('User Registration', () => {
    test('POST /api/auth/register should create a new user', async () => {
      const response = await makeRequest('POST', '/api/auth/register', testUser);
      
      expect(response.status).toBe(201);
      expect(response.data.success).toBe(true);
      expect(response.data.message).toContain('Registration successful');
      expect(response.data.data.user).toBeDefined();
      expect(response.data.data.token).toBeDefined();
      expect(response.data.data.refreshToken).toBeDefined();
      
      // Check user data
      const user = response.data.data.user;
      expect(user.email).toBe(testUser.email);
      expect(user.username).toBe(testUser.username);
      expect(user.displayName).toBe(testUser.displayName);
      expect(user.role).toBe('SUBSCRIBER');
      expect(user.isActive).toBe(true);
    });

    test('POST /api/auth/register should reject duplicate email', async () => {
      const response = await makeRequest('POST', '/api/auth/register', testUser);
      
      expect(response.status).toBe(409);
      expect(response.data.success).toBe(false);
      expect(response.data.error).toContain('Email already registered');
    });

    test('POST /api/auth/register should reject duplicate username', async () => {
      const duplicateUser = {
        ...testUser,
        email: 'different@example.com'
      };
      
      const response = await makeRequest('POST', '/api/auth/register', duplicateUser);
      
      expect(response.status).toBe(409);
      expect(response.data.success).toBe(false);
      expect(response.data.error).toContain('Username already taken');
    });

    test('POST /api/auth/register should validate required fields', async () => {
      const incompleteUser = {
        email: 'incomplete@example.com'
        // missing username, displayName, password
      };
      
      const response = await makeRequest('POST', '/api/auth/register', incompleteUser);
      
      expect(response.status).toBe(400);
      expect(response.data.success).toBe(false);
      expect(response.data.error).toContain('All fields are required');
    });

    test('POST /api/auth/register should validate password length', async () => {
      const weakPasswordUser = {
        ...testUser,
        email: 'weak@example.com',
        username: 'weakuser',
        password: '123' // too short
      };
      
      const response = await makeRequest('POST', '/api/auth/register', weakPasswordUser);
      
      expect(response.status).toBe(400);
      expect(response.data.success).toBe(false);
      expect(response.data.error).toContain('Password must be at least 6 characters');
    });
  });

  describe('User Authentication', () => {
    test('POST /api/auth/login should authenticate valid user', async () => {
      const loginData = {
        email: testUser.email,
        password: testUser.password
      };
      
      const response = await makeRequest('POST', '/api/auth/login', loginData);
      
      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.message).toContain('Login successful');
      expect(response.data.data.user).toBeDefined();
      expect(response.data.data.token).toBeDefined();
      expect(response.data.data.refreshToken).toBeDefined();
      
      // Store token for later tests
      global.testUserToken = response.data.data.token;
    });

    test('POST /api/auth/login should authenticate admin user', async () => {
      const response = await makeRequest('POST', '/api/auth/login', adminUser);
      
      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.data.user.role).toBe('ADMIN');
      
      // Store admin token for later tests
      global.adminToken = response.data.data.token;
    });

    test('POST /api/auth/login should reject invalid credentials', async () => {
      const invalidLogin = {
        email: testUser.email,
        password: 'wrongpassword'
      };
      
      const response = await makeRequest('POST', '/api/auth/login', invalidLogin);
      
      expect(response.status).toBe(401);
      expect(response.data.success).toBe(false);
      expect(response.data.error).toContain('Invalid email or password');
    });

    test('POST /api/auth/login should reject non-existent user', async () => {
      const nonExistentUser = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };
      
      const response = await makeRequest('POST', '/api/auth/login', nonExistentUser);
      
      expect(response.status).toBe(401);
      expect(response.data.success).toBe(false);
      expect(response.data.error).toContain('Invalid email or password');
    });

    test('POST /api/auth/login should validate required fields', async () => {
      const incompleteLogin = {
        email: testUser.email
        // missing password
      };
      
      const response = await makeRequest('POST', '/api/auth/login', incompleteLogin);
      
      expect(response.status).toBe(400);
      expect(response.data.success).toBe(false);
      expect(response.data.error).toContain('Email and password are required');
    });
  });

  describe('Protected Routes', () => {
    test('GET /api/auth/me should return user info with valid token', async () => {
      const headers = {
        'Authorization': `Bearer ${global.testUserToken}`
      };
      
      const response = await makeRequest('GET', '/api/auth/me', null, headers);
      
      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.data.email).toBe(testUser.email);
      expect(response.data.data.username).toBe(testUser.username);
    });

    test('GET /api/auth/me should reject request without token', async () => {
      const response = await makeRequest('GET', '/api/auth/me');
      
      expect(response.status).toBe(401);
      expect(response.data.success).toBe(false);
      expect(response.data.error).toContain('No token provided');
    });

    test('GET /api/auth/me should reject request with invalid token', async () => {
      const headers = {
        'Authorization': 'Bearer invalid-token'
      };
      
      const response = await makeRequest('GET', '/api/auth/me', null, headers);
      
      expect(response.status).toBe(401);
      expect(response.data.success).toBe(false);
      expect(response.data.error).toContain('Invalid');
    });
  });

  describe('Admin Routes', () => {
    test('GET /api/admin/panel should allow access for admin user', async () => {
      const headers = {
        'Authorization': `Bearer ${global.adminToken}`
      };
      
      const response = await makeRequest('GET', '/api/admin/panel', null, headers);
      
      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.message).toContain('Admin panel access granted');
      expect(response.data.data.user.role).toBe('ADMIN');
      expect(Array.isArray(response.data.data.adminFeatures)).toBe(true);
    });

    test('GET /api/admin/panel should deny access for regular user', async () => {
      const headers = {
        'Authorization': `Bearer ${global.testUserToken}`
      };
      
      const response = await makeRequest('GET', '/api/admin/panel', null, headers);
      
      expect(response.status).toBe(403);
      expect(response.data.success).toBe(false);
      expect(response.data.error).toContain('Access denied');
    });

    test('GET /api/admin/panel should deny access without token', async () => {
      const response = await makeRequest('GET', '/api/admin/panel');
      
      expect(response.status).toBe(401);
      expect(response.data.success).toBe(false);
    });
  });

  describe('Password Reset Flow', () => {
    test('POST /api/auth/request-password-reset should accept valid email', async () => {
      const resetRequest = {
        email: testUser.email
      };
      
      const response = await makeRequest('POST', '/api/auth/request-password-reset', resetRequest);
      
      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.message).toContain('password reset link has been sent');
    });

    test('POST /api/auth/request-password-reset should not reveal non-existent email', async () => {
      const resetRequest = {
        email: 'nonexistent@example.com'
      };
      
      const response = await makeRequest('POST', '/api/auth/request-password-reset', resetRequest);
      
      // Should return success even for non-existent email (security)
      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.message).toContain('password reset link has been sent');
    });

    test('POST /api/auth/request-password-reset should validate email field', async () => {
      const response = await makeRequest('POST', '/api/auth/request-password-reset', {});
      
      expect(response.status).toBe(400);
      expect(response.data.success).toBe(false);
      expect(response.data.error).toContain('Email is required');
    });
  });

  describe('Logout', () => {
    test('POST /api/auth/logout should return success', async () => {
      const response = await makeRequest('POST', '/api/auth/logout');
      
      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.message).toContain('Logout successful');
    });
  });

  describe('Error Handling', () => {
    test('Non-existent endpoint should return 404', async () => {
      const response = await makeRequest('GET', '/api/nonexistent');
      
      expect(response.status).toBe(404);
      expect(response.data.success).toBe(false);
      expect(response.data.error).toContain('Endpoint not found');
    });

    test('Invalid JSON should be handled gracefully', async () => {
      const response = await new Promise((resolve, reject) => {
        const options = {
          hostname: 'localhost',
          port: TEST_PORT,
          path: '/api/auth/login',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        };

        const req = http.request(options, (res) => {
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
          res.on('end', () => {
            try {
              const jsonData = JSON.parse(data);
              resolve({
                status: res.statusCode,
                data: jsonData
              });
            } catch (error) {
              resolve({
                status: res.statusCode,
                data: data
              });
            }
          });
        });

        req.on('error', reject);
        req.write('invalid json{');
        req.end();
      });
      
      expect(response.status).toBe(500);
      expect(response.data.success).toBe(false);
    });
  });

  describe('Database Operations', () => {
    test('Database should be connected', () => {
      expect(dbInstance.isConnected).toBe(true);
    });

    test('Admin user should exist in database', async () => {
      const admin = await dbInstance.findUserByEmail(adminUser.email);
      expect(admin).toBeTruthy();
      expect(admin.role).toBe('ADMIN');
      expect(admin.isActive).toBe(true);
    });

    test('Test user should exist in database', async () => {
      const user = await dbInstance.findUserByEmail(testUser.email);
      expect(user).toBeTruthy();
      expect(user.username).toBe(testUser.username);
      expect(user.role).toBe('SUBSCRIBER');
    });

    test('Password hashing should work correctly', async () => {
      const { PasswordHasher } = require('../backend/database');
      const password = 'testpassword123';
      
      // Hash password
      const hash = await PasswordHasher.hash(password);
      expect(hash).toBeTruthy();
      expect(hash).toContain(':'); // salt:hash format
      
      // Verify correct password
      const isValid = await PasswordHasher.compare(password, hash);
      expect(isValid).toBe(true);
      
      // Verify incorrect password
      const isInvalid = await PasswordHasher.compare('wrongpassword', hash);
      expect(isInvalid).toBe(false);
    });
  });
});
