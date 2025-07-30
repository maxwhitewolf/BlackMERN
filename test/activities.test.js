const request = require('supertest');
const app = require('../server');
const {
  setupTestDB,
  teardownTestDB,
  clearDatabase,
  createTestUser,
} = require('./testSetup');

describe('Activities Tests', () => {
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
      email: 'user1@example.com'
    });
    
    user2 = await createTestUser(app, {
      username: 'user2',
      email: 'user2@example.com'
    });

    token1 = user1.token;
    token2 = user2.token;
  });

  describe('GET /api/activities', () => {
    test('should get user activities', async () => {
      const response = await request(app)
        .get('/api/activities')
        .set('Authorization', `Bearer ${token2}`)
        .send({ userId: user2.userId });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('activities');
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('page');
      expect(response.body).toHaveProperty('totalPages');
      expect(Array.isArray(response.body.activities)).toBe(true);
    });

    test('should fail without authentication', async () => {
      const response = await request(app)
        .get('/api/activities')
        .send({ userId: user2.userId });

      expect(response.status).toBe(401);
    });
  });

  describe('Activity Creation Tests', () => {
    test('should create follow activity', async () => {
      // User1 follows User2
      await request(app)
        .post(`/api/users/follow/${user2.userId}`)
        .set('Authorization', `Bearer ${token1}`)
        .send({ userId: user1.userId });

      // Check if activity was created
      const response = await request(app)
        .get('/api/activities')
        .set('Authorization', `Bearer ${token2}`)
        .send({ userId: user2.userId });

      expect(response.status).toBe(200);
      expect(response.body.activities.length).toBeGreaterThan(0);
      
      const followActivity = response.body.activities.find(
        activity => activity.type === 'follow'
      );
      expect(followActivity).toBeDefined();
      expect(followActivity.user.username).toBe('user1');
    });

    test('should create like activity', async () => {
      // Create a post
      const postResponse = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          title: 'Test Post',
          content: 'Test content'
        });

      const postId = postResponse.body._id;

      // User2 likes User1's post
      await request(app)
        .post(`/api/posts/like/${postId}`)
        .set('Authorization', `Bearer ${token2}`)
        .send({ userId: user2.userId });

      // Check if activity was created
      const response = await request(app)
        .get('/api/activities')
        .set('Authorization', `Bearer ${token1}`)
        .send({ userId: user1.userId });

      expect(response.status).toBe(200);
      expect(response.body.activities.length).toBeGreaterThan(0);
      
      const likeActivity = response.body.activities.find(
        activity => activity.type === 'like'
      );
      expect(likeActivity).toBeDefined();
      expect(likeActivity.user.username).toBe('user2');
      expect(likeActivity.post._id).toBe(postId);
    });

    test('should create comment activity', async () => {
      // Create a post
      const postResponse = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          title: 'Test Post',
          content: 'Test content'
        });

      const postId = postResponse.body._id;

      // User2 comments on User1's post
      await request(app)
        .post(`/api/comments/${postId}`)
        .set('Authorization', `Bearer ${token2}`)
        .send({
          content: 'Test comment',
          userId: user2.userId
        });

      // Check if activity was created
      const response = await request(app)
        .get('/api/activities')
        .set('Authorization', `Bearer ${token1}`)
        .send({ userId: user1.userId });

      expect(response.status).toBe(200);
      expect(response.body.activities.length).toBeGreaterThan(0);
      
      const commentActivity = response.body.activities.find(
        activity => activity.type === 'comment'
      );
      expect(commentActivity).toBeDefined();
      expect(commentActivity.user.username).toBe('user2');
      expect(commentActivity.post._id).toBe(postId);
    });
  });

  describe('POST /api/activities/mark-read', () => {
    beforeEach(async () => {
      // Create some activities by having User1 follow User2
      await request(app)
        .post(`/api/users/follow/${user2.userId}`)
        .set('Authorization', `Bearer ${token1}`)
        .send({ userId: user1.userId });
    });

    test('should mark activities as read', async () => {
      // Get activities first to get their IDs
      const activitiesResponse = await request(app)
        .get('/api/activities')
        .set('Authorization', `Bearer ${token2}`)
        .send({ userId: user2.userId });

      const activityIds = activitiesResponse.body.activities.map(a => a._id);

      const response = await request(app)
        .post('/api/activities/mark-read')
        .set('Authorization', `Bearer ${token2}`)
        .send({
          userId: user2.userId,
          activityIds
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Activities marked as read');
    });

    test('should mark all activities as read when no IDs provided', async () => {
      const response = await request(app)
        .post('/api/activities/mark-read')
        .set('Authorization', `Bearer ${token2}`)
        .send({ userId: user2.userId });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Activities marked as read');
    });
  });

  describe('GET /api/activities/unread-count', () => {
    beforeEach(async () => {
      // Create some activities by having User1 follow User2
      await request(app)
        .post(`/api/users/follow/${user2.userId}`)
        .set('Authorization', `Bearer ${token1}`)
        .send({ userId: user1.userId });
    });

    test('should get unread activity count', async () => {
      const response = await request(app)
        .get('/api/activities/unread-count')
        .set('Authorization', `Bearer ${token2}`)
        .send({ userId: user2.userId });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('count');
      expect(typeof response.body.count).toBe('number');
      expect(response.body.count).toBeGreaterThan(0);
    });

    test('should return 0 after marking activities as read', async () => {
      // Mark activities as read
      await request(app)
        .post('/api/activities/mark-read')
        .set('Authorization', `Bearer ${token2}`)
        .send({ userId: user2.userId });

      // Check unread count
      const response = await request(app)
        .get('/api/activities/unread-count')
        .set('Authorization', `Bearer ${token2}`)
        .send({ userId: user2.userId });

      expect(response.status).toBe(200);
      expect(response.body.count).toBe(0);
    });
  });

  describe('Activity Pagination', () => {
    beforeEach(async () => {
      // Create multiple activities
      for (let i = 0; i < 5; i++) {
        await request(app)
          .post(`/api/users/follow/${user2.userId}`)
          .set('Authorization', `Bearer ${token1}`)
          .send({ userId: user1.userId });
      }
    });

    test('should support pagination', async () => {
      const response = await request(app)
        .get('/api/activities?page=1&limit=3')
        .set('Authorization', `Bearer ${token2}`)
        .send({ userId: user2.userId });

      expect(response.status).toBe(200);
      expect(response.body.activities.length).toBeLessThanOrEqual(3);
      expect(response.body.page).toBe(1);
      expect(response.body.totalPages).toBeGreaterThan(1);
    });
  });
}); 