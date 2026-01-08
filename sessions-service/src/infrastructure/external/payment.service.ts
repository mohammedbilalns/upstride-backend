import { AppError } from "../../application/errors/AppError";
import { ErrorMessage, HttpStatus } from "../../common/enums";
import { PaymentDetails } from "../../common/types/payment.types";
import logger from "../../common/utils/logger";
import { ICacheService } from "../../domain/services/cache.service.interface";
import { IPaymentService } from "../../domain/services/payment.service.interface";
import env from "../config/env";

export class PaymentService implements IPaymentService {
	private baseUrl = env.PAYMENT_SERVICE_URL;

	constructor(private cacheService: ICacheService) {}

	async getPaymentById(paymentId: string): Promise<PaymentDetails> {
		try {
			const cacheKey = `payment:${paymentId}`;
			const cached = await this.cacheService.get<PaymentDetails>(cacheKey);
			if (cached) return cached;

			const res = await fetch(`${this.baseUrl}/${paymentId}`);
			if (!res.ok) {
				const errorText = await res.text();
				logger.error(
					`Failed to fetch payment ${paymentId}: ${res.status} ${res.statusText} - ${errorText}`,
				);
				throw new AppError(
					ErrorMessage.FAILED_TO_FETCH_DATA,
					HttpStatus.INTERNAL_SERVER_ERROR,
				);
			}

			const data = (await res.json()) as PaymentDetails;
			await this.cacheService.set(cacheKey, data, 60 * 5); // 5 mins cache
			return data;
		} catch (error) {
			logger.error(`Error in getPaymentById: ${error}`);
			if (error instanceof AppError) throw error;
			throw new AppError(
				ErrorMessage.FAILED_TO_FETCH_DATA,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async getPaymentsByIds(paymentIds: string[]): Promise<PaymentDetails[]> {
		try {
			const missingIds: string[] = [];
			const results: PaymentDetails[] = [];

			for (const id of paymentIds) {
				const cached = await this.cacheService.get<PaymentDetails>(
					`payment:${id}`,
				);
				if (cached) results.push(cached);
				else missingIds.push(id);
			}

			if (missingIds.length) {
				const query = missingIds
					.map((id) => `ids=${encodeURIComponent(id)}`)
					.join("&");
				const url = `${this.baseUrl}?${query}`;

				const res = await fetch(url);

				if (!res.ok) {
					const errorText = await res.text();
					logger.error(
						`Failed to fetch payments: ${res.status} ${res.statusText} - ${errorText}`,
					);
					throw new AppError(
						ErrorMessage.FAILED_TO_FETCH_DATA,
						HttpStatus.INTERNAL_SERVER_ERROR,
					);
				}

				let fetched: PaymentDetails[];
				try {
					fetched = (await res.json()) as PaymentDetails[];
				} catch (parseError) {
					logger.error("Failed to parse response JSON", parseError);
					throw new AppError(
						ErrorMessage.FAILED_TO_FETCH_DATA,
						HttpStatus.INTERNAL_SERVER_ERROR,
					);
				}

				// Cache the fetched payments
				for (const payment of fetched) {
					await this.cacheService.set(`payment:${payment.id}`, payment, 60 * 5);
				}

				results.push(...fetched);
			}

			return results;
		} catch (error) {
			logger.error("Failed to fetch payments data", error);
			if (error instanceof AppError) throw error;
			throw new AppError(
				ErrorMessage.FAILED_TO_FETCH_DATA,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}
}
