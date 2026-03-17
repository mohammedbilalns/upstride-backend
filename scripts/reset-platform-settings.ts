import "reflect-metadata";
import {
	DEFAULT_PLATFORM_SETTINGS,
	PlatformSettingsTypeValues,
} from "../src/domain/entities/platform-settings.entity";
import { PlatformSettingsModel } from "../src/infrastructure/database/mongodb/models/platform-settings.model";
import {
	connectToMongo,
	disconnectFromMongo,
} from "../src/infrastructure/database/mongodb/mongodb.connection";
import { MongoPlatformSettingsRepository } from "../src/infrastructure/database/mongodb/repositories/platform-settings.repository";
import {
	disconnectRedis,
	redisClient,
} from "../src/infrastructure/database/redis/redis.connection";
import logger from "../src/shared/logging/logger";

const PLATFORM_SETTINGS_CACHE_KEY = "platform_settings:all";

const getPlatformSettingCacheKey = (type: string) =>
	`platform_settings:${type}`;

const resetPlatformSettings = async () => {
	try {
		await Promise.all([connectToMongo(), redisClient.ping()]);

		const deleteResult = await PlatformSettingsModel.deleteMany({
			type: { $in: PlatformSettingsTypeValues },
		});

		const cacheKeys = [
			PLATFORM_SETTINGS_CACHE_KEY,
			...PlatformSettingsTypeValues.map(getPlatformSettingCacheKey),
		];

		await redisClient.del(...cacheKeys);

		const repository = new MongoPlatformSettingsRepository();
		const settings = await repository.ensureDefaults(DEFAULT_PLATFORM_SETTINGS);

		logger.info(
			`Reset ${deleteResult.deletedCount} platform settings, cleared ${cacheKeys.length} cache keys, and seeded ${settings.length} defaults`,
		);
	} catch (error) {
		logger.error(`Error resetting platform settings: ${error}`);
		process.exitCode = 1;
	} finally {
		await Promise.allSettled([disconnectFromMongo(), disconnectRedis()]);
	}
};

resetPlatformSettings();
