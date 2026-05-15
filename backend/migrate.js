import mongoose from "mongoose";
import dotenv from "dotenv";
import Tenant from "./models/Tenant.js";
import Movie from "./models/Movie.js";
import Theatre from "./models/Theatre.js";
import Show from "./models/Show.js";
import User from "./models/User.js";

dotenv.config();

const migrateToMultiTenant = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Step 1: Create default tenant
    let defaultTenant = await Tenant.findOne({ domain: "default" });
    
    if (!defaultTenant) {
      defaultTenant = await Tenant.create({
        name: "Default Tenant",
        domain: "default",
        isActive: true,
      });
      console.log("✅ Default tenant created:", defaultTenant._id);
    } else {
      console.log("✅ Default tenant already exists:", defaultTenant._id);
    }

    // Step 2: Update existing movies
    const moviesUpdated = await Movie.updateMany(
      { tenantId: { $exists: false } },
      { $set: { tenantId: defaultTenant._id } }
    );
    console.log(`✅ Updated ${moviesUpdated.modifiedCount} movies`);

    // Step 3: Update existing theatres
    const theatresUpdated = await Theatre.updateMany(
      { tenantId: { $exists: false } },
      { $set: { tenantId: defaultTenant._id } }
    );
    console.log(`✅ Updated ${theatresUpdated.modifiedCount} theatres`);

    // Step 4: Update existing shows
    const showsUpdated = await Show.updateMany(
      { tenantId: { $exists: false } },
      { $set: { tenantId: defaultTenant._id } }
    );
    console.log(`✅ Updated ${showsUpdated.modifiedCount} shows`);

    // Step 5: Update existing users
    const usersUpdated = await User.updateMany(
      { tenantId: { $exists: false } },
      { $set: { tenantId: defaultTenant._id } }
    );
    console.log(`✅ Updated ${usersUpdated.modifiedCount} users`);

    // Step 6: Set default role for users without role
    const usersRoleUpdated = await User.updateMany(
      { role: { $exists: false } },
      { $set: { role: "USER" } }
    );
    console.log(`✅ Set default role for ${usersRoleUpdated.modifiedCount} users`);

    console.log("\n🎉 Migration completed successfully!");
    console.log("\n📝 Next steps:");
    console.log("1. Create a SUPER_ADMIN user manually");
    console.log("2. Use SUPER_ADMIN to create new tenants");
    console.log("3. Create TENANT_ADMIN users for each tenant");

    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
};

migrateToMultiTenant();
