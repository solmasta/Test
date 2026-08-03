# EcoCycle on Railway - Deployment Guide

Complete guide to deploying EcoCycle to Railway (the easiest option!).

---

## Why Railway?

- ✅ **Easiest deployment** - Connect GitHub, auto-deploys on push
- ✅ **Built-in databases** - Add MongoDB with one click
- ✅ **Auto HTTPS** - Free SSL certificates
- ✅ **Environment variables** - Manage secrets safely
- ✅ **Custom domains** - Point your domain easily
- ✅ **Monitoring** - Built-in logs and metrics
- ✅ **Pay-as-you-go** - $5/month free credits

---

## Step 1: Create Railway Account

1. Go to https://railway.app
2. Click "Start Building"
3. Sign up with GitHub (recommended)
4. Authorize Railway access to your repositories

---

## Step 2: Create a New Project

1. Click "New Project" → "GitHub Repo"
2. Select your `solmasta/Test` repository
3. Click "Deploy Now"

Railway will:
- Detect Node.js project
- Build the backend
- Deploy automatically

---

## Step 3: Add MongoDB Service

1. In Railway dashboard, click "Add Service"
2. Select "Database" → "MongoDB"
3. Railway creates a managed MongoDB instance
4. Connection string auto-populated in environment

---

## Step 4: Configure Environment Variables

In Railway Dashboard → Variables:

```
NODE_ENV=production
JWT_SECRET=<generate-random-32-chars>
JWT_EXPIRES_IN=7d
PORT=3000
MONGODB_URI=<auto-filled-by-railway>
```

**Generate JWT_SECRET:**
```bash
openssl rand -hex 32
```

Or Railway will auto-generate one.

---

## Step 5: Deploy Backend

1. Backend deploys automatically when you push to `main`
2. Wait for build to complete (~2-3 minutes)
3. You'll get a Railway URL like: `https://ecocycle-api.up.railway.app`

---

## Step 6: Deploy Frontend

### Option A: Serve Frontend from Backend (Easiest)

1. Build frontend:
```bash
cd frontend
npm run build
```

2. Copy to backend's public folder:
```bash
cp -r frontend/dist/* public/
```

3. Update `index.js` to serve static files:
```javascript
// Add after other middleware
app.use(express.static('public'));

// Fallback for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
```

4. Commit and push:
```bash
git add .
git commit -m "Add built frontend to backend static files"
git push origin main
```

5. Railway auto-deploys

### Option B: Separate Frontend Deployment (Advanced)

Deploy frontend to Vercel:

```bash
cd frontend
npm install -g vercel
vercel --prod
```

Then update frontend environment:
```
VITE_API_URL=https://ecocycle-api.up.railway.app/api
```

---

## Step 7: Verify Deployment

### Check Backend
```bash
curl https://ecocycle-api.up.railway.app/health
```

Should return:
```json
{"status":"OK","timestamp":"..."}
```

### Check Frontend
Visit: `https://ecocycle-api.up.railway.app`

Or if deployed separately to Vercel:
Visit: `https://your-vercel-url.vercel.app`

### Check API Docs
Visit: `https://ecocycle-api.up.railway.app/api/docs`

---

## Step 8: Seed Demo Data (Optional)

SSH into Railway and run seeder:

```bash
# In Railway dashboard, click project → Shell
npm run seed
```

Or run locally before deploying:
```bash
npm run seed
git push  # Includes seeded data
```

---

## Step 9: Custom Domain (Optional)

1. In Railway dashboard → Settings → Domains
2. Add your domain (e.g., `ecocycle.com`)
3. Update DNS settings (Railway provides instructions)
4. Auto HTTPS with Let's Encrypt

---

## Post-Deployment

### Monitor Logs
Railway Dashboard → Logs
- View real-time application logs
- Error tracking
- Performance metrics

### Update Environment Variables
1. Dashboard → Variables
2. Edit any variable
3. Auto-redeploys with new values

### View Metrics
1. Dashboard → Metrics
2. Monitor CPU, memory, requests
3. See error rates and response times

---

## Troubleshooting

### Build Failed
**Error**: "build failed"
- Check `railway.json` exists
- Verify `npm start` works locally
- Check logs in Railway dashboard

**Fix**:
```bash
npm install
npm start  # Test locally first
git push
```

### MongoDB Connection Error
**Error**: "connect ECONNREFUSED"
- Ensure MongoDB service added to project
- Check `MONGODB_URI` in variables
- Wait 30 seconds after adding service

**Fix**:
1. Railway Dashboard → Add Service → MongoDB
2. Wait for service to start
3. Check MONGODB_URI is populated
4. Redeploy

### Frontend Not Loading
**Error**: "Cannot GET /"
- If serving from backend: verify `public` folder deployed
- If separate deployment: check VITE_API_URL

**Fix**:
```bash
# Option A: Rebuild frontend in backend
npm run build
cp -r frontend/dist/* public/
git push

# Option B: Deploy frontend separately to Vercel
cd frontend && vercel --prod
```

### Environment Variables Not Set
**Error**: "Missing JWT_SECRET"
- Verify variables entered in Railway dashboard
- Variables need to be set BEFORE deploy
- After changing, click "Redeploy"

**Fix**:
1. Go to Railway Variables
2. Add JWT_SECRET=<value>
3. Click "Redeploy"

---

## Commands Reference

```bash
# Test locally before deploying
npm install
npm start

# Build frontend for backend serving
cd frontend
npm run build
cp -r dist/* ../public/

# Push to deploy
git push origin main

# Monitor after deploy
railway logs  # View logs

# SSH into running app
railway shell

# Redeploy
railway up
```

---

## Cost Estimation

**Free Plan**:
- $5/month credits (usually enough!)
- 100GB bandwidth
- MongoDB included

**Typical Monthly Cost**:
- Small app (< 1000 users): Free
- Medium app (1000-10k users): $5-20
- Large app (10k+ users): $50+

---

## Security Checklist

- [ ] JWT_SECRET set to strong random value
- [ ] MONGODB_URI uses Railway's managed database
- [ ] NODE_ENV=production
- [ ] Health checks configured
- [ ] Logs monitored for errors
- [ ] Custom domain with HTTPS
- [ ] Environment variables protected
- [ ] Database backups enabled (Railway does this)

---

## Next Steps

1. **Set up monitoring** - Enable error tracking (Sentry)
2. **Configure email** - Send notifications
3. **Add CDN** - Speed up static assets
4. **Scale database** - Enable replica sets
5. **Add caching** - Redis for performance

---

## Support

- Railway Docs: https://docs.railway.app
- Railway Status: https://status.railway.app
- Support: support@railway.app

---

**Status**: Ready to deploy! 🚀

Next: Follow steps 1-9 above to go live in 10 minutes.
