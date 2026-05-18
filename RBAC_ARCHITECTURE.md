# 🔐 Role-Based Access Control (RBAC) Guide

## 📊 Role Access Matrix

| Feature | SUPER_ADMIN | TENANT_ADMIN | QA_ADMIN | USER |
|---------|-------------|--------------|----------|------|
| **Tenant Management** |
| Create Tenants | ✅ | ❌ | ❌ | ❌ |
| View All Tenants | ✅ | ❌ | ❌ | ❌ |
| **Movie Management** |
| Add Movies | ✅ | ✅ | ❌ | ❌ |
| View Movies | ✅ | ✅ | ✅ | ✅ |
| Edit Movies | ✅ | ✅ | ❌ | ❌ |
| **Theatre Management** |
| Add Theatres | ✅ | ✅ | ❌ | ❌ |
| Add Screens | ✅ | ✅ | ❌ | ❌ |
| View Theatres | ✅ | ✅ | ✅ | ✅ |
| **Show Management** |
| Create Shows | ✅ | ✅ | ❌ | ❌ |
| View Shows | ✅ | ✅ | ✅ | ✅ |
| Manage Seats | ✅ | ✅ | ❌ | ❌ |
| **Booking** |
| Lock Seats | ✅ | ✅ | ✅ | ✅ |
| Book Tickets | ✅ | ✅ | ✅ | ✅ |
| View Own Bookings | ✅ | ✅ | ✅ | ✅ |
| **Analytics** |
| View Analytics | ✅ | ✅ | 👀 Read-only | ❌ |
| **Admin Dashboard** |
| Access Dashboard | ✅ | ✅ | ❌ | ❌ |

---

## 👥 Role Descriptions

### 🔴 SUPER_ADMIN (Platform Owner)
**Email:** `superadmin@test.com` | **Password:** `super123`

**Purpose:** Platform-level management

**Responsibilities:**
- Create and manage cinema chains (tenants)
- Monitor platform-wide metrics
- Access all tenant data
- Platform configuration

**Use Case:**
> You are the owner of the booking platform. Multiple cinema chains (PVR, INOX, Cinepolis) use your platform. You create tenant accounts for each chain.

**Should NOT:**
- Manage day-to-day theatre operations
- Create movies/shows for specific tenants

---

### 🟠 TENANT_ADMIN (Cinema Manager) ⭐ **MAIN ADMIN**
**Email:** `admin@test.com` | **Password:** `admin123`

**Purpose:** Cinema chain operations management

**Responsibilities:**
- Add and manage movies
- Create and manage theatres
- Add screens to theatres
- Create shows with pricing
- Manage seat layouts
- View analytics for their cinema chain
- Monitor bookings

**Use Case:**
> You are the manager of PVR Cinemas. You add new movies, create shows, manage theatres, and monitor revenue.

**Data Isolation:**
- Can ONLY see data for their tenant
- Cannot access other cinema chains' data

**This is the PRIMARY operational role for cinema management.**

---

### 🟡 QA_ADMIN (Quality Assurance Tester)
**Email:** `qa@test.com` | **Password:** `qa123`

**Purpose:** Testing and validation

**Responsibilities:**
- Test booking workflows
- Validate seat locking
- Test user journeys
- Report bugs
- View analytics (read-only)

**Restrictions:**
- ❌ Cannot create movies
- ❌ Cannot create theatres
- ❌ Cannot create shows
- ❌ Cannot access admin dashboard
- ✅ Can book tickets (for testing)
- ✅ Can view data (read-only)

**Use Case:**
> You are testing the platform before release. You can browse movies, book tickets, and validate the booking flow, but you cannot create production data.

---

### 🟢 USER (Customer)
**Email:** `user@test.com` | **Password:** `user123`

**Purpose:** End customer

**Responsibilities:**
- Browse movies
- Select shows
- Lock and book seats
- View booking history

**Restrictions:**
- ❌ Cannot access admin features
- ❌ Cannot create movies/shows
- ❌ Cannot view analytics

**Use Case:**
> You are a regular customer who wants to book movie tickets.

---

## 🛡️ Backend Route Protection

### Movies
```javascript
// Anyone can view
GET /api/movies - protect

// Only TENANT_ADMIN and SUPER_ADMIN can create
POST /api/movies - protect, authorizeRoles("TENANT_ADMIN", "SUPER_ADMIN")
```

### Theatres
```javascript
// Anyone can view
GET /api/theatres - protect

// Only TENANT_ADMIN and SUPER_ADMIN can create
POST /api/theatres - protect, authorizeRoles("TENANT_ADMIN", "SUPER_ADMIN")
POST /api/theatres/:id/screens - protect, authorizeRoles("TENANT_ADMIN", "SUPER_ADMIN")
```

