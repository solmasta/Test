const request = require('supertest');
const app = require('../index');
require('./setup');

describe('Waste Log Endpoints', () => {
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

  describe('POST /api/waste-logs - Create Waste Log', () => {
    it('should create a waste log with valid data', async () => {
      const res = await request(app)
        .post('/api/waste-logs')
        .set('Authorization', `Bearer ${token}`)
        .send({
          category: 'food',
          amount: 500,
          unit: 'grams',
          description: 'Food scraps from dinner'
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.category).toBe('food');
      expect(res.body.amount).toBe(500);
      expect(res.body.unit).toBe('grams');
    });

    it('should reject invalid category', async () => {
      const res = await request(app)
        .post('/api/waste-logs')
        .set('Authorization', `Bearer ${token}`)
        .send({
          category: 'invalid',
          amount: 500,
          unit: 'grams'
        });

      expect(res.status).toBe(400);
    });

    it('should reject negative amount', async () => {
      const res = await request(app)
        .post('/api/waste-logs')
        .set('Authorization', `Bearer ${token}`)
        .send({
          category: 'plastic',
          amount: -100,
          unit: 'grams'
        });

      expect(res.status).toBe(400);
    });

    it('should reject invalid unit', async () => {
      const res = await request(app)
        .post('/api/waste-logs')
        .set('Authorization', `Bearer ${token}`)
        .send({
          category: 'plastic',
          amount: 100,
          unit: 'invalid'
        });

      expect(res.status).toBe(400);
    });

    it('should reject without authentication', async () => {
      const res = await request(app)
        .post('/api/waste-logs')
        .send({
          category: 'food',
          amount: 500,
          unit: 'grams'
        });

      expect(res.status).toBe(401);
    });

    it('should calculate eco score impact', async () => {
      const res = await request(app)
        .post('/api/waste-logs')
        .set('Authorization', `Bearer ${token}`)
        .send({
          category: 'food',
          amount: 1000,
          unit: 'grams'
        });

      expect(res.status).toBe(201);
      expect(res.body.ecoScoreImpact).toBe(100);
    });
  });

  describe('GET /api/waste-logs - Get Waste Logs', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/waste-logs')
        .set('Authorization', `Bearer ${token}`)
        .send({
          category: 'food',
          amount: 500,
          unit: 'grams'
        });

      await request(app)
        .post('/api/waste-logs')
        .set('Authorization', `Bearer ${token}`)
        .send({
          category: 'plastic',
          amount: 250,
          unit: 'grams'
        });
    });

    it('should get all waste logs for user', async () => {
      const res = await request(app)
        .get('/api/waste-logs')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .get('/api/waste-logs');

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/waste-logs/:id - Get Specific Waste Log', () => {
    let wasteLogId;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/waste-logs')
        .set('Authorization', `Bearer ${token}`)
        .send({
          category: 'food',
          amount: 500,
          unit: 'grams'
        });
      wasteLogId = res.body._id;
    });

    it('should get a specific waste log', async () => {
      const res = await request(app)
        .get(`/api/waste-logs/${wasteLogId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body._id).toBe(wasteLogId);
    });

    it('should reject invalid ID format', async () => {
      const res = await request(app)
        .get('/api/waste-logs/invalidid')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(400);
    });

    it('should reject non-existent waste log', async () => {
      const res = await request(app)
        .get('/api/waste-logs/507f1f77bcf86cd799439011')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
    });
  });

  describe('PUT /api/waste-logs/:id - Update Waste Log', () => {
    let wasteLogId;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/waste-logs')
        .set('Authorization', `Bearer ${token}`)
        .send({
          category: 'food',
          amount: 500,
          unit: 'grams'
        });
      wasteLogId = res.body._id;
    });

    it('should update a waste log', async () => {
      const res = await request(app)
        .put(`/api/waste-logs/${wasteLogId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          amount: 750,
          description: 'Updated description'
        });

      expect(res.status).toBe(200);
      expect(res.body.amount).toBe(750);
    });

    it('should reject invalid category on update', async () => {
      const res = await request(app)
        .put(`/api/waste-logs/${wasteLogId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          category: 'invalid'
        });

      expect(res.status).toBe(400);
    });
  });

  describe('DELETE /api/waste-logs/:id - Delete Waste Log', () => {
    let wasteLogId;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/waste-logs')
        .set('Authorization', `Bearer ${token}`)
        .send({
          category: 'food',
          amount: 500,
          unit: 'grams'
        });
      wasteLogId = res.body._id;
    });

    it('should delete a waste log', async () => {
      const res = await request(app)
        .delete(`/api/waste-logs/${wasteLogId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);

      const getRes = await request(app)
        .get(`/api/waste-logs/${wasteLogId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(getRes.status).toBe(404);
    });
  });
});
