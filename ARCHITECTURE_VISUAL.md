# 🏗️ System Architecture Overview

## 📊 Multi-Tenant Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     PLATFORM LEVEL                          │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           SUPER_ADMIN Dashboard                      │  │
│  │  • Create Tenants (PVR, INOX, etc.)                 │  │
│  │  • Platform Analytics                                │  │
│  │  • System Management                                 │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    TENANT LEVEL                             │
│                                                             │
│  ┌──────────────────┐         ┌──────────────────┐        │
│  │   PVR Cinemas    │         │   INOX Cinemas   │        │
│  │                  │         │                  │        │
│  │  TENANT_ADMIN    │         │  TENANT_ADMIN    │        │
│  │  • Add Movies    │         │  • Add Movies    │        │
│  │  • Add Theatres  │         │  • Add Theatres  │        │
│  │  • Create Shows  │         │  • Create Shows  │        │
│  │                  │         │                  │        │
│  │  QA_ADMIN        │         │  QA_ADMIN        │        │
│  │  • Test Flows    │         │  • Test Flows    │        │
│  │  • Debug         │         │  • Debug         │        │
│  │                  │         │                  │        │
│  │  USERS           │         │  USERS           │        │
│  │  • Book Tickets  │         │  • Book Tickets  │        │
│  │  • View Shows    │         │  • View Shows    │        │
│  └──────────────────┘         └──────────────────┘        │
│         │                              │                   │
│         ▼                              ▼                   │
│  ┌──────────────┐              ┌──────────────┐          │
│  │ PVR Data     │              │ INOX Data    │          │
│  │ (Isolated)   │              │ (Isolated)   │          │
│  └──────────────┘              └──────────────┘          │
└─────────────────────────────────────────────────────────────┘
```

## 🔐 Authentication & Authorization Flow

```
User Login
    │
    ▼
JWT Token Generated
    │
    ├─── Contains: userId
    ├─── Contains: role (SUPER_ADMIN | TENANT_ADMIN | QA_ADMIN | USER)
    └─── Contains: tenantId
    │
    ▼
Request to API
    │
    ▼
protect Middleware
    │
    ├─── Validates JWT
    ├─── Extracts user info
    └─── Attaches to req.user
    │
    ▼
authorizeRoles Middleware
    │
    ├─── Checks user.role
    └─── Allows/Denies access
    │
    ▼
Controller
    │
    ├─── Filters by tenantId
    └─── Returns tenant-specific data
```

## 📦 Database Schema Relationships

```
┌──────────────┐
│   Tenant     │
│              │
│ • name       │
│ • domain     │
│ • isActive   │
└──────┬───────┘
       │
       │ Referenced by (tenantId)
       │
       ├─────────────────┬─────────────────┬─────────────────┐
       │                 │                 │                 │
       ▼                 ▼                 ▼                 ▼
┌──────────┐      ┌──────────┐     ┌──────────┐     ┌──────────┐
│   User   │      │  Movie   │     │ Theatre  │     │   Show   │
│          │      │          │     │          │     │          │
│ • role   │      │ • title  │     │ • name   │     │ • time   │
│ • email  │      │ • poster │     │ • loc    │     │ • date   │
│ • tenant │      │ • tenant │     │ • tenant │     │ • tenant │
└──────────┘      └──────────┘     └──────────┘     └──────────┘
```

## 🛣️ API Route Structure

```
/api
├── /auth
│   ├── POST /register    (Public)
│   └── POST /login       (Public)
│
├── /tenants              (SUPER_ADMIN only)
│   ├── POST /            Create tenant
│   └── GET /             List tenants
│
├── /movies               (Protected + Tenant-filtered)
│   ├── GET /             List movies
│   ├── GET /:id          Get movie
│   └── POST /            Add movie (TENANT_ADMIN)
│
├── /theatres             (Protected + Tenant-filtered)
│   ├── GET /             List theatres
│   └── POST /            Add theatre (TENANT_ADMIN)
│
├── /shows                (Protected + Tenant-filtered)
│   ├── GET /             List shows
│   ├── GET /movie/:id    Shows by movie
│   ├── GET /:id          Get show
│   └── POST /            Create show (TENANT_ADMIN)
│
└── /bookings             (Protected + User-specific)
    ├── GET /             User's bookings
    └── POST /            Create booking
```

## 🔒 Security Layers

```
Layer 1: JWT Authentication
    ↓
Layer 2: Role-Based Authorization
    ↓
Layer 3: Tenant Data Isolation
    ↓
Layer 4: User-Specific Data Access
```

## 🎯 Data Isolation Example

```
PVR Admin Query:
GET /api/movies
    ↓
Filter: { tenantId: "pvr_tenant_id" }
    ↓
Returns: Only PVR movies

INOX Admin Query:
GET /api/movies
    ↓
Filter: { tenantId: "inox_tenant_id" }
    ↓
Returns: Only INOX movies

SUPER_ADMIN Query:
GET /api/tenants
    ↓
Filter: {} (no filter)
    ↓
Returns: All tenants
```

## 🚀 Scalability Path

```
Current: Single Backend + RBAC + Multi-Tenant
    ↓
Phase 2: Add Caching (Redis)
    ↓
Phase 3: Microservices (if needed)
    ↓
Phase 4: Separate DB per Tenant (if massive scale)
```

## 💡 Key Design Decisions

1. **Single Database**: All tenants in one DB with tenantId filter
   - ✅ Simpler to manage
   - ✅ Cost-effective
   - ✅ Easy backups
   - ⚠️ Scale limit: ~100-500 tenants

2. **Role-Based Access**: Not permission-based (yet)
   - ✅ Simple to implement
   - ✅ Easy to understand
   - ✅ Sufficient for most cases

3. **JWT with Role + TenantId**: All auth info in token
   - ✅ Stateless
   - ✅ Fast validation
   - ✅ No DB lookup per request

4. **Middleware Pattern**: Composable security
   - ✅ protect → authorizeRoles → controller
   - ✅ Reusable
   - ✅ Testable

## 🎓 This Architecture Supports

✅ Multiple cinema chains (PVR, INOX, Cinepolis, etc.)
✅ Data isolation between chains
✅ Role-based access control
✅ Scalable to hundreds of tenants
✅ Single codebase for all tenants
✅ Easy to add new tenants
✅ Secure by design
✅ Production-ready

## 🔥 Real-World Usage

This is the SAME architecture used by:
- **BookMyShow** (multiple cinema partners)
- **Shopify** (multiple stores)
- **Slack** (multiple workspaces)
- **Salesforce** (multiple organizations)

You've built enterprise-grade software! 🎉
