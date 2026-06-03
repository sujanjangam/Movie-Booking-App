import Tenant from "../models/Tenant.js";
import User from "../models/User.js";

export const createTenant = async (req, res) => {
  try {
    const { name, domain } = req.body;
    if (!name || !domain) {
      return res.status(400).json({ message: "Name and domain are required" });
    }

    const tenant = await Tenant.create({
      name,
      domain,
      createdBy: req.user._id,
    });

    res.json(tenant);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Domain already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};

export const getTenants = async (req, res) => {
  try {
    const tenants = await Tenant.find();
    res.json(tenants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTenantAdmin = async (req, res) => {
  try {
    const { name, email, password, tenantId } = req.body;
    if (!name || !email || !password || !tenantId) {
      return res.status(400).json({ message: "All fields required" });
    }
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({
      name, email, password,
      role: "TENANT_ADMIN",
      tenantId,
    });
    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, tenantId: user.tenantId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
