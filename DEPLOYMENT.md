# EcoCycle API - Deployment Guide

## Quick Start (Local)

### Prerequisites
- Node.js 18+ or Docker
- MongoDB 7.0+

### Option 1: Local Installation

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env

# Edit .env with your values
MONGODB_URI=mongodb://localhost:27017/ecocycle
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
NODE_ENV=production

# Start MongoDB
mongod

# Run server
npm start

# API available at: http://localhost:3000
# Docs at: http://localhost:3000/api/docs
```

### Option 2: Docker (Recommended)

```bash
# Build and start with Docker Compose
docker-compose up -d

# API available at: http://localhost:3000
# MongoDB at: localhost:27017

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

---

## Cloud Deployment

### Heroku

```bash
# Install Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# Login
heroku login

# Create app
heroku create ecocycle-api

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=$(openssl rand -hex 32)
heroku config:set JWT_EXPIRES_IN=7d
heroku config:set MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ecocycle

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### Railway.app

```bash
# Connect GitHub account
# Create new project from repo
# Configure environment variables in dashboard
# Deploy from main branch
```

### AWS Elastic Beanstalk

```bash
# Install EB CLI
pip install awsebcli

# Initialize
eb init -p node.js-18 ecocycle-api

# Set environment variables
eb setenv NODE_ENV=production JWT_SECRET=your-secret MONGODB_URI=your-uri

# Create environment
eb create ecocycle-env

# Deploy
eb deploy
```

### Google Cloud Run

```bash
# Create project
gcloud projects create ecocycle-api

# Build container
gcloud builds submit --tag gcr.io/PROJECT_ID/ecocycle-api

# Deploy
gcloud run deploy ecocycle-api \
  --image gcr.io/PROJECT_ID/ecocycle-api \
  --platform managed \
  --region us-central1 \
  --set-env-vars="MONGODB_URI=your-uri,JWT_SECRET=your-secret"
```

### DigitalOcean App Platform

```bash
# 1. Push to GitHub
git push origin main

# 2. Create app on DigitalOcean Dashboard
# 3. Select GitHub repo
# 4. Set environment variables
# 5. Deploy
```

---

## Environment Variables

### Required
```env
JWT_SECRET=your-secret-key-min-32-chars
JWT_EXPIRES_IN=7d
```

### Optional
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://localhost:27017/ecocycle
```

### Generate Secure JWT Secret
```bash
# macOS/Linux
openssl rand -hex 32

# Windows PowerShell
[Convert]::ToHexString((Get-Random -Count 16 -InputObject (0..255)))
```

---

## Pre-Deployment Checklist

- [ ] `NODE_ENV=production` set
- [ ] `JWT_SECRET` is secure (min 32 characters)
- [ ] `MONGODB_URI` points to production database
- [ ] All tests pass: `npm test`
- [ ] No debug code left in codebase
- [ ] Rate limiting is enabled
- [ ] Error handling is in place
- [ ] Security headers (Helmet) enabled
- [ ] CORS properly configured
- [ ] Health check endpoint working: `/health`
- [ ] API docs accessible: `/api/docs`

---

## Database Setup

### MongoDB Atlas (Cloud)

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create cluster
3. Create database user
4. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/dbname`
5. Add IP whitelist (or allow all for development)
6. Set `MONGODB_URI` to connection string

### Local MongoDB

```bash
# macOS
brew install mongodb-community
brew services start mongodb-community

# Linux
sudo apt-get install mongodb
sudo systemctl start mongod

# Windows
# Download from: https://www.mongodb.com/try/download/community
# Follow installer
```

---

## Monitoring & Logging

### Structured Logs
The API logs JSON-formatted messages with request IDs:
```json
{
  "level": "INFO",
  "timestamp": "2026-08-02T...",
  "requestId": "uuid",
  "method": "POST",
  "statusCode": 201,
  "duration": "45ms"
}
```

### Log Aggregation Services
- **Datadog**: Collect logs with agent
- **New Relic**: APM + logs
- **Loggly**: Cloud logging
- **ELK Stack**: Elasticsearch + Logstash + Kibana

### Health Checks
```bash
# Health check endpoint
curl http://localhost:3000/health

# Response
{
  "status": "OK",
  "timestamp": "2026-08-02T..."
}
```

### Performance Monitoring
- Database indexes active (20+ indexes)
- Rate limiting enforced (4-tier)
- Pagination limited (max 100 items/page)
- Request IDs enable tracing

---

## Security Checklist

- [x] Input validation on all endpoints
- [x] Rate limiting enabled
- [x] Password hashing with bcrypt
- [x] JWT authentication
- [x] CORS protection
- [x] Security headers (Helmet)
- [x] Environment variables for secrets
- [x] HTTPS in production (use reverse proxy)
- [x] Database credentials secure
- [x] Error messages don't leak info
- [ ] HTTPS/SSL certificate (set up in production)
- [ ] Database backups (set up external)
- [ ] Regular security audits

---

## Scaling Recommendations

### Database
- Enable MongoDB sharding for large datasets
- Set up read replicas for scaling reads
- Configure backup strategy (daily snapshots)
- Monitor disk usage

### Application
- Use reverse proxy (nginx) for load balancing
- Deploy multiple instances behind load balancer
- Use CDN for static assets
- Enable caching layer (Redis) for frequently accessed data

### Infrastructure
- Auto-scaling groups based on CPU/memory
- Health checks on all instances
- Automated deployments (CI/CD)
- Blue-green deployments for zero downtime

---

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Ensure MongoDB is running
```bash
mongod  # or: brew services start mongodb-community
```

### JWT Secret Not Set
```
Error: Missing required environment variable: JWT_SECRET
```
**Solution**: Set environment variable
```bash
export JWT_SECRET=your-secret-key
```

### Port Already in Use
```
Error: listen EADDRINUSE :::3000
```
**Solution**: Use different port or kill process
```bash
PORT=3001 npm start
# OR
lsof -i :3000  # find process
kill -9 <PID>
```

### Rate Limit Blocking Requests
```
Error: Too many requests from this IP
```
**Solution**: Wait 15 minutes or test with different IP

---

## Rollback Procedure

If something breaks in production:

```bash
# 1. Revert to previous version
git revert <commit-hash>

# 2. Deploy previous version
git push heroku main

# 3. Or restore from Docker image
docker run -e MONGODB_URI=... ecocycle-api:previous-tag

# 4. Check health
curl https://api.ecocycle.com/health
```

---

## Production Deployment Command

```bash
# Final checks
npm test
npm run lint  # if available

# Build Docker image
docker build -t ecocycle-api:1.0.0 .

# Tag for registry
docker tag ecocycle-api:1.0.0 your-registry/ecocycle-api:1.0.0

# Push to registry
docker push your-registry/ecocycle-api:1.0.0

# Deploy
# (Use your hosting platform's deployment method)

# Verify
curl https://api.ecocycle.com/health
curl https://api.ecocycle.com/api/docs
```

---

## Support & Documentation

- **API Docs**: `/api/docs` (Swagger UI)
- **GitHub**: Your repository
- **Issues**: Report bugs in GitHub Issues
- **Testing**: `npm test` (requires MongoDB)

---

**Status**: Ready for production deployment ✅
