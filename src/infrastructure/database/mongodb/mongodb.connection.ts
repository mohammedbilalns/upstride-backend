import { type Db, MongoClient } from "mongodb";
import env from "../../../shared/config/env.js";
import logger from "../../../shared/logging/logger.js";

let client: MongoClient | null = null;
let db: Db | null = null;

/**
 * Establishes a MongoDB connection.
 *
 * - Reuses existing connection if already established.
 */
export const connectToMongo = async (): Promise<Db> => {
	if (db) return db;

	try {
		client = new MongoClient(env.MONGODB_URI);
		await client.connect();

		db = client.db();
		logger.info(`Connected to MongoDB`);

		return db;
	} catch (e) {
		logger.error(`Error connecting to database: ${e}`);
		process.exit(1);
	}
};

/**
 * Returns the active database instance.
 *
 * Throws if accessed before initialization.
 */
export const getDb = (): Db => {
	if (!db) throw new Error("Database not connected");
	return db;
};

/**
 * Gracefully closes the MongoDB connection.
 *
 * triggers a disconnection if already connected.
 */
export const disconnectFromMongo = async (): Promise<void> => {
	if (!client) return;

	try {
		await client.close();
		client = null;
		db = null;

		logger.info(`Disconnected from database`);
	} catch (error) {
		logger.error(`Error disconnecting from database: ${error}`);
	}
};
