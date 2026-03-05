import "reflect-metadata";
import { faker } from "@faker-js/faker";
import type { UserRole } from "../src/domain/entities/user.entity";
import { UserModel } from "../src/infrastructure/database/mongodb/models/user.model";
import {
	connectToMongo,
	disconnectFromMongo,
} from "../src/infrastructure/database/mongodb/mongodb.connection";
import { Argon2HasherService } from "../src/infrastructure/services/argon2.service";
import logger from "../src/shared/logging/logger";

const seedUsers = async () => {
	try {
		await connectToMongo();

		const hasher = new Argon2HasherService();
		const passwordHash = await hasher.hash("Password123!");

		const usersToCreate = 25;
		const users = [];

		for (let i = 0; i < usersToCreate; i++) {
			const role: UserRole = i % 2 === 0 ? "USER" : "MENTOR";
			users.push({
				name: faker.person.fullName(),
				email: faker.internet.email().toLowerCase(),
				passwordHash,
				authType: "LOCAL",
				role,
				isVerified: true,
				isBlocked: faker.datatype.boolean({ probability: 0.2 }), // 20% chance of being blocked
				createdAt: faker.date.past({ years: 1 }),
			});
		}

		await UserModel.insertMany(users);
		logger.info(`Successfully seeded ${usersToCreate} dummy users.`);
	} catch (error) {
		logger.error(`Error seeding users: ${error}`);
	} finally {
		await disconnectFromMongo();
	}
};

seedUsers();
