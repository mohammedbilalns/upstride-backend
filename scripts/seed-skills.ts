import "reflect-metadata";
import fs from "node:fs/promises";
import path from "node:path";
import { InterestModel } from "../src/infrastructure/database/mongodb/models/interests.model";
import { SkillModel } from "../src/infrastructure/database/mongodb/models/skill.model";
import {
	connectToMongo,
	disconnectFromMongo,
} from "../src/infrastructure/database/mongodb/mongodb.connection";
import logger from "../src/shared/logging/logger";

const seedSkills = async () => {
	try {
		await connectToMongo();

		const filePath = path.join(__dirname, "../interest_skills.txt");
		const data = await fs.readFile(filePath, "utf-8");

		const lines = data
			.split("\n")
			.map((line) => line.trim())
			.filter(Boolean);

		let inserted = 0;
		let existed = 0;
		let notFoundInterests = 0;

		let currentInterestId: string | null = null;
		let currentInterestName: string | null = null;

		for (const line of lines) {
			// Check if line is a category header
			if (line.endsWith(":")) {
				currentInterestName = line.slice(0, -1).trim();
				// Find the interest in the database to get its ObjectId
				const interest = await InterestModel.findOne({
					name: currentInterestName,
				}).lean();

				if (!interest) {
					logger.warn(
						`Interest not found in DB: ${currentInterestName}. Skills under this will be skipped.`,
					);
					currentInterestId = null;
				} else {
					currentInterestId = interest._id.toString();
				}
				continue;
			}

			// If it's a skill line
			if (line.startsWith("- ")) {
				if (!currentInterestId) {
					notFoundInterests++;
					continue;
				}

				const skillName = line.slice(2).trim();
				const slug = skillName
					.toLowerCase()
					.replace(/[^a-z0-9]+/g, "-")
					.replace(/(^-|-$)/g, "");

				// Upsert based on skill name
				const result = await SkillModel.updateOne(
					{ name: skillName },
					{
						$setOnInsert: {
							slug,
							interestId: currentInterestId,
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
		}

		logger.info(
			`Seeding complete. Inserted: ${inserted}, Existed: ${existed}. Skipped skills due to missing interests: ${notFoundInterests}`,
		);
	} catch (error) {
		logger.error(`Error seeding skills: ${error}`);
	} finally {
		await disconnectFromMongo();
	}
};

seedSkills();
