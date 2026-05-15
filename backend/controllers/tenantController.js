import Tenant from "../models/Tenant.js";

export const createTenant = async (req, res) => {
  const { name, domain } = req.body;

  const tenant = await Tenant.create({
    name,
    domain,
    createdBy: req.user._id,
  });

  res.json(tenant);
};

export const getTenants = async (req, res) => {
  const tenants = await Tenant.find();
  res.json(tenants);
};
