import mongoose from "mongoose";
import logger from "../../common/utils/logger";
import env from "./env";

let isConnected = false;

export const connectToDb = async () => {
	if (isConnected) return;
	try {
		await mongoose.connect(env.MONGODB_URI);
		isConnected = true;
		logger.info(`Connected to database`);
	} catch (error) {
		logger.error(`Error connecting to database, ${error}`);
		throw new Error(`Error connecting to database: ${error.message} `);
	}
};

export const disconnectFromDb = async () => {
	if (!isConnected) return;

	try {
		await mongoose.connection.close();
		isConnected = false;
		logger.info("Disconnected from the database");
	} catch (error) {
		logger.error("Error disconnecting from the database", error);
		throw new Error(`Error disconnecting from the database: ${error.message} `);
	}
};
