const request = require('supertest');
const app = require('../index');
require('./setup');

describe('Business Endpoints', () => {
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

  describe('POST /api/businesses - Create Business', () => {
    it('should create a business with valid data', async () => {
      const res = await request(app)
        .post('/api/businesses')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Green Restaurant',
          description: 'Organic and sustainable dining',
          category: 'restaurant',
          address: {
            street: '123 Main St',
            city: 'San Francisco',
            state: 'CA'
          },
          contact: {
            email: 'info@greenrestaurant.com',
            phone: '+14155551234'
          }
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.name).toBe('Green Restaurant');
    });

    it('should reject short business name', async () => {
      const res = await request(app)
        .post('/api/businesses')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'ab',
          description: 'A business',
          category: 'restaurant',
          address: { city: 'SF', state: 'CA' }
        });

      expect(res.status).toBe(400);
    });

    it('should reject invalid email format', async () => {
      const res = await request(app)
        .post('/api/businesses')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Green Restaurant',
          description: 'Organic dining',
          category: 'restaurant',
          address: { city: 'SF', state: 'CA' },
          contact: { email: 'notanemail' }
        });

      expect(res.status).toBe(400);
    });

    it('should allow optional contact fields', async () => {
      const res = await request(app)
        .post('/api/businesses')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Green Restaurant',
          description: 'Organic dining',
          category: 'restaurant',
          address: { city: 'SF', state: 'CA' }
        });

      expect(res.status).toBe(201);
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .post('/api/businesses')
        .send({
          name: 'Green Restaurant',
          description: 'Organic dining',
          category: 'restaurant',
          address: { city: 'SF', state: 'CA' }
        });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/businesses - Get All Businesses', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/businesses')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Green Restaurant',
          description: 'Organic dining',
          category: 'restaurant',
          address: { city: 'SF', state: 'CA' }
        });

      await request(app)
        .post('/api/businesses')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Eco Shop',
          description: 'Sustainable products',
          category: 'retail',
          address: { city: 'NYC', state: 'NY' }
        });
    });

    it('should get all businesses', async () => {
      const res = await request(app)
        .get('/api/businesses');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
    });

    it('should not require authentication', async () => {
      const res = await request(app)
        .get('/api/businesses');

      expect(res.status).toBe(200);
    });
  });

  describe('GET /api/businesses/:id - Get Specific Business', () => {
    let businessId;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/businesses')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Green Restaurant',
          description: 'Organic dining',
          category: 'restaurant',
          address: { city: 'SF', state: 'CA' }
        });
      businessId = res.body._id;
    });

    it('should get a specific business', async () => {
      const res = await request(app)
        .get(`/api/businesses/${businessId}`);

      expect(res.status).toBe(200);
      expect(res.body._id).toBe(businessId);
      expect(res.body.name).toBe('Green Restaurant');
    });

    it('should reject invalid ID format', async () => {
      const res = await request(app)
        .get('/api/businesses/invalidid');

      expect(res.status).toBe(400);
    });

    it('should return 404 for non-existent business', async () => {
      const res = await request(app)
        .get('/api/businesses/507f1f77bcf86cd799439011');

      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/businesses/:id/reviews - Add Review', () => {
    let businessId;
    let otherToken;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/businesses')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Green Restaurant',
          description: 'Organic dining',
          category: 'restaurant',
          address: { city: 'SF', state: 'CA' }
        });
      businessId = res.body._id;

      const otherRes = await request(app)
        .post('/api/users')
        .send({
          username: 'otheruser',
          email: 'other@example.com',
          password: 'password123'
        });
      otherToken = otherRes.body.token;
    });

    it('should add a review with valid data', async () => {
      const res = await request(app)
        .post(`/api/businesses/${businessId}/reviews`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send({
          rating: 5,
          comment: 'Great eco-friendly restaurant!'
        });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe('Review added');
    });

    it('should reject rating out of range', async () => {
      const res = await request(app)
        .post(`/api/businesses/${businessId}/reviews`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send({
          rating: 10,
          comment: 'Amazing!'
        });

      expect(res.status).toBe(400);
    });

    it('should reject zero rating', async () => {
      const res = await request(app)
        .post(`/api/businesses/${businessId}/reviews`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send({
          rating: 0,
          comment: 'Bad'
        });

      expect(res.status).toBe(400);
    });

    it('should allow review with only rating', async () => {
      const res = await request(app)
        .post(`/api/businesses/${businessId}/reviews`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send({
          rating: 4
        });

      expect(res.status).toBe(201);
    });

    it('should reject duplicate review from same user', async () => {
      await request(app)
        .post(`/api/businesses/${businessId}/reviews`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send({
          rating: 5,
          comment: 'Great!'
        });

      const res = await request(app)
        .post(`/api/businesses/${businessId}/reviews`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send({
          rating: 4,
          comment: 'Changed my mind'
        });

      expect(res.status).toBe(400);
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .post(`/api/businesses/${businessId}/reviews`)
        .send({
          rating: 5,
          comment: 'Great!'
        });

      expect(res.status).toBe(401);
    });
  });
});
