import type { Queue } from "bullmq";
import type { Request, Response } from "express";
import mongoose from "mongoose";
import { redisClient } from "../../../infrastructure/database/redis/redis.connection";
import { domainEventsQueue, mailQueue } from "../../../main/di/queues.di";
import { HttpStatus } from "../../../shared/constants";

type HealthStatus = "up" | "down";

interface HealthCheckResult {
	status: HealthStatus;
	latencyMs: number;
	details?: string;
}

const HEALTH_CHECK_TIMEOUT_MS = 2000;

/**
 * Wraps a promise with a timeout to prevent hanging health checks.
 * If the promise doesn't resolve within timeoutMs, it rejects with an error.
 */
const withTimeout = async <T>(
	promise: Promise<T>,
	timeoutMs: number,
): Promise<T> => {
	let timeoutId: NodeJS.Timeout | undefined;
	const timeoutPromise = new Promise<never>((_, reject) => {
		timeoutId = setTimeout(() => {
			reject(new Error(`Timed out after ${timeoutMs}ms`));
		}, timeoutMs);
	});

	try {
		return await Promise.race([promise, timeoutPromise]);
	} finally {
		if (timeoutId) clearTimeout(timeoutId);
	}
};

/**
 * Checks MongoDB connection health by verifying:
 * - Connection is in ready state
 * - Database is accessible via ping command
 */
const checkMongo = async (): Promise<HealthCheckResult> => {
	const start = Date.now();
	try {
		if (mongoose.connection.readyState !== 1 || !mongoose.connection.db) {
			throw new Error(
				`Mongo connection not ready (readyState=${mongoose.connection.readyState})`,
			);
		}
		await withTimeout(
			mongoose.connection.db.admin().ping(),
			HEALTH_CHECK_TIMEOUT_MS,
		);
		return { status: "up", latencyMs: Date.now() - start };
	} catch (error) {
		return {
			status: "down",
			latencyMs: Date.now() - start,
			details: (error as Error).message,
		};
	}
};

/**
 * Checks Redis connection health by sending a ping command.
 */
const checkRedis = async (): Promise<HealthCheckResult> => {
	const start = Date.now();
	try {
		await withTimeout(redisClient.ping(), HEALTH_CHECK_TIMEOUT_MS);
		return { status: "up", latencyMs: Date.now() - start };
	} catch (error) {
		return {
			status: "down",
			latencyMs: Date.now() - start,
			details: (error as Error).message,
		};
	}
};

/**
 * Checks a BullMQ queue health by verifying the queue's Redis client connectivity.
 */
const checkQueue = async (
	name: string,
	queue: Queue,
): Promise<HealthCheckResult> => {
	const start = Date.now();
	try {
		const client = await withTimeout(
			Promise.resolve(queue.client),
			HEALTH_CHECK_TIMEOUT_MS,
		);
		await withTimeout(client.ping(), HEALTH_CHECK_TIMEOUT_MS);
		return { status: "up", latencyMs: Date.now() - start };
	} catch (error) {
		return {
			status: "down",
			latencyMs: Date.now() - start,
			details: `${name}: ${(error as Error).message}`,
		};
	}
};

/**
 * Main health check endpoint handler.
 * Checks all core dependencies (MongoDB, Redis) and services (queues).
 * Returns overall status based on whether all checks passed.
 */
export const healthCheckHandler = async (_req: Request, res: Response) => {
	// Execute all health checks in parallel
	const [mongo, redis, mailQueueHealth, domainEventsQueueHealth] =
		await Promise.all([
			checkMongo(),
			checkRedis(),
			checkQueue("mailQueue", mailQueue),
			checkQueue("domainEventsQueue", domainEventsQueue),
		]);

	// Core infrastructure dependencies
	const dependencies = {
		mongo,
		redis,
	};

	// Background job services
	const services = {
		mailQueue: mailQueueHealth,
		domainEventsQueue: domainEventsQueueHealth,
	};

	// Aggregate all checks to determine overall health
	const allChecks = [
		...Object.values(dependencies),
		...Object.values(services),
	];
	const healthy = allChecks.every((check) => check.status === "up");

	res.status(healthy ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE).json({
		status: healthy ? "ok" : "degraded",
		timestamp: new Date().toISOString(),
		uptimeSeconds: Math.floor(process.uptime()),
		dependencies,
		services,
	});
};
