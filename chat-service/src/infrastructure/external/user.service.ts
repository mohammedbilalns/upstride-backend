import {
	IUserService,
	userData,
} from "../../domain/services/user.service.interface";
import env from "../config/env";
import { ICacheService } from "../../domain/services/cache.service.interface";
import { AppError } from "../../application/errors/AppError";
import { ErrorMessage } from "../../common/enums";

export class UserService implements IUserService {
	private baseUrl = env.USERS_ENDPOINT;

	constructor(private cacheService: ICacheService) {}

	async getUserById(userId: string): Promise<userData> {
		const cacheKey = `user:${userId}`;
		const cached = await this.cacheService.get<userData>(cacheKey);
		if (cached) return cached;

		const res = await fetch(`${this.baseUrl}/${userId}`);
		if (!res.ok) throw new AppError(ErrorMessage.FAILED_TO_FETCH_USERS);

		const data = (await res.json()) as userData;
		await this.cacheService.set(cacheKey, data, 60 * 5);
		return data;
	}

	async getUsersByIds(userIds: string[]): Promise<userData[]> {
		const missingIds: string[] = [];
		const results: userData[] = [];

		for (const id of userIds) {
			const cached = await this.cacheService.get<userData>(`user:${id}`);
			if (cached) results.push(cached);
			else missingIds.push(id);
		}

		if (missingIds.length) {
			const query = missingIds.map((id) => `ids=${id}`).join("&");
			const res = await fetch(`${this.baseUrl}/?${query}`);
			if (!res.ok) throw new AppError(ErrorMessage.FAILED_TO_FETCH_USERS);

			const fetched = (await res.json()) as userData[];
			for (const user of fetched) {
				await this.cacheService.set(`user:${user.id}`, user, 60 * 5);
			}
			results.push(...fetched);
		}

		return results;
	}
}
