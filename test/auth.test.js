const request = require('supertest');
const app = require('../server');
const {
  setupTestDB,
  teardownTestDB,
  clearDatabase,
} = require('./testSetup');

describe('Authentication Tests', () => {
  beforeAll(async () => {
    await setupTestDB();
  });

  afterAll(async () => {
    await teardownTestDB();
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  describe('POST /api/users/register', () => {
    test('should register a new user successfully', async () => {
      const userData = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password123',
        fullName: 'New User',
        biography: 'Test biography'
      };

      const response = await request(app)
        .post('/api/users/register')
        .send(userData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.username).toBe(userData.username);
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.fullName).toBe(userData.fullName);
      expect(response.body.user.biography).toBe(userData.biography);
      expect(response.body.user).not.toHaveProperty('password');
    });

    test('should fail with missing required fields', async () => {
      const userData = {
        username: 'newuser',
        // missing email and password
      };

      const response = await request(app)
        .post('/api/users/register')
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('should fail with duplicate username', async () => {
      const userData = {
        username: 'duplicateuser',
        email: 'user1@example.com',
        password: 'password123'
      };

      // Register first user
      await request(app)
        .post('/api/users/register')
        .send(userData);

      // Try to register with same username
      const response = await request(app)
        .post('/api/users/register')
        .send({
          ...userData,
          email: 'user2@example.com'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('should fail with duplicate email', async () => {
      const userData = {
        username: 'user1',
        email: 'duplicate@example.com',
        password: 'password123'
      };

      // Register first user
      await request(app)
        .post('/api/users/register')
        .send(userData);

      // Try to register with same email
      const response = await request(app)
        .post('/api/users/register')
        .send({
          ...userData,
          username: 'user2'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/users/login', () => {
    beforeEach(async () => {
      // Create a test user
      await request(app)
        .post('/api/users/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
          fullName: 'Test User'
        });
    });

    test('should login successfully with correct credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/users/login')
        .send(loginData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(loginData.email);
    });

    test('should fail with incorrect password', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/users/login')
        .send(loginData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('should fail with non-existent email', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/users/login')
        .send(loginData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('should fail with missing credentials', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/users/me', () => {
    let token;

    beforeEach(async () => {
      // Register and login a user
      const registerResponse = await request(app)
        .post('/api/users/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
          fullName: 'Test User'
        });

      token = registerResponse.body.token;
    });

    test('should get current user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${token}`)
        .send({ userId: token.userId });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('username', 'testuser');
      expect(response.body).toHaveProperty('email', 'test@example.com');
      expect(response.body).toHaveProperty('fullName', 'Test User');
      expect(response.body).not.toHaveProperty('password');
    });

    test('should fail without token', async () => {
      const response = await request(app)
        .get('/api/users/me')
        .send({ userId: 'someuserid' });

      expect(response.status).toBe(401);
    });
  });
}); 