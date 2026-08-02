const request = require('supertest');
const app = require('../index');
require('./setup');

describe('Challenge Endpoints', () => {
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

  describe('POST /api/challenges - Create Challenge', () => {
    it('should create a challenge with valid data', async () => {
      const res = await request(app)
        .post('/api/challenges')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Zero Waste Week',
          description: 'Produce no waste for a week',
          category: 'waste-reduction',
          difficulty: 'medium',
          points: 50,
          duration: 7
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.title).toBe('Zero Waste Week');
      expect(res.body.points).toBe(50);
    });

    it('should reject short title', async () => {
      const res = await request(app)
        .post('/api/challenges')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'ab',
          description: 'A challenge',
          category: 'waste-reduction',
          difficulty: 'easy',
          points: 10,
          duration: 1
        });

      expect(res.status).toBe(400);
    });

    it('should reject invalid difficulty', async () => {
      const res = await request(app)
        .post('/api/challenges')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Zero Waste Week',
          description: 'Produce no waste',
          category: 'waste-reduction',
          difficulty: 'impossible',
          points: 50,
          duration: 7
        });

      expect(res.status).toBe(400);
    });

    it('should reject negative points', async () => {
      const res = await request(app)
        .post('/api/challenges')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Zero Waste Week',
          description: 'Produce no waste',
          category: 'waste-reduction',
          difficulty: 'medium',
          points: -50,
          duration: 7
        });

      expect(res.status).toBe(400);
    });

    it('should reject zero duration', async () => {
      const res = await request(app)
        .post('/api/challenges')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Zero Waste Week',
          description: 'Produce no waste',
          category: 'waste-reduction',
          difficulty: 'medium',
          points: 50,
          duration: 0
        });

      expect(res.status).toBe(400);
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .post('/api/challenges')
        .send({
          title: 'Zero Waste Week',
          description: 'Produce no waste',
          category: 'waste-reduction',
          difficulty: 'medium',
          points: 50,
          duration: 7
        });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/challenges - Get All Challenges', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/challenges')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Zero Waste Week',
          description: 'Produce no waste',
          category: 'waste-reduction',
          difficulty: 'medium',
          points: 50,
          duration: 7
        });

      await request(app)
        .post('/api/challenges')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Plastic Free Month',
          description: 'Use no plastic',
          category: 'plastic-reduction',
          difficulty: 'hard',
          points: 100,
          duration: 30
        });
    });

    it('should get all active challenges', async () => {
      const res = await request(app)
        .get('/api/challenges');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
    });

    it('should not require authentication', async () => {
      const res = await request(app)
        .get('/api/challenges');

      expect(res.status).toBe(200);
    });
  });

  describe('GET /api/challenges/:id - Get Specific Challenge', () => {
    let challengeId;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/challenges')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Zero Waste Week',
          description: 'Produce no waste',
          category: 'waste-reduction',
          difficulty: 'medium',
          points: 50,
          duration: 7
        });
      challengeId = res.body._id;
    });

    it('should get a specific challenge', async () => {
      const res = await request(app)
        .get(`/api/challenges/${challengeId}`);

      expect(res.status).toBe(200);
      expect(res.body._id).toBe(challengeId);
      expect(res.body.title).toBe('Zero Waste Week');
    });

    it('should reject invalid ID format', async () => {
      const res = await request(app)
        .get('/api/challenges/invalidid');

      expect(res.status).toBe(400);
    });

    it('should return 404 for non-existent challenge', async () => {
      const res = await request(app)
        .get('/api/challenges/507f1f77bcf86cd799439011');

      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/challenges/:id/join - Join Challenge', () => {
    let challengeId;
    let otherToken;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/challenges')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Zero Waste Week',
          description: 'Produce no waste',
          category: 'waste-reduction',
          difficulty: 'medium',
          points: 50,
          duration: 7
        });
      challengeId = res.body._id;

      const otherRes = await request(app)
        .post('/api/users')
        .send({
          username: 'otheruser',
          email: 'other@example.com',
          password: 'password123'
        });
      otherToken = otherRes.body.token;
    });

    it('should join a challenge', async () => {
      const res = await request(app)
        .post(`/api/challenges/${challengeId}/join`)
        .set('Authorization', `Bearer ${otherToken}`);

      expect(res.status).toBe(200);
      expect(res.body.participants.length).toBe(1);
    });

    it('should reject joining twice', async () => {
      await request(app)
        .post(`/api/challenges/${challengeId}/join`)
        .set('Authorization', `Bearer ${otherToken}`);

      const res = await request(app)
        .post(`/api/challenges/${challengeId}/join`)
        .set('Authorization', `Bearer ${otherToken}`);

      expect(res.status).toBe(400);
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .post(`/api/challenges/${challengeId}/join`);

      expect(res.status).toBe(401);
    });
  });

  describe('PUT /api/challenges/:id/complete - Complete Challenge', () => {
    let challengeId;
    let participantToken;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/challenges')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Zero Waste Week',
          description: 'Produce no waste',
          category: 'waste-reduction',
          difficulty: 'medium',
          points: 50,
          duration: 7
        });
      challengeId = res.body._id;

      const participantRes = await request(app)
        .post('/api/users')
        .send({
          username: 'participant',
          email: 'participant@example.com',
          password: 'password123'
        });
      participantToken = participantRes.body.token;

      await request(app)
        .post(`/api/challenges/${challengeId}/join`)
        .set('Authorization', `Bearer ${participantToken}`);
    });

    it('should complete a challenge', async () => {
      const res = await request(app)
        .put(`/api/challenges/${challengeId}/complete`)
        .set('Authorization', `Bearer ${participantToken}`);

      expect(res.status).toBe(200);
      expect(res.body.participants[0].completed).toBe(true);
    });

    it('should reject completing twice', async () => {
      await request(app)
        .put(`/api/challenges/${challengeId}/complete`)
        .set('Authorization', `Bearer ${participantToken}`);

      const res = await request(app)
        .put(`/api/challenges/${challengeId}/complete`)
        .set('Authorization', `Bearer ${participantToken}`);

      expect(res.status).toBe(400);
    });

    it('should reject if not a participant', async () => {
      const newUserRes = await request(app)
        .post('/api/users')
        .send({
          username: 'newuser',
          email: 'new@example.com',
          password: 'password123'
        });

      const res = await request(app)
        .put(`/api/challenges/${challengeId}/complete`)
        .set('Authorization', `Bearer ${newUserRes.body.token}`);

      expect(res.status).toBe(400);
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .put(`/api/challenges/${challengeId}/complete`);

      expect(res.status).toBe(401);
    });
  });
});
