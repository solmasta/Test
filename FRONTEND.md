# EcoCycle Frontend - Deployment Guide

Complete guide to deploying the React frontend for the EcoCycle API.

## Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- Backend running on http://localhost:3000

### Installation

```bash
cd frontend
npm install
npm run dev
```

Frontend available at: `http://localhost:5173`

Vite dev server automatically proxies API calls to backend.

## Docker Development

With Docker Compose (includes both frontend and backend):

```bash
docker-compose up -d
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000`
- MongoDB: `localhost:27017`

View logs:
```bash
docker-compose logs -f frontend
```

## Production Deployment

### Build

```bash
cd frontend
npm install
npm run build
```

Creates optimized production bundle in `frontend/dist/`

### Option 1: Serve from Node.js Backend

Simplest approach - single deployment:

```bash
# Build frontend
cd frontend && npm run build && cd ..

# Copy dist folder to public directory
cp -r frontend/dist/* public/

# Start backend (serves frontend)
npm start
```

Then configure backend to serve static files:

```javascript
// In index.js after other middleware
app.use(express.static('public'));

// Fallback for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
```

### Option 2: Separate Deployment (Frontend Only)

Host frontend on dedicated server/CDN:

#### Static Hosting (Vercel, Netlify)

**Vercel:**
```bash
npm i -g vercel
cd frontend
vercel
```

**Netlify:**
```bash
npm i -g netlify-cli
cd frontend
netlify deploy --prod --dir=dist
```

Update `.env` in deployed frontend:
```
VITE_API_URL=https://your-api-domain.com/api
```

#### Docker (Standalone)

**Frontend Dockerfile** (production):
```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
ENV PORT=5173
EXPOSE 5173
CMD ["serve", "-s", "dist", "-l", "5173"]
```

**Run:**
```bash
docker build -t ecocycle-frontend .
docker run -p 5173:5173 -e VITE_API_URL=http://api.example.com/api ecocycle-frontend
```

### Option 3: Nginx Reverse Proxy

Serve frontend and proxy API through single nginx server:

**nginx.conf:**
```nginx
server {
  listen 80;
  server_name ecocycle.com;

  root /usr/share/nginx/html;
  index index.html;

  # Serve static files
  location ~* \.(js|css|png|jpg|jpeg|gif|icon|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }

  # API proxy
  location /api/ {
    proxy_pass http://backend:3000/api/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }

  # SPA fallback
  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

## Environment Configuration

### Development
```
VITE_API_URL=http://localhost:3000/api
```

### Production
```
VITE_API_URL=https://your-api-domain.com/api
```

Rebuild after changing:
```bash
npm run build
```

## Cloud Platform Deployments

### Vercel (Recommended for Frontend)

```bash
npm i -g vercel
cd frontend
vercel --prod
```

Vercel handles:
- Zero-config deployment
- Automatic builds
- Edge CDN for static files
- Preview URLs for branches
- Environment variables in UI

### Netlify

```bash
npm i -g netlify-cli
cd frontend

# Set environment
netlify env:set VITE_API_URL https://your-api.com/api

# Deploy
netlify deploy --prod --dir=dist
```

### AWS S3 + CloudFront

```bash
# Build
npm run build

# Deploy to S3
aws s3 sync dist/ s3://your-bucket --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

### Google Cloud Storage

```bash
# Build
npm run build

# Deploy
gsutil -m rsync -r -d dist gs://your-bucket

# Make public and set metadata
gsutil iam ch serviceAccount:your-sa@.iam.gserviceaccount.com:objectViewer gs://your-bucket
```

### Azure Static Web Apps

```bash
npm i -g @azure/static-web-apps-cli

# Deploy
swa deploy --build-command "npm run build" --app-location "frontend"
```

## Performance Optimization

### Built-in Optimizations

- Code splitting (automatic with Vite)
- Tree shaking (unused code removed)
- CSS minification
- JavaScript minification
- Image compression recommendations

### Additional Steps

1. **Enable Gzip Compression**
   ```nginx
   gzip on;
   gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
   gzip_min_length 1000;
   ```

