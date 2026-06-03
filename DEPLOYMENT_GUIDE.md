# 🚀 Production Deployment Guide

## Backend Deployment (Render/Railway/Heroku)

### Environment Variables Required
```
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/movieDB
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
NODE_ENV=production
ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://your-domain.com
```

### Deploy to Render
1. Create new Web Service
2. Connect GitHub repo
3. Build command: `cd backend && npm install`
4. Start command: `cd backend && npm start`
5. Add environment variables
6. Deploy!

### Deploy to Railway
1. Create new project
2. Deploy from GitHub
3. Set root directory: `/backend`
4. Add environment variables
5. Deploy!

## Frontend Deployment (Vercel)

### Environment Variables Required
Create `.env.local`:
```
VITE_API_URL=https://your-backend-api.render.com/api
```

### Update axios.js
```javascript
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});
```

### Deploy to Vercel
1. `cd frontend`
2. `npm run build`
3. `vercel --prod`
4. Add environment variable `VITE_API_URL`

## MongoDB Atlas Setup
1. Create free cluster
2. Create database user
3. Whitelist IP: `0.0.0.0/0` (allow from anywhere)
4. Copy connection string
5. Add to backend `.env`

## Post-Deployment
1. Create SUPER_ADMIN via backend API
2. Create tenants (PVR, INOX, etc.)
3. Create TENANT_ADMIN users
4. Add movies, theatres, shows
5. Test booking flow

## Monitoring
- Check backend logs: `heroku logs --tail` or Render dashboard
- Check MongoDB Atlas logs
- Monitor API response times

## Security Checklist
✅ Environment variables set
✅ CORS configured properly
✅ MongoDB Atlas IP whitelist configured
✅ JWT_SECRET is strong (32+ characters)
✅ Passwords hashed with bcrypt
✅ No sensitive data in Git

## Troubleshooting
- **500 errors**: Check MongoDB connection
- **CORS errors**: Add frontend URL to ALLOWED_ORIGINS
- **401 errors**: Check JWT_SECRET matches
- **API not loading**: Check baseURL in axios.js
