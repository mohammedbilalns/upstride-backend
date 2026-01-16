import { CreateWalletDto } from "../../../application/dtos/wallet.dto";
import { Wallet } from "../../entities/wallet.entity";

export interface ICreateWalletUC {
    execute(dto: CreateWalletDto): Promise<Wallet>;
}
