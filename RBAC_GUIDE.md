# RBAC + Multi-Tenant Architecture

## Roles
- **SUPER_ADMIN**: Platform owner (manages tenants)
- **TENANT_ADMIN**: Company admin (manages movies, theatres, shows)
- **QA_ADMIN**: Testing/validation
- **USER**: End customers (book tickets)

## Usage Examples

### Protect Routes with Roles
```javascript
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

// Only TENANT_ADMIN can add movies
router.post("/add-movie", protect, authorizeRoles("TENANT_ADMIN"), addMovie);

// Multiple roles allowed
router.get("/analytics", protect, authorizeRoles("SUPER_ADMIN", "TENANT_ADMIN"), getAnalytics);
```

### Tenant Data Isolation
```javascript
// In controllers - filter by tenantId
const movies = await Movie.find({ tenantId: req.user.tenantId });

// When creating - attach tenantId
const movie = await Movie.create({ ...req.body, tenantId: req.user.tenantId });

// SUPER_ADMIN sees all data
const filter = req.user.role === "SUPER_ADMIN" ? {} : { tenantId: req.user.tenantId };
```

## Database Changes
✅ User model: Added `role` and `tenantId`
✅ Tenant model: Created
✅ Movie, Theatre, Show: Added `tenantId`

## Next Steps
1. Update authController to handle role assignment during registration
2. Apply same pattern to theatre/show controllers
3. Update frontend with role-based routing
4. Add tenant selection for SUPER_ADMIN

## Migration Note
Existing data needs tenantId. Create a default tenant first:
```javascript
const defaultTenant = await Tenant.create({ name: "Default", domain: "default" });
await Movie.updateMany({}, { tenantId: defaultTenant._id });
```
