import "reflect-metadata";
import fs from "node:fs/promises";
import path from "node:path";
import { InterestModel } from "../src/infrastructure/database/mongodb/models/interests.model";
import {
	connectToMongo,
	disconnectFromMongo,
} from "../src/infrastructure/database/mongodb/mongodb.connection";
import logger from "../src/shared/logging/logger";
import { createSlug } from "../src/shared/utiliites/slug.util";

const seedInterests = async () => {
	try {
		await connectToMongo();

		const filePath = path.join(__dirname, "../interests.txt");
		const data = await fs.readFile(filePath, "utf-8");

		const interests = data
			.split("\n")
			.map((i) => i.trim())
			.filter(Boolean);

		let inserted = 0;
		let existed = 0;

		for (const name of interests) {
			const slug = createSlug(name);

			// Upsert based on name
			const result = await InterestModel.updateOne(
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
		logger.error(`Error seeding interests: ${error}`);
	} finally {
		await disconnectFromMongo();
	}
};

seedInterests();
