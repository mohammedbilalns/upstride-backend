import { IGetWalletBalanceUC } from "../../../domain/useCases/wallets/get-wallet-balance.uc.interface";
import { IWalletRepository } from "../../../domain/repositories/wallet.repository.interface";
import {
    GetWalletBalanceDto,
    WalletBalanceResponseDto,
} from "../../dtos/wallet.dto";

export class GetWalletBalanceUC implements IGetWalletBalanceUC {
    constructor(private _walletRepository: IWalletRepository) { }

    async execute(dto: GetWalletBalanceDto): Promise<WalletBalanceResponseDto> {
        const wallet = await this._walletRepository.findByOwner(
            dto.ownerId,
            dto.ownerType,
        );

        if (!wallet) {
            return {
                walletId: "",
                balance: 0,
                currency: "INR",
            };
        }

        return {
            walletId: wallet.id,
            balance: wallet.balance,
            currency: wallet.currency,
        };
    }
}
