const mongoose = require('mongoose');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

// Test database setup
const setupTestDB = async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

// Clean up test database
const teardownTestDB = async () => {
  if (mongoServer) {
    await mongoose.disconnect();
    await mongoServer.stop();
  }
};

// Clear all collections
const clearDatabase = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
};

// Create test user
const createTestUser = async (app, userData = {}) => {
  const defaultUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
    fullName: 'Test User',
    biography: 'Test bio',
    ...userData
  };

  const response = await request(app)
    .post('/api/users/register')
    .send(defaultUser);

  return response.body;
};

// Login test user
const loginTestUser = async (app, userData = {}) => {
  const defaultUser = {
    email: 'test@example.com',
    password: 'password123',
    ...userData
  };

  const response = await request(app)
    .post('/api/users/login')
    .send(defaultUser);

  return response.body;
};

// Create test post
const createTestPost = async (app, token, postData = {}) => {
  const defaultPost = {
    title: 'Test Post',
    content: 'This is a test post content',
    image: 'https://example.com/image.jpg',
    location: 'Test Location',
    tags: ['test', 'example'],
    ...postData
  };

  const response = await request(app)
    .post('/api/posts')
    .set('Authorization', `Bearer ${token}`)
    .send(defaultPost);

  return response.body;
};

module.exports = {
  setupTestDB,
  teardownTestDB,
  clearDatabase,
  createTestUser,
  loginTestUser,
  createTestPost,
}; 