import { ICacheService } from "../../../domain/services/cache.service.interface";
import { ILogoutUC } from "../../../domain/useCases/auth/logout.uc.interface";
import { LogoutDto } from "../../dtos/auth.dto";

export class LogoutUC implements ILogoutUC {
	constructor(private _cacheService: ICacheService) {}

	/**
	 * Logs a user out from session.
	 */
	async execute(dto: LogoutDto): Promise<void> {
		const { userId } = dto;
		await this._cacheService.del(`user:${userId}`);
	}
}
