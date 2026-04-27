import "reflect-metadata";
import { DEFAULT_PLATFORM_SETTINGS } from "../src/domain/entities/platform-settings.entity";
import {
	connectToMongo,
	disconnectFromMongo,
} from "../src/infrastructure/database/mongodb/mongodb.connection";
import { MongoPlatformSettingsRepository } from "../src/infrastructure/database/mongodb/repositories/platform-settings.repository";
import logger from "../src/shared/logging/logger";

const seedPlatformSettings = async () => {
	try {
		await connectToMongo();

		const repository = new MongoPlatformSettingsRepository();
		const settings = await repository.ensureDefaults(DEFAULT_PLATFORM_SETTINGS);

		logger.info(`Seeded ${settings.length} platform settings`);
	} catch (error) {
		logger.error(`Error seeding platform settings: ${error}`);
		process.exitCode = 1;
	} finally {
		await disconnectFromMongo();
	}
};

seedPlatformSettings();
