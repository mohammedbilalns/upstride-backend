import { Worker } from "bullmq";
import { inject, injectable } from "inversify";
import type { Redis } from "ioredis";
import { QUEUE_NAMES } from "../../../shared/constants";
import logger from "../../../shared/logging/logger";
import { TYPES } from "../../../shared/types/types";
import type { BookingSettlementHandler } from "./booking-settlement.handler";

@injectable()
export class BookingWorkerFactory {
	private _worker: Worker | null = null;

	constructor(
		@inject(TYPES.Databases.Redis)
		private readonly _connection: Redis,
		@inject(TYPES.Workers.BookingSettlementHandler)
		private readonly _bookingSettlementHandler: BookingSettlementHandler,
	) {}

	create(): Worker {
		if (this._worker) {
			return this._worker;
		}

		const worker = new Worker(
			QUEUE_NAMES.BOOKING_SETTLEMENT,
			async (job) => {
				logger.info(`Processing booking job ${job.id}`);

				if (job.name !== "settle-ended-session") {
					throw new Error(`No handler for job: ${job.name}`);
				}

				await this._bookingSettlementHandler.handle(job.data);
			},
			{ connection: this._connection, concurrency: 5 },
		);

		worker.on("failed", (job, err) => {
			logger.error(`Booking job ${job?.id} failed: ${err.message}`);
		});

		this._worker = worker;
		return this._worker;
	}
}
