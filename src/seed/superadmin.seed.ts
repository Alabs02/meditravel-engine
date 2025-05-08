import mongoose from "mongoose";
import { UserModel } from "@user/entities/user.entity";
import { RoleModel } from "@role/entities/role.entity";
import { ENV } from "@/config";

export async function seedSuperAdmin() {
  try {
    await mongoose.connect(ENV.MONGODB_URI, {
      dbName: ENV.MONGODB_NAME
    });

    console.log("🚀 Connected to MongoDB");

    const email = "";

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      console.log(`ℹ️ Superadmin "${email}" already exists`);
      return;
    }

    const adminRole = await RoleModel.findOne({ name: "admin" });

    if (!adminRole) {
      console.error("❌ 'admin' role not found. Seed roles first.");
      return;
    }

    const superadmin = await UserModel.create({
      firebaseUid: "",
      email,
      name: "Alabura Usman",
      role: adminRole._id,
      isActive: true
    });

    console.log(`✅ Superadmin seeded: ${superadmin.email}`);
  } catch (err) {
    console.error("❌ Error seeding superadmin:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🧹 Disconnected from MongoDB");
    process.exit(0);
  }
}

seedSuperAdmin();
