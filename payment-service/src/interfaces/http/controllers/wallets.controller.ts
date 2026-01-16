import { Request, Response } from "express";
import { IGetWalletBalanceUC } from "../../../domain/useCases/wallets/get-wallet-balance.uc.interface";

import { IGetWalletDetailsUC } from "../../../domain/useCases/wallets/get-wallet-details.uc.interface";
import { OwnerType } from "../../../domain/entities/wallet.entity";
import { HttpStatus } from "../../../common/enums";
import { ResponseMessage } from "../../../common/enums/response-messages";
import asyncHandler from "../utils/async-handler";
import {
    getWalletBalanceSchema,
} from "../validations/wallet.validation";

export class WalletsController {
    constructor(
        private _getWalletBalanceUC: IGetWalletBalanceUC,
        private _getWalletDetailsUC: IGetWalletDetailsUC,
    ) { }

    getBalance = asyncHandler(async (req: Request, res: Response) => {
        const userId = res.locals.user?.id;
        const { query } = getWalletBalanceSchema.parse({ query: req.query });

        const balance = await this._getWalletBalanceUC.execute({
            ownerId: userId,
            ownerType: query.ownerType as OwnerType,
        });

        return res.status(HttpStatus.OK).json({
            message: ResponseMessage.WALLET_BALANCE_RETRIEVED,
            data: balance,
        });
    });

    getWalletDetails = asyncHandler(async (req: Request, res: Response) => {
        const userId = res.locals.user?.id;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = (page - 1) * limit;

        const details = await this._getWalletDetailsUC.execute({
            ownerId: userId,
            ownerType: OwnerType.USER,
            limit,
            offset,
        });

        return res.status(HttpStatus.OK).json({
            message: ResponseMessage.WALLET_BALANCE_RETRIEVED,
            data: details,
        });
    });
}
