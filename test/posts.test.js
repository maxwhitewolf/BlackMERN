const request = require('supertest');
const app = require('../server');
const {
  setupTestDB,
  teardownTestDB,
  clearDatabase,
  createTestUser,
  loginTestUser,
} = require('./testSetup');

describe('Posts Tests', () => {
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

  describe('POST /api/posts', () => {
    test('should create a post successfully', async () => {
      const postData = {
        title: 'Test Post',
        content: 'This is a test post content',
        image: 'https://example.com/image.jpg',
        location: 'Test Location',
        tags: ['test', 'example']
      };

      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${token1}`)
        .send(postData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('title', postData.title);
      expect(response.body).toHaveProperty('content', postData.content);
      expect(response.body).toHaveProperty('image', postData.image);
      expect(response.body).toHaveProperty('location', postData.location);
      expect(response.body).toHaveProperty('tags');
      expect(response.body.tags).toEqual(postData.tags);
      expect(response.body).toHaveProperty('poster');
      expect(response.body.poster).toHaveProperty('username', 'user1');
    });

    test('should fail without authentication', async () => {
      const postData = {
        title: 'Test Post',
        content: 'This is a test post content'
      };

      const response = await request(app)
        .post('/api/posts')
        .send(postData);

      expect(response.status).toBe(401);
    });

    test('should fail with missing required fields', async () => {
      const postData = {
        title: 'Test Post'
        // missing content
      };

      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${token1}`)
        .send(postData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/posts (Explore Feed)', () => {
    beforeEach(async () => {
      // Create posts from both users
      await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          title: 'Post from User 1',
          content: 'Content from user 1'
        });

      await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${token2}`)
        .send({
          title: 'Post from User 2',
          content: 'Content from user 2'
        });
    });

    test('should get all posts (explore feed)', async () => {
      const response = await request(app)
        .get('/api/posts')
        .send({ userId: user1.userId });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveLength(2);
      expect(response.body).toHaveProperty('count', 2);
    });

    test('should work without authentication', async () => {
      const response = await request(app)
        .get('/api/posts');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveLength(2);
    });
  });

  describe('GET /api/posts/home (Home Feed)', () => {
    beforeEach(async () => {
      // Create posts from both users
      await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          title: 'Post from User 1',
          content: 'Content from user 1'
        });

      await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${token2}`)
        .send({
          title: 'Post from User 2',
          content: 'Content from user 2'
        });
    });

    test('should get only followed users posts initially (only own posts)', async () => {
      const response = await request(app)
        .get('/api/posts/home')
        .set('Authorization', `Bearer ${token1}`)
        .send({ userId: user1.userId });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('posts');
      expect(response.body.posts).toHaveLength(1); // Only user1's post
      expect(response.body.posts[0].poster.username).toBe('user1');
    });

    test('should get posts from followed users after following', async () => {
      // User1 follows User2
      await request(app)
        .post(`/api/users/follow/${user2.userId}`)
        .set('Authorization', `Bearer ${token1}`)
        .send({ userId: user1.userId });

      const response = await request(app)
        .get('/api/posts/home')
        .set('Authorization', `Bearer ${token1}`)
        .send({ userId: user1.userId });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('posts');
      expect(response.body.posts).toHaveLength(2); // Both users' posts
    });

    test('should fail without authentication', async () => {
      const response = await request(app)
        .get('/api/posts/home')
        .send({ userId: user1.userId });

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/posts/like/:id', () => {
    let postId;

    beforeEach(async () => {
      // Create a post
      const postResponse = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          title: 'Test Post',
          content: 'Test content'
        });

      postId = postResponse.body._id;
    });

    test('should like a post successfully', async () => {
      const response = await request(app)
        .post(`/api/posts/like/${postId}`)
        .set('Authorization', `Bearer ${token2}`)
        .send({ userId: user2.userId });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
    });

    test('should fail when liking already liked post', async () => {
      // Like the post first
      await request(app)
        .post(`/api/posts/like/${postId}`)
        .set('Authorization', `Bearer ${token2}`)
        .send({ userId: user2.userId });

      // Try to like again
      const response = await request(app)
        .post(`/api/posts/like/${postId}`)
        .set('Authorization', `Bearer ${token2}`)
        .send({ userId: user2.userId });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('should fail without authentication', async () => {
      const response = await request(app)
        .post(`/api/posts/like/${postId}`)
        .send({ userId: user2.userId });

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /api/posts/like/:id', () => {
    let postId;

    beforeEach(async () => {
      // Create a post and like it
      const postResponse = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          title: 'Test Post',
          content: 'Test content'
        });

      postId = postResponse.body._id;

      await request(app)
        .post(`/api/posts/like/${postId}`)
        .set('Authorization', `Bearer ${token2}`)
        .send({ userId: user2.userId });
    });

    test('should unlike a post successfully', async () => {
      const response = await request(app)
        .delete(`/api/posts/like/${postId}`)
        .set('Authorization', `Bearer ${token2}`)
        .send({ userId: user2.userId });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
    });

    test('should fail when unliking already unliked post', async () => {
      // Unlike the post first
      await request(app)
        .delete(`/api/posts/like/${postId}`)
        .set('Authorization', `Bearer ${token2}`)
        .send({ userId: user2.userId });

      // Try to unlike again
      const response = await request(app)
        .delete(`/api/posts/like/${postId}`)
        .set('Authorization', `Bearer ${token2}`)
        .send({ userId: user2.userId });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/posts/:id', () => {
    let postId;

    beforeEach(async () => {
      // Create a post
      const postResponse = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          title: 'Test Post',
          content: 'Test content'
        });

      postId = postResponse.body._id;
    });

    test('should get a single post', async () => {
      const response = await request(app)
        .get(`/api/posts/${postId}`)
        .send({ userId: user2.userId });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('title', 'Test Post');
      expect(response.body).toHaveProperty('content', 'Test content');
      expect(response.body).toHaveProperty('poster');
      expect(response.body.poster.username).toBe('user1');
    });

    test('should fail with invalid post ID', async () => {
      const response = await request(app)
        .get('/api/posts/invalidid')
        .send({ userId: user2.userId });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });
}); 