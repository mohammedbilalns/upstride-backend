import { ICreateWalletUC } from "../../../domain/useCases/wallets/create-wallet.uc.interface";
import { IWalletRepository } from "../../../domain/repositories/wallet.repository.interface";
import { CreateWalletDto } from "../../dtos/wallet.dto";
import { Wallet } from "../../../domain/entities/wallet.entity";

export class CreateWalletUC implements ICreateWalletUC {
    constructor(private _walletRepository: IWalletRepository) { }

    async execute(dto: CreateWalletDto): Promise<Wallet> {
        // Check if wallet already exists
        const existingWallet = await this._walletRepository.findByOwner(
            dto.ownerId,
            dto.ownerType,
        );

        if (existingWallet) {
            return existingWallet;
        }

        // Create new wallet
        const wallet = await this._walletRepository.create({
            ownerId: dto.ownerId,
            ownerType: dto.ownerType,
            balance: 0,
            currency: dto.currency || "INR",
        });

        return wallet;
    }
}
