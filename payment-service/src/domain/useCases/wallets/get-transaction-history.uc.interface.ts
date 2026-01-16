import {
    GetTransactionHistoryDto,
    TransactionResponseDto,
} from "../../../application/dtos/wallet.dto";

export interface IGetTransactionHistoryUC {
    execute(dto: GetTransactionHistoryDto): Promise<TransactionResponseDto[]>;
}
