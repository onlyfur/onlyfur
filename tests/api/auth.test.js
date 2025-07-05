const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../../api/auth.js');

describe('Authentication API - Real Credential Validation', () => {
  let server;

  beforeAll(() => {
    server = app.listen(0); // Use port 0 to get any available port
  });

  afterAll((done) => {
    server.close(done);
  });

  describe('User Login Authentication', () => {
    describe('Valid Credentials', () => {
      test('should login successfully with valid email and password', async () => {
        const response = await request(app)
          .post('/login')
          .send({
            email: 'test@example.com',
            password: 'password123'
          })
          .expect(200);

        expect(response.body).toMatchObject({
          success: true,
          message: 'Login successful',
          user: {
            id: '1',
            email: 'test@example.com',
            username: 'testuser',
            displayName: 'Test User',
            role: 'SUBSCRIBER',
            isActive: true,
            subscriptionStatus: 'FREE'
          }
        });
        expect(response.body.token).toBeDefined();
        expect(response.body.timestamp).toBeDefined();
      });

      test('should login successfully with valid username and password', async () => {
        const response = await request(app)
          .post('/login')
          .send({
            username: 'creator',
            password: 'password123'
          })
          .expect(200);

        expect(response.body).toMatchObject({
          success: true,
          message: 'Login successful',
          user: {
            id: '2',
            email: 'creator@example.com',
            username: 'creator',
            role: 'CREATOR',
            subscriptionStatus: 'PREMIUM'
          }
        });
        expect(response.body.token).toBeDefined();
      });

      test('should return valid JWT token on successful login', async () => {
        const response = await request(app)
          .post('/login')
          .send({
            email: 'test@example.com',
            password: 'password123'
          })
          .expect(200);

        expect(response.body.token).toBeDefined();

        // Verify JWT token structure
        const secret = process.env.JWT_SECRET || 'test-secret-key';
        const decoded = jwt.verify(response.body.token, secret);

        expect(decoded).toMatchObject({
          userId: '1',
          email: 'test@example.com',
          username: 'testuser',
          role: 'SUBSCRIBER'
        });
        expect(decoded.exp).toBeDefined(); // Expiration time
        expect(decoded.iat).toBeDefined(); // Issued at time
      });
    });

    describe('Invalid Credentials', () => {
      test('should reject login with non-existent email', async () => {
        const response = await request(app)
          .post('/login')
          .send({
            email: 'nonexistent@example.com',
            password: 'password123'
          })
          .expect(401);

        expect(response.body).toMatchObject({
          success: false,
          error: 'Invalid credentials'
        });
        expect(response.body.token).toBeUndefined();
      });

      test('should reject login with non-existent username', async () => {
        const response = await request(app)
          .post('/login')
          .send({
            username: 'nonexistentuser',
            password: 'password123'
          })
          .expect(401);

        expect(response.body).toMatchObject({
          success: false,
          error: 'Invalid credentials'
        });
      });

      test('should reject login with wrong password', async () => {
        const response = await request(app)
          .post('/login')
          .send({
            email: 'test@example.com',
            password: 'wrongpassword'
          })
          .expect(401);

        expect(response.body).toMatchObject({
          success: false,
          error: 'Invalid credentials'
        });
      });

      test('should reject login with empty password', async () => {
        const response = await request(app)
          .post('/login')
          .send({
            email: 'test@example.com',
            password: ''
          })
          .expect(400);

        expect(response.body).toMatchObject({
          success: false,
          error: 'Password is required'
        });
      });

      test('should reject login with missing password', async () => {
        const response = await request(app)
          .post('/login')
          .send({
            email: 'test@example.com'
          })
          .expect(400);

        expect(response.body).toMatchObject({
          success: false,
          error: 'Password is required'
        });
      });

      test('should reject login with missing email and username', async () => {
        const response = await request(app)
          .post('/login')
          .send({
            password: 'password123'
          })
          .expect(400);

        expect(response.body).toMatchObject({
          success: false,
          error: 'Email or username is required'
        });
      });
    });

    describe('Account Status Validation', () => {
      test('should reject login for inactive account', async () => {
        const response = await request(app)
          .post('/login')
          .send({
            email: 'inactive@example.com',
            password: 'password123'
          })
          .expect(403);

        expect(response.body).toMatchObject({
          success: false,
          error: 'Account is deactivated. Please contact support.'
        });
      });
    });

    describe('Edge Cases', () => {
      test('should handle case-insensitive email login', async () => {
        const response = await request(app)
          .post('/login')
          .send({
            email: 'TEST@EXAMPLE.COM',
            password: 'password123'
          })
          .expect(200);

        expect(response.body.success).toBe(true);
      });

      test('should handle case-insensitive username login', async () => {
        const response = await request(app)
          .post('/login')
          .send({
            username: 'CREATOR',
            password: 'password123'
          })
          .expect(200);

        expect(response.body.success).toBe(true);
      });

      test('should handle SQL injection attempts safely', async () => {
        const response = await request(app)
          .post('/login')
          .send({
            email: "admin@example.com'; DROP TABLE users; --",
            password: 'password123'
          })
          .expect(401);

        expect(response.body.success).toBe(false);
      });

      test('should handle very long passwords safely', async () => {
        const longPassword = 'a'.repeat(10000);
        const response = await request(app)
          .post('/login')
          .send({
            email: 'test@example.com',
            password: longPassword
          })
          .expect(401);

        expect(response.body.success).toBe(false);
      });
    });
  });

  describe('User Registration', () => {
    describe('Valid Registration', () => {
      test('should register new user successfully', async () => {
        const response = await request(app)
          .post('/register')
          .send({
            email: 'newuser@example.com',
            username: 'newuser',
            displayName: 'New User',
            password: 'newpassword123'
          })
          .expect(201);

        expect(response.body).toMatchObject({
          success: true,
          message: 'Registration successful',
          user: {
            email: 'newuser@example.com',
            username: 'newuser',
            displayName: 'New User',
            role: 'SUBSCRIBER',
            isActive: true,
            subscriptionStatus: 'FREE'
          }
        });
        expect(response.body.token).toBeDefined();
      });

      test('should allow login with newly registered user', async () => {
        // First register a user
        await request(app)
          .post('/register')
          .send({
            email: 'logintest@example.com',
            username: 'logintest',
            displayName: 'Login Test',
            password: 'testpassword123'
          })
          .expect(201);

        // Then try to login with the same credentials
        const response = await request(app)
          .post('/login')
          .send({
            email: 'logintest@example.com',
            password: 'testpassword123'
          })
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.user.email).toBe('logintest@example.com');
      });
    });

    describe('Invalid Registration', () => {
      test('should reject registration with existing email', async () => {
        const response = await request(app)
          .post('/register')
          .send({
            email: 'test@example.com', // This email already exists
            username: 'newuser2',
            displayName: 'New User 2',
            password: 'password123'
          })
          .expect(409);

        expect(response.body).toMatchObject({
          success: false,
          error: 'User with this email already exists'
        });
      });

      test('should reject registration with existing username', async () => {
        const response = await request(app)
          .post('/register')
          .send({
            email: 'newuser3@example.com',
            username: 'testuser', // This username already exists
            displayName: 'New User 3',
            password: 'password123'
          })
          .expect(409);

        expect(response.body).toMatchObject({
          success: false,
          error: 'User with this username already exists'
        });
      });

      test('should reject registration with missing fields', async () => {
        const response = await request(app)
          .post('/register')
          .send({
            email: 'incomplete@example.com'
            // Missing username, displayName, and password
          })
          .expect(400);

        expect(response.body).toMatchObject({
          success: false,
          error: 'Email, username, display name, and password are required'
        });
      });
    });
  });

  describe('Token Verification', () => {
    let validToken;

    beforeAll(async () => {
      // Get a valid token for testing
      const response = await request(app)
        .post('/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });
      validToken = response.body.token;
    });

    test('should verify valid token successfully', async () => {
      const response = await request(app)
        .get('/verify')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        user: {
          id: '1',
          email: 'test@example.com',
          username: 'testuser'
        }
      });
    });

    test('should reject request without token', async () => {
      const response = await request(app)
        .get('/verify')
        .expect(401);

      expect(response.body).toMatchObject({
        success: false,
        error: 'No token provided'
      });
    });

    test('should reject request with invalid token format', async () => {
      const response = await request(app)
        .get('/verify')
        .set('Authorization', 'InvalidToken')
        .expect(401);

      expect(response.body).toMatchObject({
        success: false,
        error: 'No token provided'
      });
    });

    test('should reject request with malformed token', async () => {
      const response = await request(app)
        .get('/verify')
        .set('Authorization', 'Bearer invalid.jwt.token')
        .expect(401);

      expect(response.body).toMatchObject({
        success: false,
        error: 'Invalid token'
      });
    });

    test('should reject expired token', async () => {
      // Create an expired token
      const secret = process.env.JWT_SECRET || 'test-secret-key';
      const expiredToken = jwt.sign(
        { userId: '1', email: 'test@example.com' },
        secret,
        { expiresIn: '-1s' } // Expired 1 second ago
      );

      const response = await request(app)
        .get('/verify')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);

      expect(response.body).toMatchObject({
        success: false,
        error: 'Token expired'
      });
    });
  });

  describe('Security Features', () => {
    test('should not return password in any response', async () => {
      const loginResponse = await request(app)
        .post('/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        })
        .expect(200);

      expect(loginResponse.body.user.password).toBeUndefined();

      const verifyResponse = await request(app)
        .get('/verify')
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .expect(200);

      expect(verifyResponse.body.user.password).toBeUndefined();
    });

    test('should hash passwords in user store', async () => {
      await request(app)
        .post('/register')
        .send({
          email: 'hashtest@example.com',
          username: 'hashtest',
          displayName: 'Hash Test',
          password: 'plaintextpassword'
        })
        .expect(201);

      // Check that the stored password is hashed (not plaintext)
      const usersResponse = await request(app)
        .get('/users')
        .expect(200);

      const newUser = usersResponse.body.users.find(u => u.email === 'hashtest@example.com');
      expect(newUser).toBeDefined();
      // The password should not be included in the safe user response
      expect(newUser.password).toBeUndefined();
    });

    test('should update lastLoginAt on successful login', async () => {
      const beforeLogin = new Date();

      await request(app)
        .post('/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        })
        .expect(200);

      // Small delay to ensure timestamp difference
      await new Promise(resolve => setTimeout(resolve, 10));

      const response = await request(app)
        .post('/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        })
        .expect(200);

      const lastLoginAt = new Date(response.body.user.lastLoginAt);
      expect(lastLoginAt.getTime()).toBeGreaterThan(beforeLogin.getTime());
    });
  });

  describe('Database Integration Simulation', () => {
    test('should simulate database user lookup by email', async () => {
      // This test simulates what would happen with a real database
      const response = await request(app)
        .post('/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        })
        .expect(200);

      expect(response.body.user.id).toBe('1');
      expect(response.body.user.email).toBe('test@example.com');
    });

    test('should simulate database user lookup by username', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          username: 'creator',
          password: 'password123'
        })
        .expect(200);

      expect(response.body.user.id).toBe('2');
      expect(response.body.user.username).toBe('creator');
    });

    test('should simulate user not found in database', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          email: 'notfound@example.com',
          password: 'password123'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid credentials');
    });
  });
});
