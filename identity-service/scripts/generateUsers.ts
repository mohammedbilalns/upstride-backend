import { faker } from "@faker-js/faker";
import argon2 from "argon2";
import mongoose, { model } from "mongoose";
import {
	type IUser,
	userSchema,
} from "../src/infrastructure/database/models/user.model";

const UserModel = mongoose.models.User || model<IUser>("User", userSchema);

async function main() {
	const [, , roleArg, countArg] = process.argv;

	if (!roleArg || !countArg) {
		console.error(
			"Usage: ts-node scripts/createDummyUsers.ts <role: user|admin|superadmin> <count>",
		);
		process.exit(1);
	}

	const role = roleArg.toLowerCase();
	if (!["user", "admin", "superadmin"].includes(role)) {
		console.error("❌ Role must be 'user', 'admin', or 'superadmin'");
		process.exit(1);
	}

	const count = parseInt(countArg, 10);
	if (Number.isNaN(count) || count <= 0) {
		console.error("❌ Count must be a positive integer");
		process.exit(1);
	}

	const mongoUri = process.env.MONGODB_URI;
	if (!mongoUri) {
		console.error("MONGODB_URI not set in .env");
		process.exit(1);
	}

	try {
		await mongoose.connect(mongoUri);
		console.log(`Connected to MongoDB`);

		for (let i = 0; i < count; i++) {
			const name = faker.person.fullName();
			const email = faker.internet.email({
				firstName: name.split(" ")[0],
				lastName: name.split(" ")[1] || "",
			});
			const password = "password123";

			const existing = await UserModel.findOne({ email });
			if (existing) {
				console.log(`⚠️  User with email ${email} already exists, skipping.`);
				continue;
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
			console.log(`✅ Created ${role}: ${email}`);
		}

		console.log(`✅ Finished creating ${count} dummy users.`);
	} catch (err) {
		console.error("Error creating users:", err);
		process.exit(1);
	} finally {
		await mongoose.disconnect();
	}
}

main();
