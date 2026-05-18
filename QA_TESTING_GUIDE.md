# 🧪 QA Testing Guide

## 📋 Test Credentials

### 🔴 SUPER_ADMIN (Platform Owner)
```
Email: superadmin@test.com
Password: super123
```
**Access:**
- Create and manage tenants (cinema chains)
- View all platform data
- Full system access

---

### 🟠 TENANT_ADMIN (Cinema Manager)
```
Email: admin@test.com
Password: admin123
```
**Access:**
- Add/edit movies
- Create/manage theatres and screens
- Create shows and manage schedules
- View analytics for their tenant
- Cannot access other tenants' data

---

### 🟡 QA_ADMIN (Quality Assurance Tester)
```
Email: qa@test.com
Password: qa123
```
**Access:**
- Full testing access
- Same permissions as TENANT_ADMIN
- Used for QA and validation

---

### 🟢 USER (Regular Customer)
```
Email: user@test.com
Password: user123
```
**Access:**
- Browse movies
- Select seats and book tickets
- View booking history
- Cannot access admin features

---

## 🎯 Test Scenarios

### 1️⃣ Super Admin Tests
**Login as:** `superadmin@test.com`

✅ **Test Cases:**
- [ ] Create new tenant (e.g., "PVR Cinemas")
- [ ] View all tenants list
- [ ] Verify tenant isolation
- [ ] Access analytics across all tenants

**API Endpoints:**
```bash
POST /api/tenants
GET  /api/tenants
```

---

### 2️⃣ Tenant Admin Tests
**Login as:** `admin@test.com`

✅ **Test Cases:**
- [ ] Add new movie
- [ ] Create theatre with multiple screens
- [ ] Create show with seat layout
- [ ] View tenant-specific analytics
- [ ] Verify cannot see other tenants' data

**API Endpoints:**
```bash
POST /api/movies
POST /api/theatres
POST /api/shows
GET  /api/analytics
```

---

### 3️⃣ QA Admin Tests
**Login as:** `qa@test.com`

✅ **Test Cases:**
- [ ] Test all TENANT_ADMIN features
- [ ] Validate seat locking mechanism
- [ ] Test booking flow end-to-end
- [ ] Verify data validation
- [ ] Test error handling

---

### 4️⃣ User Tests
**Login as:** `user@test.com`

✅ **Test Cases:**
- [ ] Browse available movies
- [ ] Select show and seats
- [ ] Lock seats (5-minute timer)
- [ ] Complete booking
- [ ] View booking history
- [ ] Verify cannot access admin routes

**API Endpoints:**
```bash
GET  /api/movies
GET  /api/shows/:id/seats
POST /api/shows/lock
POST /api/shows/book
GET  /api/bookings/user
```

---

## 🔒 Security Tests

### Test Tenant Isolation
1. Login as `admin@test.com` (Tenant A)
2. Create a movie
3. Logout and login as different tenant admin
4. Verify you CANNOT see Tenant A's movie

### Test Role-Based Access
1. Login as `user@test.com`
2. Try to access `/api/movies` (POST) - Should FAIL
3. Try to access `/api/tenants` - Should FAIL
4. Try to book tickets - Should SUCCEED

### Test Seat Locking
1. Login as `user@test.com`
2. Lock seats A1, A2
3. Open incognito window
4. Login as different user
5. Try to lock same seats - Should FAIL
6. Wait 5 minutes
7. Try again - Should SUCCEED (lock expired)

---

## 🚀 Quick Setup

### 1. Create QA Accounts
```bash
cd backend
node createQAAccounts.js
```

### 2. Start Backend
```bash
npm start
```

### 3. Start Frontend
```bash
cd ../frontend
npm run dev
```

### 4. Login and Test
- Go to `http://localhost:5173/login`
- Use any test credential above
- Start testing!

---

## 📊 Expected Behavior

### ✅ SUPER_ADMIN Can:
- Create tenants
- View all data
- Access all routes

### ✅ TENANT_ADMIN Can:
- Manage movies (their tenant only)
- Manage theatres (their tenant only)
- Create shows (their tenant only)
- View analytics (their tenant only)

### ✅ QA_ADMIN Can:
- Same as TENANT_ADMIN
- Used for testing purposes

### ✅ USER Can:
- Browse movies
- Book tickets
- View their bookings

### ❌ USER Cannot:
- Create movies
- Create shows
- Access admin dashboard
- View analytics

---

## 🐛 Common Issues

### Issue: "Unauthorized" error
**Solution:** Check if JWT token is valid and role matches route requirements

### Issue: Cannot see movies
**Solution:** Verify tenantId matches between user and movies

### Issue: Seat already locked
**Solution:** Wait 5 minutes for lock to expire or use different seats

### Issue: Booking failed - NaN error
**Solution:** Run `node fixSeatPrices.js` to fix seat prices

---

## 📝 Test Checklist

### Authentication
- [ ] Register new user
- [ ] Login with valid credentials
- [ ] Login with invalid credentials (should fail)
- [ ] JWT token persists after refresh
- [ ] Logout clears token

### Movies
- [ ] Create movie (TENANT_ADMIN)
- [ ] List movies (filtered by tenant)
- [ ] Update movie
- [ ] Delete movie

### Theatres
- [ ] Create theatre with screens
- [ ] List theatres (filtered by tenant)
- [ ] Update theatre
- [ ] Add/remove screens

### Shows
- [ ] Create show with auto-generated seats
- [ ] View show details
- [ ] Check seat availability
- [ ] Verify seat types (VIP, GOLD, REGULAR)

### Booking Flow
- [ ] Select seats
- [ ] Lock seats (5-minute timer)
- [ ] Confirm booking
- [ ] View booking in history
- [ ] Verify seat status changes (available → locked → booked)

### Analytics
- [ ] View revenue stats
- [ ] View booking trends
- [ ] Verify tenant-specific data

---

## 🎬 Production Deployment

Before deploying to production:

1. ✅ Change all test passwords
2. ✅ Remove or disable QA accounts
3. ✅ Enable rate limiting
4. ✅ Add input validation
5. ✅ Setup monitoring
6. ✅ Configure CORS properly
7. ✅ Use environment variables
8. ✅ Enable HTTPS

---

## 📞 Support

For issues or questions:
- Check backend logs: `console.log` in controllers
- Check frontend console: Browser DevTools
- Verify MongoDB data: MongoDB Atlas/Compass
- Test API directly: Postman/Thunder Client

---

**Happy Testing! 🚀**
