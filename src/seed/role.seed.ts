import mongoose from "mongoose";
import { RoleModel } from "@role/entities/role.entity";
import { ENV } from "@/config";

async function seedSystemRoles() {
  try {
    await mongoose.connect(ENV.MONGODB_URI, {
      dbName: ENV.MONGODB_NAME
    });

    console.log("🚀 Connected to MongoDB");

    const rolesToSeed = [
      { name: "admin", type: "system" },
      { name: "user", type: "system" }
    ];

    for (const role of rolesToSeed) {
      const exists = await RoleModel.findOne({ name: role.name });
      if (!exists) {
        await RoleModel.create(role);
        console.log(`✅ Seeded role: ${role.name}`);
      } else {
        console.log(`ℹ️ Role "${role.name}" already exists`);
      }
    }
  } catch (err) {
    console.error("❌ Error seeding roles:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🧹 Disconnected from MongoDB");
    process.exit(0);
  }
}

seedSystemRoles();
