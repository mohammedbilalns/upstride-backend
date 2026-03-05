import { Worker } from "bullmq";
import type { Redis } from "ioredis";
import env from "../../shared/config/env";
import logger from "../../shared/logging/logger";
import { mailTransporter } from "../mail/nodemailer.transport";

/**
 * Creates and returns the BullMQ worker for the mailQueue.
 *
 * @param connection The Redis connection instance.
 * @returns A BullMQ Worker instance.
 */
export const createMailWorker = (connection: Redis): Worker => {
	const worker = new Worker(
		"mailQueue",
		async (job) => {
			logger.info(`Processing mail job ${job.id} `);
			const { to, subject, body } = job.data;

			try {
				await mailTransporter.sendMail({
					from: env.SMTP_USER,
					to,
					subject,
					html: body,
				});
				logger.info(`Mail sent successfully to ${to} `);
			} catch (error) {
				logger.error(`Failed to send mail to ${to}: ${error} `);
				throw error;
			}
		},
		{ connection, concurrency: 5 },
	);

	worker.on("failed", (job, err) => {
		logger.error(`Mail job ${job?.id} failed: ${err.message} `);
	});

	return worker;
};
