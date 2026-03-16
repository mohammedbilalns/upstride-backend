import "reflect-metadata";
import { PlatformSettingsTypeValues } from "../src/domain/entities/platform-settings.entity";
import { PlatformSettingsModel } from "../src/infrastructure/database/mongodb/models/platform-settings.model";
import {
	connectToMongo,
	disconnectFromMongo,
} from "../src/infrastructure/database/mongodb/mongodb.connection";
import {
	disconnectRedis,
	redisClient,
} from "../src/infrastructure/database/redis/redis.connection";
import logger from "../src/shared/logging/logger";

const PLATFORM_SETTINGS_CACHE_KEY = "platform_settings:all";

const getPlatformSettingCacheKey = (type: string) =>
	`platform_settings:${type}`;

const clearPlatformSettings = async () => {
	try {
		await Promise.all([connectToMongo(), redisClient.ping()]);

		// clear from the mongo collection
		const deleteResult = await PlatformSettingsModel.deleteMany({
			type: { $in: PlatformSettingsTypeValues },
		});

		const cacheKeys = [
			PLATFORM_SETTINGS_CACHE_KEY,
			...PlatformSettingsTypeValues.map(getPlatformSettingCacheKey),
		];

		// clear from the redis cache
		await redisClient.del(...cacheKeys);

		logger.info(
			`Cleared ${deleteResult.deletedCount} platform settings and ${cacheKeys.length} cache keys`,
		);
	} catch (error) {
		logger.error(`Error clearing platform settings: ${error}`);
		process.exitCode = 1;
	} finally {
		await Promise.allSettled([disconnectFromMongo(), disconnectRedis()]);
	}
};

clearPlatformSettings();
