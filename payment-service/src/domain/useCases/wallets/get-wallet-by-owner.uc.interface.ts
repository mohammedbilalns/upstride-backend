import { GetWalletByOwnerDto } from "../../../application/dtos/wallet.dto";
import { Wallet } from "../../../domain/entities/wallet.entity";

export interface IGetWalletByOwnerUC {
    execute(dto: GetWalletByOwnerDto): Promise<Wallet | null>;
}
