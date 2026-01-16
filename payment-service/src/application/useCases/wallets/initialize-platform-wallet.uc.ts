import { IWalletRepository } from "../../../domain/repositories/wallet.repository.interface";
import { OwnerType } from "../../../domain/entities/wallet.entity";
import logger from "../../../common/utils/logger";

export class InitializePlatformWalletUC {
    constructor(private _walletRepository: IWalletRepository) { }

    async execute(): Promise<void> {
        try {
            const platformWallet = await this._walletRepository.getPlatformWallet();
            if (!platformWallet) {
                logger.info("Initializing Platform Wallet...");
                await this._walletRepository.create({
                    ownerId: "PLATFORM", 
                    ownerType: OwnerType.PLATFORM,
                    balance: 0,
                    currency: "INR",
                });
                logger.info("Platform Wallet initialized successfully.");
            } else {
                logger.info("Platform Wallet already exists.");
            }
        } catch (error) {
            logger.error("Failed to initialize Platform Wallet:", error);
        }
    }
}
