import { UserModel } from "../src/infrastructure/database/mongodb/models/user.model";
import {
	connectToMongo,
	disconnectFromMongo,
} from "../src/infrastructure/database/mongodb/mongodb.connection";
import logger from "../src/shared/logging/logger";

const migrateUserPreferencesSkillLevels = async () => {
	try {
		await connectToMongo();

		const result = await UserModel.updateMany(
			{ "preferences.skills.level": { $exists: true } },
			{ $unset: { "preferences.skills.$[].level": "" } },
		);

		logger.info(
			`Migrated ${result.modifiedCount ?? 0} users to the new preferences skill structure.`,
		);
	} catch (error) {
		logger.error(`Error migrating user preferences: ${error}`);
		process.exitCode = 1;
	} finally {
		await disconnectFromMongo();
	}
};

migrateUserPreferencesSkillLevels();
