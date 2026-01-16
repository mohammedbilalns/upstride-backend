import { OwnerType } from "../../entities/wallet.entity";

import { WalletDetailsDto } from "../../../application/dtos/wallet.dto";

export { WalletDetailsDto };

export interface IGetWalletDetailsUC {
    execute(data: {
        ownerId: string;
        ownerType: OwnerType;
        limit?: number;
        offset?: number;
    }): Promise<WalletDetailsDto>;
}
