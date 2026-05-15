# API Routes - Role-Based Access Control

## 🔐 Authentication Routes
```
POST   /api/auth/register    → Public (creates USER by default)
POST   /api/auth/login       → Public
```

## 🏢 Tenant Management (SUPER_ADMIN Only)
```
POST   /api/tenants          → Create tenant
GET    /api/tenants          → List all tenants
```

## 🎬 Movie Management
```
GET    /api/movies           → All authenticated users (tenant-filtered)
GET    /api/movies/:id       → All authenticated users (tenant-filtered)
POST   /api/movies           → TENANT_ADMIN only
```

## 🏛️ Theatre Management
```
GET    /api/theatres         → All authenticated users (tenant-filtered)
POST   /api/theatres         → TENANT_ADMIN only
```

## 🎭 Show Management
```
GET    /api/shows            → All authenticated users (tenant-filtered)
GET    /api/shows/movie/:id  → All authenticated users (tenant-filtered)
GET    /api/shows/:id        → All authenticated users (tenant-filtered)
POST   /api/shows            → TENANT_ADMIN only
```

## 🎫 Booking Management
```
GET    /api/bookings         → All authenticated users (own bookings)
POST   /api/bookings         → All authenticated users
```

## 🎯 Quick Role Reference

### SUPER_ADMIN
- Create/manage tenants
- View all platform data
- System administration

### TENANT_ADMIN
- Add movies, theatres, shows
- Manage bookings (own tenant)
- View analytics (own tenant)

### QA_ADMIN
- Test booking flows
- Validate data
- Debug issues (own tenant)

### USER
- Browse movies/shows
- Book tickets
- View own bookings

## 🔒 Security Pattern

Every protected route follows this pattern:
```javascript
router.method("/path", protect, authorizeRoles("ROLE1", "ROLE2"), controller);
```

- `protect`: Validates JWT token
- `authorizeRoles`: Checks user role
- All data automatically filtered by `tenantId`
