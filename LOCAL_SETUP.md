# Local Development Setup Guide

## Prerequisites
- Node.js (v18 or higher)
- MongoDB connection (already configured)
- Git

---

## Quick Start (3 Steps)

### Step 1: Fix PowerShell Execution Policy

**Open PowerShell as Administrator** and run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**OR use Command Prompt (cmd) instead of PowerShell**

---

### Step 2: Start Backend Server

**Option A - Using Command Prompt (Recommended):**
```cmd
cd c:\Users\Athmika B S\Movie-Booking-App\backend
npm install
npm start
```

**Option B - Using PowerShell:**
```powershell
cd "c:\Users\Athmika B S\Movie-Booking-App\backend"
npm install
npm start
```

Backend will run on: **http://localhost:5000**

---

### Step 3: Start Frontend (In New Terminal)

**Option A - Using Command Prompt (Recommended):**
```cmd
cd c:\Users\Athmika B S\Movie-Booking-App\frontend
npm install
npm run dev
```

**Option B - Using PowerShell:**
```powershell
cd "c:\Users\Athmika B S\Movie-Booking-App\frontend"
npm install
npm run dev
```

Frontend will run on: **http://localhost:5173**

---

## Alternative: Run via npm.cmd (No Policy Change Needed)

If you don't want to change execution policy:

**Backend:**
```cmd
cd c:\Users\Athmika B S\Movie-Booking-App\backend
npm.cmd install
npm.cmd start
```

**Frontend:**
```cmd
cd c:\Users\Athmika B S\Movie-Booking-App\frontend
npm.cmd install
npm.cmd run dev
```

---

## Environment Configuration

### Backend (.env) ✅ Already Configured
```
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
```

### Frontend (.env.local) ✅ Already Configured
```
VITE_API_URL=http://localhost:5000/api
```

---

## Verify Setup

1. **Backend Health Check:**
   - Open: http://localhost:5000
   - Should see: `{"message":"API Running","version":"2.0.0",...}`

2. **Frontend Access:**
   - Open: http://localhost:5173
   - Should see: Movie Booking App homepage

3. **MongoDB Connection:**
   - Backend console should show: `MongoDB Connected`

---

## Common Issues & Solutions

### Issue 1: PowerShell Script Execution Error
**Error:** `running scripts is disabled on this system`

**Solution:**
- Use Command Prompt (cmd) instead of PowerShell
- OR run as Administrator: `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`

---

### Issue 2: Port Already in Use
**Error:** `Port 5000 is already in use`

**Solution:**
```cmd
# Find process using port
netstat -ano | findstr :5000

# Kill process (replace PID with actual number)
taskkill /PID <PID> /F
```

---

### Issue 3: Module Not Found
**Error:** `Cannot find module`

**Solution:**
```cmd
# Delete node_modules and reinstall
rmdir /s /q node_modules
del package-lock.json
npm install
```

---

### Issue 4: MongoDB Connection Error
**Error:** `MongoNetworkError`

**Solution:**
- Check internet connection
- Verify MongoDB URI in backend/.env
- Ensure MongoDB Atlas allows your IP address

---

## Development Scripts

### Backend Scripts
```bash
npm start          # Start server (production)
npm run dev        # Start with nodemon (auto-reload)
```

### Frontend Scripts
```bash
npm run dev        # Start Vite dev server
npm run build      # Build for production
npm run preview    # Preview production build
```

---

## Test Accounts

After backend starts, create test accounts:

```cmd
cd backend
node createQAAccounts.js
```

This creates admin and user test accounts.

---

## Development Workflow

1. Start backend first (port 5000)
2. Start frontend second (port 5173)
3. Make changes - both have hot reload
4. Backend: auto-reload with nodemon
5. Frontend: instant HMR with Vite

---

## Stop Servers

**Backend/Frontend:**
- Press `Ctrl + C` in terminal
- Type `Y` if prompted

---

## Next Steps

✅ Both servers running locally
→ Access app at http://localhost:5173
→ Make code changes (auto-reload enabled)
→ Test features and booking flow
→ Ready for development!
