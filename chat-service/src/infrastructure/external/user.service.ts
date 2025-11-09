import {
	IUserService,
} from "../../domain/services/user.service.interface";
import { userData } from "../../common/types/user.types";
import env from "../config/env";
import { ICacheService } from "../../domain/services/cache.service.interface";
import { AppError } from "../../application/errors/AppError";
import { ErrorMessage, HttpStatus } from "../../common/enums";
import logger from "../../utils/logger";

export class UserService implements IUserService {
	private baseUrl = env.USERS_ENDPOINT;

	constructor(private cacheService: ICacheService) {}

  // FIX: Sometimes  user data is not there if cache hit 
	async getUserById(userId: string): Promise<userData> {
		try {
			const cacheKey = `user:${userId}`;
      logger.debug(`cache key : ${cacheKey}`)
			const cached = await this.cacheService.get<userData>(cacheKey);
      logger.debug(`cached data : ${JSON.stringify(cached)}`)
			if (cached) return cached;

			const res = await fetch(`${this.baseUrl}/${userId}`);
			if (!res.ok) {
				const errorText = await res.text();
				logger.error(
					`Failed to fetch user ${userId}: ${res.status} ${res.statusText} - ${errorText}`,
				);
				throw new AppError(ErrorMessage.FAILED_TO_FETCH_USERS, res.status);
			}

			const data = (await res.json()) as userData;
      logger.debug(`data from service : ${JSON.stringify(data)}`)
			await this.cacheService.set(cacheKey, data, 60 * 5);
			return data;
		} catch (error) {
			logger.error("Failed to fetch user data", error);
			if (error instanceof AppError) {
				throw error;
			}
			throw new AppError(
				ErrorMessage.FAILED_TO_FETCH_USERS,
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
        logger.debug(`cached data : ${JSON.stringify(cached)}`)
				if (cached) results.push(cached);
				else missingIds.push(id);
			}
      logger.info(`missing ids : ${JSON.stringify(missingIds)}`)

			if (missingIds.length) {
				const query = missingIds
					.map((id) => `ids=${encodeURIComponent(id)}`)
					.join("&");
				const url = `${this.baseUrl}?${query}`;

				logger.info(`Fetching users from: ${url}`);

				const res = await fetch(url);

				if (!res.ok) {
					const errorText = await res.text();
					logger.error(
						`Failed to fetch users: ${res.status} ${res.statusText} - ${errorText}`,
					);
					throw new AppError(ErrorMessage.FAILED_TO_FETCH_USERS, res.status);
				}

				let fetched: userData[];
				try {
					fetched = (await res.json()) as userData[];
				} catch (parseError) {
					logger.error("Failed to parse response JSON", parseError);
					throw new AppError(
						ErrorMessage.FAILED_TO_FETCH_USERS,
						HttpStatus.INTERNAL_SERVER_ERROR,
					);
				}

				// Cache the fetched users
				for (const user of fetched) {
          logger.info(`caching user : ${JSON.stringify(user)}`)
					await this.cacheService.set(`user:${user.id}`, user, 60 * 5);
				}

				results.push(...fetched);
			}

			return results;
		} catch (error) {
			logger.error("Failed to fetch users data", error);
			if (error instanceof AppError) {
				throw error;
			}
			throw new AppError(
				ErrorMessage.FAILED_TO_FETCH_USERS,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}
}
