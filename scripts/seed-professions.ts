import "reflect-metadata";
import fs from "node:fs/promises";
import path from "node:path";
import { ProfessionModel } from "../src/infrastructure/database/mongodb/models/profession.model";
import {
	connectToMongo,
	disconnectFromMongo,
} from "../src/infrastructure/database/mongodb/mongodb.connection";
import logger from "../src/shared/logging/logger";

const seedProfessions = async () => {
	try {
		await connectToMongo();

		const filePath = path.join(__dirname, "../professions.txt");
		const data = await fs.readFile(filePath, "utf-8");

		const professions = data
			.split("\n")
			.map((p) => p.trim())
			.filter(Boolean);

		let inserted = 0;
		let existed = 0;

		for (const name of professions) {
			const slug = name
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, "-")
				.replace(/(^-|-$)/g, "");

			const result = await ProfessionModel.updateOne(
				{ name },
				{
					$setOnInsert: {
						slug,
						isActive: true,
					},
				},
				{ upsert: true },
			);

			if (result.upsertedCount > 0) {
				inserted++;
			} else {
				existed++;
			}
		}

		logger.info(`Seeding complete. Inserted: ${inserted}, Existed: ${existed}`);
	} catch (error) {
		logger.error(`Error seeding professions: ${error}`);
	} finally {
		await disconnectFromMongo();
	}
};

seedProfessions();
