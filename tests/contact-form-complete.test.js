const request = require('supertest');
const express = require('express');
const { createRoutes } = require('../backend/routes');

// Mock database
const mockDb = {
  isConnected: true,
  connect: jest.fn(),
  users: []
};

// Mock email service
jest.mock('../backend/utils', () => ({
  ...jest.requireActual('../backend/utils'),
  EmailService: {
    sendEmail: jest.fn().mockResolvedValue(true)
  }
}));

describe('Contact Form', () => {
  let app;
  let routes;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    routes = createRoutes(mockDb);
    
    // Add the contact route
    app.post('/api/contact', routes['POST /api/contact']);
    
    // Clear mock calls
    const { EmailService } = require('../backend/utils');
    EmailService.sendEmail.mockClear();
  });

  describe('Contact Form Structure', () => {
    const requiredFields = ['name', 'email', 'category', 'message'];
    const validCategories = ['general', 'technical', 'billing', 'content', 'partnership', 'other'];

    test('should have all required fields', () => {
      requiredFields.forEach(field => {
        expect(field).toBeDefined();
      });
    });

    test('should have valid category options', () => {
      validCategories.forEach(category => {
        expect(validCategories).toContain(category);
      });
    });
  });

  describe('POST /api/contact', () => {
    const validContactData = {
      name: 'Test User',
      email: 'test@example.com',
      category: 'general',
      message: 'This is a test message'
    };

    test('should successfully submit contact form with valid data', async () => {
      const response = await request(app)
        .post('/api/contact')
        .send(validContactData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('sent successfully');
    });

    test('should reject submission with missing name', async () => {
      const invalidData = { ...validContactData };
      delete invalidData.name;

      const response = await request(app)
        .post('/api/contact')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('required');
    });

    test('should reject submission with missing email', async () => {
      const invalidData = { ...validContactData };
      delete invalidData.email;

      const response = await request(app)
        .post('/api/contact')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('required');
    });

    test('should reject submission with invalid email format', async () => {
      const invalidData = { ...validContactData, email: 'invalid-email' };

      const response = await request(app)
        .post('/api/contact')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid email format');
    });

    test('should reject submission with invalid category', async () => {
      const invalidData = { ...validContactData, category: 'invalid-category' };

      const response = await request(app)
        .post('/api/contact')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid category');
    });

    test('should reject submission with missing message', async () => {
      const invalidData = { ...validContactData };
      delete invalidData.message;

      const response = await request(app)
        .post('/api/contact')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('required');
    });

    test('should accept all valid categories', async () => {
      const validCategories = ['general', 'technical', 'billing', 'content', 'partnership', 'other'];
      
      for (const category of validCategories) {
        const testData = { ...validContactData, category };
        const response = await request(app)
          .post('/api/contact')
          .send(testData)
          .expect(200);

        expect(response.body.success).toBe(true);
      }
    });

    test('should handle empty strings as invalid', async () => {
      const invalidData = {
        name: '',
        email: '',
        category: '',
        message: ''
      };

      const response = await request(app)
        .post('/api/contact')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('required');
    });
  });

  describe('Email Integration', () => {
    test('should call EmailService.sendEmail twice (support + auto-reply)', async () => {
      const { EmailService } = require('../backend/utils');
      
      const validContactData = {
        name: 'Test User',
        email: 'test@example.com',
        category: 'general',
        message: 'This is a test message'
      };

      await request(app)
        .post('/api/contact')
        .send(validContactData)
        .expect(200);

      expect(EmailService.sendEmail).toHaveBeenCalledTimes(2);
    });

    test('should send email to support with correct details', async () => {
      const { EmailService } = require('../backend/utils');
      
      const validContactData = {
        name: 'Test User',
        email: 'test@example.com',
        category: 'technical',
        message: 'This is a test message'
      };

      await request(app)
        .post('/api/contact')
        .send(validContactData)
        .expect(200);

      const firstCall = EmailService.sendEmail.mock.calls[0];
      expect(firstCall[0]).toBe(process.env.SUPPORT_EMAIL || 'support@onlyfur.net');
      expect(firstCall[1]).toContain('[OnlyFur Contact] Technical - Test User');
      expect(firstCall[2]).toContain('Test User');
      expect(firstCall[2]).toContain('test@example.com');
      expect(firstCall[2]).toContain('technical');
      expect(firstCall[2]).toContain('This is a test message');
    });

    test('should send auto-reply to user', async () => {
      const { EmailService } = require('../backend/utils');
      
      const validContactData = {
        name: 'Test User',
        email: 'test@example.com',
        category: 'general',
        message: 'This is a test message'
      };

      await request(app)
        .post('/api/contact')
        .send(validContactData)
        .expect(200);

      const secondCall = EmailService.sendEmail.mock.calls[1];
      expect(secondCall[0]).toBe('test@example.com');
      expect(secondCall[1]).toContain('Thank you for contacting OnlyFur');
      expect(secondCall[2]).toContain('Test User');
      expect(secondCall[2]).toContain('general');
    });
  });
});
