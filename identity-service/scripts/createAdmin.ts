import argon2 from "argon2";
import dotenv from "dotenv";
import mongoose, { model } from "mongoose";
import {
	type IUser,
	userSchema,
} from "../src/infrastructure/database/models/user.model";

dotenv.config();

const UserModel = mongoose.models.User || model<IUser>("User", userSchema);

async function main() {
	const [, , name, email, password, roleArg] = process.argv;

	if (!name || !email || !password || !roleArg) {
		console.error(
			"Usage: ts-node scripts/createAdmin.ts <name> <email> <password> <role: admin|superadmin>",
		);
		process.exit(1);
	}

	const role = roleArg.toLowerCase();
	if (!["admin", "superadmin"].includes(role)) {
		console.error("❌ Role must be either 'admin' or 'superadmin'");
		process.exit(1);
	}

	const mongoUri = process.env.MONGODB_URI;
	if (!mongoUri) {
		console.error("MONGODB_URI not set in .env");
		process.exit(1);
	}

	try {
		await mongoose.connect(mongoUri);

		const existing = await UserModel.findOne({ email });
		if (existing) {
			console.error(`❌ User with email ${email} already exists.`);
			process.exit(1);
		}

		const passwordHash = await argon2.hash(password);

		const user = new UserModel({
			name,
			email,
			passwordHash,
			role,
			isVerified: true,
		});

		await user.save();
		console.log(`✅ ${role} created: ${email}`);
	} catch (err) {
		console.error("Error creating user:", err);
		process.exit(1);
	} finally {
		await mongoose.disconnect();
	}
}

main();
