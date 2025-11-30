import { ICacheService } from "../../../domain/services/cache.service.interface";
import { ILogoutUC } from "../../../domain/useCases/auth/logout.uc.interface";

export class LogoutUC implements ILogoutUC {
	constructor(private _cacheService: ICacheService) {}

	async execute(userId: string): Promise<void> {
		await this._cacheService.del(`user:${userId}`);
	}
}
