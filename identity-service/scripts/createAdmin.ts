import mongoose from "mongoose";
import argon2 from "argon2";
import { configDotenv } from "dotenv";
import { model } from "mongoose";

import {
  IUser,
  userSchema,
} from "../src/infrastructure/database/models/user.model";

configDotenv();

const UserModel = mongoose.models.User || model<IUser>("User", userSchema);

async function main() {
  const [, , email, password, roleArg] = process.argv;

  if (!email || !password || !roleArg) {
    console.error(
      "Usage: ts-node scripts/createAdmin.ts <email> <password> <role: admin|superadmin>",
    );
    process.exit(1);
  }

  const role = roleArg.toLowerCase();
  if (!["admin", "superadmin"].includes(role)) {
    console.error("❌ Role must be either 'admin' or 'superadmin'");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI!);

    const existing = await UserModel.findOne({ email });
    if (existing) {
      console.error(`❌ User with email ${email} already exists.`);
      process.exit(1);
    }

    const passwordHash = await argon2.hash(password);

    const user = new UserModel({
      name: role === "superadmin" ? "Super Admin" : "Admin",
      email,
      passwordHash,
      role,
      isVerified: true,
    });

    await user.save();
    console.log(`✅ ${role} created: ${email}`);
  } catch (err) {
    console.error("Error creating user:", err);
  } finally {
    await mongoose.disconnect();
  }
}

main();
