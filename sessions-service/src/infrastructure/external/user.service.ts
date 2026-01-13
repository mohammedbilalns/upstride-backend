import { AppError } from "../../application/errors/app-error";
import { ErrorMessage, HttpStatus } from "../../common/enums";
import { userData } from "../../common/types/user.types";
import logger from "../../common/utils/logger";
import { ICacheService } from "../../domain/services/cache.service.interface";
import { IUserService } from "../../domain/services/user.service.interface";
import env from "../config/env";

export class UserService implements IUserService {
	private baseUrl = env.USERS_ENDPOINT;

	constructor(private cacheService: ICacheService) {}

	async getUserById(userId: string): Promise<userData> {
		try {
			const cacheKey = `user:${userId}`;
			const cached = await this.cacheService.get<userData>(cacheKey);
			if (cached) return cached;

			const res = await fetch(`${this.baseUrl}/${userId}`);
			if (!res.ok) {
				const errorText = await res.text();
				logger.error(
					`Failed to fetch user ${userId}: ${res.status} ${res.statusText} - ${errorText}`,
				);
				throw new AppError(
					ErrorMessage.FAILED_TO_FETCH_DATA,
					HttpStatus.INTERNAL_SERVER_ERROR,
				);
			}

			const data = (await res.json()) as userData;
			await this.cacheService.set(cacheKey, data, 60 * 5); // 5 mins cache
			return data;
		} catch (error) {
			logger.error(`Error in getUserById: ${error}`);
			if (error instanceof AppError) throw error;
			throw new AppError(
				ErrorMessage.FAILED_TO_FETCH_DATA,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async getUsersByIds(userIds: string[]): Promise<userData[]> {
		try {
			const missingIds: string[] = [];
			const results: userData[] = [];

			for (const id of userIds) {
				const cached = await this.cacheService.get<userData>(`user:${id}`);
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
						`Failed to fetch users: ${res.status} ${res.statusText} - ${errorText}`,
					);
					throw new AppError(
						ErrorMessage.FAILED_TO_FETCH_DATA,
						HttpStatus.INTERNAL_SERVER_ERROR,
					);
				}

				let fetched: userData[];
				try {
					fetched = (await res.json()) as userData[];
				} catch (parseError) {
					logger.error("Failed to parse response JSON", parseError);
					throw new AppError(
						ErrorMessage.FAILED_TO_FETCH_DATA,
						HttpStatus.INTERNAL_SERVER_ERROR,
					);
				}

				// Cache the fetched users
				for (const user of fetched) {
					await this.cacheService.set(`user:${user.id}`, user, 60 * 5);
				}

				results.push(...fetched);
			}

			return results;
		} catch (error) {
			logger.error("Failed to fetch users data", error);
			if (error instanceof AppError) throw error;
			throw new AppError(
				ErrorMessage.FAILED_TO_FETCH_DATA,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}
}
