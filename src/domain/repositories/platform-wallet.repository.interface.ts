import type { PlatformWallet } from "../entities/platform-wallet.entity";

export interface IPlatformWalletRepository {
	get(): Promise<PlatformWallet | null>;
	getOrCreate(): Promise<PlatformWallet>;
	incrementBalance(amount: number): Promise<PlatformWallet>;
}
