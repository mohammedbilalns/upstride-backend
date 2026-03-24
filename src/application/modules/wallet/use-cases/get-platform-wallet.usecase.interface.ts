import type { GetPlatformWalletOutput } from "../dtos/get-platform-wallet.dto";

export interface IGetPlatformWalletUseCase {
	execute(): Promise<GetPlatformWalletOutput>;
}
