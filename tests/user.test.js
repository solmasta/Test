const request = require('supertest');
const app = require('../index');
const User = require('../src/models/User');
require('./setup');

describe('User Endpoints', () => {
  describe('POST /api/users - Register', () => {
    it('should register a new user with valid data', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('token');
      expect(res.body.username).toBe('testuser');
      expect(res.body.email).toBe('test@example.com');
      expect(res.body.ecoScore).toBe(0);
    });

    it('should reject duplicate username', async () => {
      await request(app)
        .post('/api/users')
        .send({
          username: 'testuser',
          email: 'test1@example.com',
          password: 'password123'
        });

      const res = await request(app)
        .post('/api/users')
        .send({
          username: 'testuser',
          email: 'test2@example.com',
          password: 'password123'
        });

      expect(res.status).toBe(400);
    });

    it('should reject duplicate email', async () => {
      await request(app)
        .post('/api/users')
        .send({
          username: 'user1',
          email: 'test@example.com',
          password: 'password123'
        });

      const res = await request(app)
        .post('/api/users')
        .send({
          username: 'user2',
          email: 'test@example.com',
          password: 'password123'
        });

      expect(res.status).toBe(400);
    });

    it('should reject short username', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({
          username: 'ab',
          email: 'test@example.com',
          password: 'password123'
        });

      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
    });

    it('should reject invalid email', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({
          username: 'testuser',
          email: 'notanemail',
          password: 'password123'
        });

      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
    });

    it('should reject short password', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'short'
        });

      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
    });

    it('should hash password before saving', async () => {
      await request(app)
        .post('/api/users')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        });

      const user = await User.findOne({ email: 'test@example.com' });
      expect(user.password).not.toBe('password123');
    });
  });

  describe('POST /api/users/login - Login', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/users')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        });
    });

    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.username).toBe('testuser');
    });

    it('should reject invalid email', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: 'wrong@example.com',
          password: 'password123'
        });

      expect(res.status).toBe(401);
    });

    it('should reject invalid password', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(res.status).toBe(401);
    });

    it('should validate email format on login', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: 'notanemail',
          password: 'password123'
        });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/users/profile - Get Profile', () => {
    let token;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/users')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        });
      token = res.body.token;
    });

    it('should get user profile with valid token', async () => {
      const res = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.username).toBe('testuser');
      expect(res.body.email).toBe('test@example.com');
    });

    it('should reject without token', async () => {
      const res = await request(app)
        .get('/api/users/profile');

      expect(res.status).toBe(401);
    });

    it('should reject with invalid token', async () => {
      const res = await request(app)
        .get('/api/users/profile')
        .set('Authorization', 'Bearer invalidtoken');

      expect(res.status).toBe(401);
    });
  });

  describe('PUT /api/users/profile - Update Profile', () => {
    let token;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/users')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        });
      token = res.body.token;
    });

    it('should update user profile', async () => {
      const res = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({
          profile: {
            firstName: 'John',
            lastName: 'Doe',
            location: 'New York',
            bio: 'Environmental enthusiast'
          }
        });

      expect(res.status).toBe(200);
      expect(res.body.profile.firstName).toBe('John');
      expect(res.body.profile.lastName).toBe('Doe');
    });

    it('should reject bio exceeding max length', async () => {
      const res = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({
          profile: {
            bio: 'a'.repeat(501)
          }
        });

      expect(res.status).toBe(400);
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .put('/api/users/profile')
        .send({
          profile: { firstName: 'John' }
        });

      expect(res.status).toBe(401);
    });
  });
});
