# Enterprise Multi-Tenant RBAC Architecture - Implementation Guide

## ✅ What's Been Implemented

### 1. Core Models
- **Tenant Model**: Multi-tenant support (PVR, INOX, etc.)
- **User Model**: Role-based with `SUPER_ADMIN`, `TENANT_ADMIN`, `QA_ADMIN`, `USER`
- **Movie/Theatre/Show Models**: All include `tenantId` for data isolation

### 2. Security & Access Control
- **protect**: JWT authentication middleware
- **authorizeRoles**: Role-based authorization
- **Tenant Isolation**: All queries filtered by `tenantId`

### 3. API Routes
```
POST   /api/tenants          → Create tenant (SUPER_ADMIN only)
GET    /api/tenants          → List tenants (SUPER_ADMIN only)

POST   /api/movies           → Add movie (TENANT_ADMIN only)
GET    /api/movies           → Get movies (tenant-filtered)

POST   /api/theatres         → Add theatre (TENANT_ADMIN only)
GET    /api/theatres         → Get theatres (tenant-filtered)

POST   /api/shows            → Create show (TENANT_ADMIN only)
GET    /api/shows            → Get shows (tenant-filtered)
```

## 🔐 Enterprise Security Rules

### Always Filter by Tenant
```javascript
// ✅ Correct
const movies = await Movie.find({ tenantId: req.user.tenantId });

// ❌ Wrong - exposes all tenant data
const movies = await Movie.find();
```

### Always Attach tenantId on Create
```javascript
// ✅ Correct
await Movie.create({ ...req.body, tenantId: req.user.tenantId });

// ❌ Wrong - no tenant isolation
await Movie.create(req.body);
```

### Never Trust Frontend Role
```javascript
// ✅ Correct - validate in backend
router.post("/", protect, authorizeRoles("TENANT_ADMIN"), addMovie);

// ❌ Wrong - trusting client
if (req.body.role === "TENANT_ADMIN") { ... }
```

## 🎯 Role Permissions

| Role | Permissions |
|------|-------------|
| **SUPER_ADMIN** | Create tenants, view all data, platform management |
| **TENANT_ADMIN** | Add movies/theatres/shows, manage bookings (own tenant) |
| **QA_ADMIN** | Test flows, validate data, debug (own tenant) |
| **USER** | Book tickets, view bookings (own tenant) |

## 🚀 Next Steps

### 1. Update Auth Controller
Add role assignment during registration:
```javascript
// In authController.js register function
const user = await User.create({
  name,
  email,
  password,
  role: req.body.role || "USER",
  tenantId: req.body.tenantId
});
```

### 2. Frontend Role-Based Routing
```javascript
// In React Router
if (user.role === "SUPER_ADMIN") navigate("/super-admin");
if (user.role === "TENANT_ADMIN") navigate("/admin");
if (user.role === "QA_ADMIN") navigate("/qa");
if (user.role === "USER") navigate("/home");
```

### 3. Database Migration (For Existing Data)
```javascript
// Create default tenant
const defaultTenant = await Tenant.create({
  name: "Default Tenant",
  domain: "default"
});

// Update existing records
await Movie.updateMany({}, { tenantId: defaultTenant._id });
await Theatre.updateMany({}, { tenantId: defaultTenant._id });
await Show.updateMany({}, { tenantId: defaultTenant._id });
```

## 🏢 Admin Dashboard Flow

### SUPER_ADMIN Dashboard
- Create new tenants (PVR, INOX, etc.)
- View all tenants
- Platform analytics
- System management

### TENANT_ADMIN Dashboard
- Add movies to their cinema chain
- Add theatres/locations
- Create shows
- Manage bookings
- View analytics (own tenant only)

### QA_ADMIN Dashboard
- Test booking flows
- Validate seat availability
- Debug issues
- Access test data

### USER Interface
- Browse movies
- Book tickets
- View bookings
- Cancel bookings

## 📝 API Usage Examples

### Create Tenant (SUPER_ADMIN)
```bash
POST /api/tenants
Authorization: Bearer <super_admin_token>
{
  "name": "PVR Cinemas",
  "domain": "pvr"
}
```

### Add Movie (TENANT_ADMIN)
```bash
POST /api/movies
Authorization: Bearer <tenant_admin_token>
{
  "title": "Inception",
  "poster": "url",
  "duration": "148 min",
  "language": "English"
}
# tenantId automatically attached from token
```

### Get Movies (Any Authenticated User)
```bash
GET /api/movies
Authorization: Bearer <token>
# Returns only movies for user's tenant
```

## ⚠️ Important Notes

1. **Tenant Isolation is Critical**: Every query MUST filter by tenantId
2. **Role Validation in Backend**: Never trust frontend role checks
3. **JWT Contains Role + TenantId**: Used for authorization
4. **SUPER_ADMIN Special Case**: Can see all data (implement carefully)
5. **Keep Roles Simple**: Don't add permission matrix yet

## 🔥 Production Checklist

- [ ] Update authController with role assignment
- [ ] Add tenant selection for SUPER_ADMIN
- [ ] Implement frontend role-based routing
- [ ] Migrate existing data to default tenant
- [ ] Add audit logging for admin actions
- [ ] Test tenant isolation thoroughly
- [ ] Add rate limiting per tenant
- [ ] Implement tenant-specific analytics

## 🎓 Architecture Benefits

✅ **Scalable**: Easy to add new tenants
✅ **Secure**: Data isolation by design
✅ **Flexible**: Role-based access control
✅ **Maintainable**: Single codebase for all tenants
✅ **Enterprise-Ready**: Follows industry best practices
