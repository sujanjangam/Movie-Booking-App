# 🔧 Manual EC2 Deployment Fix

## The Root Cause:
- `docker-compose.yml` reads from **root .env** file
- You only had `backend/.env` file
- Docker Compose couldn't find the environment variables

---

## ✅ SOLUTION: Run These Commands on EC2

### Step 1: SSH into EC2
```bash
ssh -i your-key.pem ubuntu@13.50.193.121
cd ~/Movie-Booking-App
```

### Step 2: Pull Latest Changes
```bash
git pull origin main
```

### Step 3: Create Root .env File
```bash
nano .env
```

Paste this content:
```env
MONGO_URI=mongodb+srv://sujanss7704_db_user:TQqeGMviBn9KgfeI@booking-app.m2vx1fm.mongodb.net/movieDB
JWT_SECRET=your_secret_key_change_in_production
ALLOWED_ORIGINS=http://13.50.193.121:5173,http://localhost:5173
NODE_ENV=production
```

Save: `Ctrl+X`, then `Y`, then `Enter`

### Step 4: Verify .env File
```bash
cat .env
```

Should show all 4 variables.

### Step 5: Clean Restart
```bash
docker compose down --remove-orphans
docker compose up -d --build
```

### Step 6: Wait & Check
```bash
# Wait 15 seconds
sleep 15

# Check containers
docker ps
```

Expected output:
```
CONTAINER ID   IMAGE                           STATUS
abc123         movie-booking-app-backend-1     Up 30 seconds
def456         redis:latest                    Up 30 seconds
```

### Step 7: Check Backend Logs
```bash
docker compose logs backend --tail=50
```

Should see:
```
✅ Server running on port 5000
✅ MongoDB Connected
✅ Redis connected successfully
```

### Step 8: Test API
```bash
curl http://localhost:5000
```

Should return JSON with "API Running".

### Step 9: Test Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"Test123!","phone":"1234567890"}'
```

Should return token and user object.

### Step 10: Test Frontend
Open: `http://13.50.193.121:5173`
- Click "Register"
- Fill form
- Submit
- Should work! ✅

---

## 🚨 If Still Failing:

### Check Environment Variables in Container:
```bash
docker compose exec backend printenv | grep -E "MONGO|JWT|REDIS|ALLOWED"
```

Should show:
```
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret_key...
REDIS_URL=redis://redis:6379
ALLOWED_ORIGINS=http://13.50.193.121:5173...
```

### Check Backend Logs for Errors:
```bash
docker compose logs backend | grep -i error
```

### Restart Individual Service:
```bash
docker compose restart backend
docker compose logs backend --tail=30
```

### Nuclear Option (Full Reset):
```bash
docker compose down --volumes --remove-orphans
docker system prune -af
docker compose up -d --build
```

---

## 📁 File Structure After Fix:

```
Movie-Booking-App/
├── .env                          ← NEW! (Root level for docker-compose)
├── docker-compose.yml            ← Reads from root .env
├── backend/
│   ├── .env                      ← Backend still has its own
│   └── ...
└── frontend/
    ├── .env.local                ← Updated with EC2 IP
    └── ...
```

---

## ✅ Success Indicators:

1. `docker ps` shows both containers UP
2. Backend logs show "MongoDB Connected"
3. `curl http://localhost:5000` returns JSON
4. Frontend can register users
5. No CORS errors in browser console

---

## 🎯 Quick Test Commands:

```bash
# One-liner health check
docker ps && docker compose logs backend --tail=5 && curl -s http://localhost:5000 | jq .

# Or use the automated script
bash restart-clean.sh
```
