const request = require('supertest');
const app = require('../index');
require('./setup');

describe('Community Endpoints', () => {
  let token;
  let userId;

  beforeEach(async () => {
    const res = await request(app)
      .post('/api/users')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });
    token = res.body.token;
    userId = res.body._id;
  });

  describe('POST /api/communities - Create Community', () => {
    it('should create a community with valid data', async () => {
      const res = await request(app)
        .post('/api/communities')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Green Neighborhood',
          description: 'Community for eco-friendly living',
          location: 'San Francisco, CA'
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.name).toBe('Green Neighborhood');
      expect(res.body.members.length).toBe(1);
      expect(res.body.members[0].role).toBe('admin');
    });

    it('should reject short community name', async () => {
      const res = await request(app)
        .post('/api/communities')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'ab',
          description: 'A community',
          location: 'NYC'
        });

      expect(res.status).toBe(400);
    });

    it('should reject missing description', async () => {
      const res = await request(app)
        .post('/api/communities')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Green Community',
          location: 'NYC'
        });

      expect(res.status).toBe(400);
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .post('/api/communities')
        .send({
          name: 'Green Community',
          description: 'A community',
          location: 'NYC'
        });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/communities - Get All Communities', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/communities')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Green Neighborhood',
          description: 'Community for eco-friendly living',
          location: 'San Francisco'
        });

      await request(app)
        .post('/api/communities')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Eco Warriors',
          description: 'Fighting climate change',
          location: 'New York'
        });
    });

    it('should get all communities', async () => {
      const res = await request(app)
        .get('/api/communities');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
    });

    it('should not require authentication', async () => {
      const res = await request(app)
        .get('/api/communities');

      expect(res.status).toBe(200);
    });
  });

  describe('GET /api/communities/:id - Get Specific Community', () => {
    let communityId;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/communities')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Green Neighborhood',
          description: 'Community for eco-friendly living',
          location: 'San Francisco'
        });
      communityId = res.body._id;
    });

    it('should get a specific community', async () => {
      const res = await request(app)
        .get(`/api/communities/${communityId}`);

      expect(res.status).toBe(200);
      expect(res.body._id).toBe(communityId);
      expect(res.body.name).toBe('Green Neighborhood');
    });

    it('should reject invalid ID format', async () => {
      const res = await request(app)
        .get('/api/communities/invalidid');

      expect(res.status).toBe(400);
    });

    it('should return 404 for non-existent community', async () => {
      const res = await request(app)
        .get('/api/communities/507f1f77bcf86cd799439011');

      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/communities/:id/join - Join Community', () => {
    let communityId;
    let otherToken;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/communities')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Green Neighborhood',
          description: 'Community for eco-friendly living',
          location: 'San Francisco'
        });
      communityId = res.body._id;

      const otherRes = await request(app)
        .post('/api/users')
        .send({
          username: 'otheruser',
          email: 'other@example.com',
          password: 'password123'
        });
      otherToken = otherRes.body.token;
    });

    it('should join a community', async () => {
      const res = await request(app)
        .post(`/api/communities/${communityId}/join`)
        .set('Authorization', `Bearer ${otherToken}`);

      expect(res.status).toBe(200);
      expect(res.body.members.length).toBe(2);
    });

    it('should reject joining twice', async () => {
      await request(app)
        .post(`/api/communities/${communityId}/join`)
        .set('Authorization', `Bearer ${otherToken}`);

      const res = await request(app)
        .post(`/api/communities/${communityId}/join`)
        .set('Authorization', `Bearer ${otherToken}`);

      expect(res.status).toBe(400);
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .post(`/api/communities/${communityId}/join`);

      expect(res.status).toBe(401);
    });
  });

  describe('DELETE /api/communities/:id/leave - Leave Community', () => {
    let communityId;
    let otherToken;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/communities')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Green Neighborhood',
          description: 'Community for eco-friendly living',
          location: 'San Francisco'
        });
      communityId = res.body._id;

      const otherRes = await request(app)
        .post('/api/users')
        .send({
          username: 'otheruser',
          email: 'other@example.com',
          password: 'password123'
        });
      otherToken = otherRes.body.token;

      await request(app)
        .post(`/api/communities/${communityId}/join`)
        .set('Authorization', `Bearer ${otherToken}`);
    });

    it('should leave a community', async () => {
      const res = await request(app)
        .delete(`/api/communities/${communityId}/leave`)
        .set('Authorization', `Bearer ${otherToken}`);

      expect(res.status).toBe(200);
      expect(res.body.members.length).toBe(1);
    });

    it('should reject leaving if not a member', async () => {
      const newUserRes = await request(app)
        .post('/api/users')
        .send({
          username: 'newuser',
          email: 'new@example.com',
          password: 'password123'
        });

      const res = await request(app)
        .delete(`/api/communities/${communityId}/leave`)
        .set('Authorization', `Bearer ${newUserRes.body.token}`);

      expect(res.status).toBe(400);
    });
  });
});
