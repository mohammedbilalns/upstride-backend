import { IGetWalletByOwnerUC } from "../../../domain/useCases/wallets/get-wallet-by-owner.uc.interface";
import { IWalletRepository } from "../../../domain/repositories/wallet.repository.interface";
import { GetWalletByOwnerDto } from "../../dtos/wallet.dto";
import { Wallet } from "../../../domain/entities/wallet.entity";

export class GetWalletByOwnerUC implements IGetWalletByOwnerUC {
    constructor(private _walletRepository: IWalletRepository) { }

    async execute(dto: GetWalletByOwnerDto): Promise<Wallet | null> {
        return await this._walletRepository.findByOwner(
            dto.ownerId,
            dto.ownerType,
        );
    }
}
