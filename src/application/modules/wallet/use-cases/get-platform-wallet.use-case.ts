import { inject, injectable } from "inversify";
import type { IPlatformWalletRepository } from "../../../../domain/repositories/platform-wallet.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import type { GetPlatformWalletOutput } from "../dtos/get-platform-wallet.dto";
import type { IGetPlatformWalletUseCase } from "./get-platform-wallet.use-case.interface";

@injectable()
export class GetPlatformWalletUseCase implements IGetPlatformWalletUseCase {
	constructor(
		@inject(TYPES.Repositories.PlatformWalletRepository)
		private readonly _platformWalletRepository: IPlatformWalletRepository,
	) {}

	async execute(): Promise<GetPlatformWalletOutput> {
		const wallet = await this._platformWalletRepository.getOrCreate();
		return { balance: wallet.balance / 100 };
	}
}