2. **Cache Busting**
   - Vite automatically includes hashes in filenames
   - Set long cache headers for versioned assets

3. **CDN Integration**
   ```javascript
   // Use CDN URL for assets in production
   const imageUrl = import.meta.env.PROD 
     ? `https://cdn.example.com/images/...` 
     : `/images/...`;
   ```

4. **Lazy Loading**
   - React Router automatically code-splits routes
   - Use React.lazy() for component splitting

## Monitoring & Analytics

### Client-Side Monitoring

Add error tracking (Sentry):

```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://your-key@sentry.io/...",
  environment: import.meta.env.MODE,
  tracesSampleRate: 0.1,
});
```

### Performance Monitoring

Use Web Vitals:
```javascript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

### User Analytics

Connect Google Analytics:
```javascript
// In App.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function usePageTracking() {
  const location = useLocation();
  
  useEffect(() => {
    // Track page view
    window.gtag?.('config', 'GA_ID', {
      page_path: location.pathname,
    });
  }, [location]);
}
```

## Troubleshooting

### API Connection Issues

**Problem**: Frontend can't reach backend
**Solution**:
1. Check backend is running: `curl http://localhost:3000/health`
2. Verify VITE_API_URL in .env
3. Check CORS headers from backend
4. Check browser Network tab for actual URL being called

### Blank White Screen

**Problem**: Page shows nothing
**Solution**:
1. Check browser console for errors
2. Verify all dependencies installed: `npm install`
3. Clear node_modules and reinstall: `rm -rf node_modules && npm install`
4. Check Node.js version: `node --version` (requires 18+)

### CORS Errors

**Problem**: "Access to XMLHttpRequest blocked by CORS"
**Solution**: Backend must allow frontend origin:

```javascript
const cors = require('cors');
app.use(cors({
  origin: 'https://your-frontend-domain.com',
  credentials: true
}));
```

### 404 on Page Refresh

**Problem**: Direct URL navigation shows 404
**Solution**: Configure server to fallback to index.html for all routes

**Nginx:**
```nginx
try_files $uri $uri/ /index.html;
```

**Node.js:**
```javascript
app.get('*', (req, res) => {
  res.sendFile('index.html');
});
```

### Slow Performance

**Problem**: Frontend feels slow
**Solution**:
1. Check API response times (DevTools Network tab)
2. Enable HTTP compression on server
3. Use Chrome DevTools Performance tab to identify bottlenecks
4. Check bundle size: `npm run build` and review dist/ folder

## Security Checklist

- [ ] API URL uses HTTPS in production
- [ ] JWT tokens stored securely (localStorage acceptable, httpOnly better)
- [ ] No sensitive data in environment variables (frontend code is public)
- [ ] CORS properly configured on backend
- [ ] Content Security Policy headers set
- [ ] X-Frame-Options header set to DENY (prevent clickjacking)
- [ ] X-Content-Type-Options header set to nosniff
- [ ] Secure cookie flags set (if using cookies)

## Rollback Procedure

```bash
# If using Vercel
vercel rollback

# If using S3
aws s3 sync s3://your-bucket-backup dist/
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"

# If using Docker
docker pull registry/ecocycle-frontend:previous-tag
docker run -p 5173:5173 registry/ecocycle-frontend:previous-tag
```

## Maintenance

### Dependencies Update

```bash
npm update
npm audit fix  # Fix security vulnerabilities
npm run build  # Test build
git push       # Deploy updated version
```

### Build Size Monitoring

```bash
npm run build
du -sh dist/
# Monitor to catch unexpected size increases
```

### Cache Clearing

```bash
# Clear browser cache (add cache buster to assets)
# Or configure cache headers on server
```

## Multi-Environment Setup

**Development**: `http://localhost:5173` → `http://localhost:3000/api`
**Staging**: `https://staging.ecocycle.com` → `https://staging-api.ecocycle.com/api`
**Production**: `https://ecocycle.com` → `https://api.ecocycle.com/api`

Create environment files:
```
.env.development
.env.staging
.env.production
```

Build for each:
```bash
npm run build -- --mode production
```

---

**Status**: Frontend ready for production deployment ✅
