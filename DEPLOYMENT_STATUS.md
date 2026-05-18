# 🚀 Deployment Status & Fixes

## ⚠️ Current Issues

### 1. Browser Extension Warnings (IGNORE)
```
Error: A listener indicated an asynchronous response by returning true...
```
**Cause:** Browser extension (React DevTools, etc.)  
**Solution:** Ignore - this is harmless  
**Test:** Open in incognito mode - error disappears

---

### 2. Backend 404 Errors (REAL ISSUE)
```
Failed to load resource: the server responded with a status of 404
GET /api/shows - 404
```

**Cause:** Render backend is NOT deployed with latest code

**What's Missing on Render:**
- ✅ Role & tenantId in login response
- ✅ Updated show routes
- ✅ Fixed booking validation
- ✅ Seat price fixes

---

## 🔧 How to Fix

### Option 1: Redeploy Render Backend (Recommended)

1. **Go to Render Dashboard**
   - https://dashboard.render.com

2. **Find your backend service**
   - Click on "movie-booking-api" (or your service name)

3. **Manual Deploy**
   - Click "Manual Deploy" button
   - Select "Deploy latest commit"
   - Wait 2-3 minutes

4. **Verify Deployment**
   - Check logs for "Server running on port 5000"
   - Test: `https://movie-booking-api-r4nm.onrender.com/api/shows`

---

### Option 2: Run Backend Locally

```bash
cd backend
npm install
npm start
```

Then update frontend `.env`:
```
VITE_API_URL=http://localhost:5000/api
```

---

## ✅ After Backend is Deployed

### 1. Clear Browser Storage
```javascript
// Open browser console (F12)
localStorage.clear()
```

### 2. Logout & Login Again
```
Email: admin@test.com
Password: admin123
```

### 3. Verify Role is Saved
```javascript
// In console
JSON.parse(localStorage.getItem("user"))

// Should show:
{
  "_id": "...",
  "name": "Tenant Admin",
  "email": "admin@test.com",
  "role": "TENANT_ADMIN",  // ✅ This should be present
  "tenantId": "..."
}
```

### 4. Test Admin Dashboard
- Go to `/admin`
- Should see 6 cards:
  - 🎥 Manage Movies
  - 🏛️ Manage Theatres
  - 🎭 Create Shows
  - 📊 Analytics
  - 🎫 Browse Movies
  - 📋 My Bookings

---

## 🔍 How to Check if Backend is Updated

### Test Login Response
```bash
curl -X POST https://movie-booking-api-r4nm.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"admin123"}'
```

**Expected Response:**
```json
{
  "user": {
    "_id": "...",
    "name": "Tenant Admin",
    "email": "admin@test.com",
    "role": "TENANT_ADMIN",     // ✅ Should be present
    "tenantId": "..."           // ✅ Should be present
  },
  "token": "..."
}
```

**If role is missing:** Backend not deployed yet

---

## 📋 Deployment Checklist

- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel
- [ ] Environment variables set correctly
- [ ] Database connected (MongoDB Atlas)
- [ ] Test login returns role & tenantId
- [ ] Admin dashboard shows all cards
- [ ] Forms have proper styling

---

## 🎯 Quick Summary

**Problem:** Backend on Render is outdated  
**Solution:** Redeploy backend on Render  
**Then:** Clear localStorage, login again  
**Result:** Admin dashboard will work perfectly

---

## 🔗 Useful Links

- **Render Dashboard:** https://dashboard.render.com
- **Vercel Dashboard:** https://vercel.com/dashboard
- **MongoDB Atlas:** https://cloud.mongodb.com
- **GitHub Repo:** https://github.com/sujanjangam/Movie-Booking-App

---

**Last Updated:** After fixing auth controller to include role & tenantId
