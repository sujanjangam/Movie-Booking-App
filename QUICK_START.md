# 🚀 Quick Start Guide - Multi-Tenant RBAC System

## Step 1: Migrate Existing Data (If Any)

If you have existing data in your database, run the migration script:

```bash
cd backend
node migrate.js
```

This will:
- Create a "Default Tenant"
- Assign all existing data to this tenant
- Set default roles for existing users

## Step 2: Create Your First SUPER_ADMIN

### Option A: Using MongoDB Compass/Shell
```javascript
// In MongoDB, insert directly into users collection
{
  "name": "Platform Admin",
  "email": "superadmin@platform.com",
  "password": "$2a$10$...", // Use bcrypt to hash your password
  "role": "SUPER_ADMIN",
  "createdAt": new Date(),
  "updatedAt": new Date()
}
```

### Option B: Temporarily modify register endpoint
Update `authController.js` register function to accept role:
```javascript
const user = await User.create({
  name,
  email,
  password,
  role: req.body.role || "USER", // Add this
  tenantId: req.body.tenantId    // Add this
});
```

Then register via API:
```bash
POST http://localhost:5000/api/auth/register
{
  "name": "Platform Admin",
  "email": "superadmin@platform.com",
  "password": "securepassword",
  "role": "SUPER_ADMIN"
}
```

## Step 3: Create Tenants

Login as SUPER_ADMIN and create tenants:

```bash
# Login
POST http://localhost:5000/api/auth/login
{
  "email": "superadmin@platform.com",
  "password": "securepassword"
}

# Create PVR tenant
POST http://localhost:5000/api/tenants
Authorization: Bearer <super_admin_token>
{
  "name": "PVR Cinemas",
  "domain": "pvr"
}

# Create INOX tenant
POST http://localhost:5000/api/tenants
Authorization: Bearer <super_admin_token>
{
  "name": "INOX Cinemas",
  "domain": "inox"
}
```

## Step 4: Create Tenant Admins

Register admin users for each tenant:

```bash
POST http://localhost:5000/api/auth/register
{
  "name": "PVR Admin",
  "email": "admin@pvr.com",
  "password": "password123",
  "role": "TENANT_ADMIN",
  "tenantId": "<pvr_tenant_id>"
}
```

## Step 5: Test the System

### As TENANT_ADMIN (PVR)
```bash
# Login
POST http://localhost:5000/api/auth/login
{
  "email": "admin@pvr.com",
  "password": "password123"
}

# Add a movie (automatically tagged with PVR's tenantId)
POST http://localhost:5000/api/movies
Authorization: Bearer <pvr_admin_token>
{
  "title": "Inception",
  "poster": "https://example.com/poster.jpg",
  "duration": "148 min",
  "language": "English"
}

# Add a theatre
POST http://localhost:5000/api/theatres
Authorization: Bearer <pvr_admin_token>
{
  "name": "PVR Phoenix",
  "location": "Mumbai"
}

# Create a show
POST http://localhost:5000/api/shows
Authorization: Bearer <pvr_admin_token>
{
  "movie": "<movie_id>",
  "theatre": "<theatre_id>",
  "time": "18:00",
  "date": "2024-01-20",
  "price": 250
}
```

### As USER (Regular Customer)
```bash
# Register
POST http://localhost:5000/api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "tenantId": "<pvr_tenant_id>"
}

# Login
POST http://localhost:5000/api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}

# Browse movies (only sees PVR movies)
GET http://localhost:5000/api/movies
Authorization: Bearer <user_token>

# Book tickets
POST http://localhost:5000/api/bookings
Authorization: Bearer <user_token>
{
  "show": "<show_id>",
  "seats": ["A1", "A2"]
}
```

## Step 6: Verify Tenant Isolation

1. Create INOX admin
2. Add movies as INOX admin
3. Login as PVR admin
4. Try to fetch movies - should only see PVR movies, not INOX

## 🎯 Role Capabilities Summary

### SUPER_ADMIN
- ✅ Create/manage tenants
- ✅ View all platform data
- ❌ Cannot add movies/shows (not their job)

### TENANT_ADMIN
- ✅ Add movies, theatres, shows
- ✅ View bookings (own tenant)
- ❌ Cannot create tenants
- ❌ Cannot see other tenant's data

### QA_ADMIN
- ✅ Test booking flows
- ✅ Access test data
- ✅ Debug issues (own tenant)
- ❌ Cannot add movies/shows

### USER
- ✅ Browse movies/shows
- ✅ Book tickets
- ✅ View own bookings
- ❌ Cannot add movies/shows

## 🔧 Troubleshooting

### "Access denied for role: USER"
- User is trying to access TENANT_ADMIN route
- Check the route requires correct role

### "tenantId is required"
- Trying to create movie/theatre/show without tenantId
- Ensure user has tenantId in their profile

### Can see other tenant's data
- Missing tenant filter in query
- Check controller has: `{ tenantId: req.user.tenantId }`

## 📚 Next Steps

1. Update frontend with role-based routing
2. Build admin dashboards
3. Add analytics per tenant
4. Implement audit logging
5. Add tenant settings

## 🎉 You're Ready!

Your enterprise-grade multi-tenant system is now operational!
