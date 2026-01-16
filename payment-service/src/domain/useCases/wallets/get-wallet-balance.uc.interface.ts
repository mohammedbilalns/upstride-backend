import {
    GetWalletBalanceDto,
    WalletBalanceResponseDto,
} from "../../../application/dtos/wallet.dto";

export interface IGetWalletBalanceUC {
    execute(dto: GetWalletBalanceDto): Promise<WalletBalanceResponseDto>;
}
