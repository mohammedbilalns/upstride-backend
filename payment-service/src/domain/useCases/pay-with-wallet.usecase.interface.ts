import { PayWithWalletDto } from "../../application/dtos/payment.dto";

export interface IPayWithWalletUC {
    execute(data: PayWithWalletDto): Promise<void>;
}
