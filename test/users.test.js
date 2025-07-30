const request = require('supertest');
const app = require('../server');
const {
  setupTestDB,
  teardownTestDB,
  clearDatabase,
  createTestUser,
} = require('./testSetup');

describe('Users Tests', () => {
  let user1, user2, token1, token2;

  beforeAll(async () => {
    await setupTestDB();
  });

  afterAll(async () => {
    await teardownTestDB();
  });

  beforeEach(async () => {
    await clearDatabase();
    
    // Create test users
    user1 = await createTestUser(app, {
      username: 'user1',
      email: 'user1@example.com',
      fullName: 'User One'
    });
    
    user2 = await createTestUser(app, {
      username: 'user2',
      email: 'user2@example.com',
      fullName: 'User Two'
    });

    token1 = user1.token;
    token2 = user2.token;
  });

  describe('GET /api/users/:username', () => {
    test('should get user profile successfully', async () => {
      const response = await request(app)
        .get('/api/users/user1')
        .send({ userId: user2.userId });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('username', 'user1');
      expect(response.body.user).toHaveProperty('fullName', 'User One');
      expect(response.body.user).toHaveProperty('followerCount');
      expect(response.body.user).toHaveProperty('followingCount');
      expect(response.body).toHaveProperty('posts');
      expect(response.body.posts).toHaveProperty('count', 0);
    });

    test('should fail with non-existent username', async () => {
      const response = await request(app)
        .get('/api/users/nonexistent')
        .send({ userId: user2.userId });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/users/follow/:id', () => {
    test('should follow user successfully', async () => {
      const response = await request(app)
        .post(`/api/users/follow/${user2.userId}`)
        .set('Authorization', `Bearer ${token1}`)
        .send({ userId: user1.userId });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
    });

    test('should fail when already following', async () => {
      // Follow first
      await request(app)
        .post(`/api/users/follow/${user2.userId}`)
        .set('Authorization', `Bearer ${token1}`)
        .send({ userId: user1.userId });

      // Try to follow again
      const response = await request(app)
        .post(`/api/users/follow/${user2.userId}`)
        .set('Authorization', `Bearer ${token1}`)
        .send({ userId: user1.userId });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('should fail without authentication', async () => {
      const response = await request(app)
        .post(`/api/users/follow/${user2.userId}`)
        .send({ userId: user1.userId });

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /api/users/unfollow/:id', () => {
    beforeEach(async () => {
      // Follow user first
      await request(app)
        .post(`/api/users/follow/${user2.userId}`)
        .set('Authorization', `Bearer ${token1}`)
        .send({ userId: user1.userId });
    });

    test('should unfollow user successfully', async () => {
      const response = await request(app)
        .delete(`/api/users/unfollow/${user2.userId}`)
        .set('Authorization', `Bearer ${token1}`)
        .send({ userId: user1.userId });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
    });

    test('should fail when not following', async () => {
      // Unfollow first
      await request(app)
        .delete(`/api/users/unfollow/${user2.userId}`)
        .set('Authorization', `Bearer ${token1}`)
        .send({ userId: user1.userId });

      // Try to unfollow again
      const response = await request(app)
        .delete(`/api/users/unfollow/${user2.userId}`)
        .set('Authorization', `Bearer ${token1}`)
        .send({ userId: user1.userId });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/users/followers/:id', () => {
    beforeEach(async () => {
      // User1 follows User2
      await request(app)
        .post(`/api/users/follow/${user2.userId}`)
        .set('Authorization', `Bearer ${token1}`)
        .send({ userId: user1.userId });
    });

    test('should get followers list', async () => {
      const response = await request(app)
        .get(`/api/users/followers/${user2.userId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveLength(1);
    });
  });

  describe('GET /api/users/following/:id', () => {
    beforeEach(async () => {
      // User1 follows User2
      await request(app)
        .post(`/api/users/follow/${user2.userId}`)
        .set('Authorization', `Bearer ${token1}`)
        .send({ userId: user1.userId });
    });

    test('should get following list', async () => {
      const response = await request(app)
        .get(`/api/users/following/${user1.userId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveLength(1);
    });
  });

  describe('PATCH /api/users/:id', () => {
    test('should update user profile successfully', async () => {
      const updateData = {
        userId: user1.userId,
        biography: 'Updated biography',
        fullName: 'Updated Name',
        location: 'New Location',
        website: 'https://example.com'
      };

      const response = await request(app)
        .patch(`/api/users/${user1.userId}`)
        .set('Authorization', `Bearer ${token1}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
    });

    test('should fail without authentication', async () => {
      const updateData = {
        userId: user1.userId,
        biography: 'Updated biography'
      };

      const response = await request(app)
        .patch(`/api/users/${user1.userId}`)
        .send(updateData);

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/users/random', () => {
    test('should get random users', async () => {
      const response = await request(app)
        .get('/api/users/random?size=2');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(response.body[0]).toHaveProperty('username');
      expect(response.body[0]).not.toHaveProperty('password');
    });

    test('should respect size parameter', async () => {
      const response = await request(app)
        .get('/api/users/random?size=1');

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
    });
  });
}); 