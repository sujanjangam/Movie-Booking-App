# 🔧 Backend Connection Troubleshooting

## Issues Found:

### 1. ❌ Frontend .env.local points to localhost
**Current:** `VITE_API_URL=http://localhost:5000/api`
**Should be:** `VITE_API_URL=http://13.50.193.121:5000/api`

### 2. ❌ Backend CORS missing EC2 IP
Backend needs `ALLOWED_ORIGINS` env variable with your EC2 frontend URL.

### 3. ❌ Missing environment variables in docker-compose
The `docker-compose.yml` doesn't pass `ALLOWED_ORIGINS` to backend.

---

## 🚀 Quick Fixes

### Step 1: SSH into EC2
```bash
ssh -i your-key.pem ubuntu@13.50.193.121
cd ~/Movie-Booking-App
```

### Step 2: Update Frontend Environment
```bash
echo "VITE_API_URL=http://13.50.193.121:5000/api" > frontend/.env.local
```

### Step 3: Add ALLOWED_ORIGINS to backend/.env
```bash
echo "ALLOWED_ORIGINS=http://13.50.193.121:5173,http://localhost:5173" >> backend/.env
```

### Step 4: Update docker-compose.yml
Add `ALLOWED_ORIGINS` to backend environment:
```yaml
services:
  backend:
    environment:
      - MONGO_URI=${MONGO_URI}
      - JWT_SECRET=${JWT_SECRET}
      - REDIS_URL=redis://redis:6379
      - ALLOWED_ORIGINS=${ALLOWED_ORIGINS}
      - NODE_ENV=production
```

### Step 5: Rebuild and Restart
```bash
docker compose down
docker compose build --no-cache
docker compose up -d
```

### Step 6: Verify
```bash
# Check containers are running
docker ps

# Check backend logs
docker compose logs backend --tail=50

# Test API directly
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"Test123!","phone":"1234567890"}'

# Should return: {"token":"...","user":{...}}
```

---

## 📋 Run Diagnostics

On EC2, run:
```bash
bash debug-backend.sh
```

This will check:
- ✅ Docker containers status
- ✅ Backend logs
- ✅ API connectivity
- ✅ Environment variables
- ✅ Port listening
- ✅ MongoDB connection
- ✅ Redis connection

---

## 🔍 Expected Output After Fixes

### docker ps
```
CONTAINER ID   IMAGE              STATUS         PORTS
abc123         backend:latest     Up 2 minutes   0.0.0.0:5000->5000/tcp
def456         redis:latest       Up 2 minutes   0.0.0.0:6379->6379/tcp
```

### docker compose logs backend (should see)
```
Server running on port 5000
MongoDB Connected
Redis connected successfully
```

### curl test (should return)
```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": "...",
    "name": "Test",
    "email": "test@test.com",
    "role": "user"
  }
}
```

---

## ⚠️ Common Issues

| Issue | Solution |
|-------|----------|
| Backend not starting | Check `docker compose logs backend` for MongoDB URI |
| Port 5000 not accessible | Check AWS Security Group allows port 5000 |
| CORS error in browser | Verify `ALLOWED_ORIGINS` includes EC2 IP |
| "Cannot connect to MongoDB" | Check `MONGO_URI` in backend/.env |
| "Redis connection failed" | Check redis container is running |

---

## 🎯 After Fixing, Test Registration

1. Open: `http://13.50.193.121:5173`
2. Click "Register"
3. Fill form and submit
4. Should see: "Registration successful" + redirect to login

If still failing, run the diagnostic script and send output.