### Shows
```javascript
// Anyone can view
GET /api/shows - protect
GET /api/shows/:id/seats - protect

// Only TENANT_ADMIN and SUPER_ADMIN can create
POST /api/shows - protect, authorizeRoles("TENANT_ADMIN", "SUPER_ADMIN")

// All authenticated users can book
POST /api/shows/lock - protect
POST /api/shows/book - protect
```

### Tenants
```javascript
// Only SUPER_ADMIN can manage tenants
POST /api/tenants - protect, authorizeRoles("SUPER_ADMIN")
GET /api/tenants - protect, authorizeRoles("SUPER_ADMIN")
```

### Analytics
```javascript
// TENANT_ADMIN and SUPER_ADMIN can view
GET /api/analytics - protect, authorizeRoles("TENANT_ADMIN", "SUPER_ADMIN")
```

---

## 🎯 Frontend Access Control

### Navbar
```javascript
// Show Dashboard link only for admins
{(user.role === 'TENANT_ADMIN' || user.role === 'SUPER_ADMIN') && (
  <Link to="/admin">Dashboard</Link>
)}

// Everyone can see bookings
<Link to="/booking">My Bookings</Link>
```

### Login Redirect
```javascript
// Admins go to dashboard
if (user.role === 'TENANT_ADMIN' || user.role === 'SUPER_ADMIN') {
  navigate('/admin');
}

// Others go to home
else {
  navigate('/');
}
```

---

## 🧪 Testing Scenarios

### Test as SUPER_ADMIN
1. Login as `superadmin@test.com`
2. Create a new tenant (e.g., "INOX Cinemas")
3. View all tenants
4. Verify you can see all platform data

### Test as TENANT_ADMIN ⭐
1. Login as `admin@test.com`
2. Go to Dashboard
3. Add a movie
4. Create a theatre with screens
5. Create a show
6. View analytics
7. Verify you CANNOT see other tenants' data

### Test as QA_ADMIN
1. Login as `qa@test.com`
2. Browse movies (should work)
3. Try to access `/admin` (should fail)
4. Book tickets (should work)
5. View bookings (should work)

### Test as USER
1. Login as `user@test.com`
2. Browse movies
3. Book tickets
4. View bookings
5. Try to access `/admin` (should fail)

---

## 🔒 Security Best Practices

### Backend Validation
✅ Always validate role on backend
✅ Never trust frontend role checks
✅ Use middleware for route protection
✅ Implement tenant isolation

### Frontend UX
✅ Hide admin features from non-admins
✅ Show appropriate error messages
✅ Redirect unauthorized users
✅ Display user role in navbar

### Data Isolation
✅ Filter queries by tenantId
✅ Verify user belongs to tenant
✅ Prevent cross-tenant data access
✅ Validate ownership before updates

---

## 📋 Quick Reference

### Who Can Do What?

**Create Movies/Theatres/Shows:**
- ✅ SUPER_ADMIN
- ✅ TENANT_ADMIN
- ❌ QA_ADMIN
- ❌ USER

**Book Tickets:**
- ✅ SUPER_ADMIN
- ✅ TENANT_ADMIN
- ✅ QA_ADMIN
- ✅ USER

**Access Dashboard:**
- ✅ SUPER_ADMIN
- ✅ TENANT_ADMIN
- ❌ QA_ADMIN
- ❌ USER

**View Analytics:**
- ✅ SUPER_ADMIN
- ✅ TENANT_ADMIN
- 👀 QA_ADMIN (read-only)
- ❌ USER

---

## 🚀 Production Recommendations

Before going to production:

1. ✅ Change all test passwords
2. ✅ Remove or disable QA accounts
3. ✅ Implement rate limiting
4. ✅ Add audit logging
5. ✅ Enable 2FA for admins
6. ✅ Regular security audits
7. ✅ Monitor unauthorized access attempts

---

## 🎬 Real-World Example

**Scenario:** You run a movie booking platform

**Setup:**
1. You (SUPER_ADMIN) create tenant: "PVR Cinemas"
2. You create TENANT_ADMIN account for PVR manager
3. PVR manager logs in and:
   - Adds movies
   - Creates theatres
   - Schedules shows
   - Monitors bookings
4. Customers (USER) book tickets
5. QA team tests the platform

**Result:** Clean separation of concerns, secure multi-tenant platform

---

**Built with enterprise-grade security and scalability in mind! 🔐**
