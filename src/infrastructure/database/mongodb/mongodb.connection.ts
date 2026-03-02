import mongoose from "mongoose";

import logger from "../../../shared/logging/logger";
import env from "../../../shared/config/env";

let isConnected = false;

export const connectToMongo = async () => {
	if (isConnected) return;
	try {
		await mongoose.connect(env.MONGODB_URI);
		isConnected = true;
		logger.info(`Connected to database`);
	} catch (err) {
		logger.error(`Error connecting to database, ${err}`);
		process.exit(1);
	}
};

export const disconnectFromMongo = async () => {
	if (!isConnected) return;

	try {
		await mongoose.connection.close();
		isConnected = false;
		logger.info("Disconnected from the database");
	} catch (error) {
		logger.error(
			`Error disconnecting from the database: ${(error as Error).message} `,
		);
		throw new Error(
			`Error disconnecting from the database: ${(error as Error).message} `,
		);
	}
};
