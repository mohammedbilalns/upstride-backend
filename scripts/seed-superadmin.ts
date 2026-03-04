import "reflect-metadata";
import {
	AuthTypeValues,
	UserRoleValues,
} from "../src/domain/entities/user.entity";
import { UserModel } from "../src/infrastructure/database/mongodb/models/user.model";
import {
	connectToMongo,
	disconnectFromMongo,
} from "../src/infrastructure/database/mongodb/mongodb.connection";
import { Argon2HasherService } from "../src/infrastructure/services/argon2.service";
import logger from "../src/shared/logging/logger";

const seedSuperAdmin = async () => {
	try {
		const args = process.argv.slice(2);
		let email = "";
		let password = "";

		for (const arg of args) {
			if (arg.startsWith("--email=")) {
				email = arg.split("=")[1];
			} else if (arg.startsWith("--password=")) {
				password = arg.split("=")[1];
			}
		}

		if (!email || !password) {
			logger.error(
				"Usage: npm run seed:superadmin -- --email=admin@example.com --password=secret",
			);
			process.exit(1);
		}

		await connectToMongo();

		const hasher = new Argon2HasherService();
		const passwordHash = await hasher.hash(password);

		// Upsert super admin
		const result = await UserModel.updateOne(
			{ email },
			{
				$setOnInsert: {
					name: "Super Admin",
					authType: "LOCAL",
					role: "SUPER_ADMIN",
				},
				$set: {
					passwordHash,
					isVerified: true,
				},
			},
			{ upsert: true },
		);

		if (result.upsertedCount > 0) {
			logger.info(`Super Admin successfully created for email: ${email}`);
		} else {
			logger.info(
				`Super Admin successfully updated for email: ${email} (Password reset to new hash)`,
			);
		}
	} catch (error) {
		logger.error(`Error seeding super admin: ${error}`);
	} finally {
		await disconnectFromMongo();
	}
};

seedSuperAdmin();
