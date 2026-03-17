import type { Response } from "express";
import { inject, injectable } from "inversify";
import type { GetCoinTransactionsInput } from "../../../application/wallet/dtos/get-coin-transactions.dto";
import type { GetPaymentTransactionsInput } from "../../../application/wallet/dtos/get-payment-transactions.dto";
import type {
	IGetCoinBalanceUseCase,
	IGetCoinTransactionsUseCase,
	IGetPaymentTransactionsUseCase,
} from "../../../application/wallet/use-cases";
import { HttpStatus } from "../../../shared/constants";
import type { AuthenticatedRequest } from "../../../shared/types/authenticated-request.type";
import { TYPES } from "../../../shared/types/types";
import { WalletResponseMessages } from "../constants";
import { asyncHandler, sendSuccess } from "../helpers";

@injectable()
export class WalletController {
	constructor(
		@inject(TYPES.UseCases.GetCoinBalance)
		private readonly getCoinBalanceUseCase: IGetCoinBalanceUseCase,
		@inject(TYPES.UseCases.GetCoinTransactions)
		private readonly getCoinTransactionsUseCase: IGetCoinTransactionsUseCase,
		@inject(TYPES.UseCases.GetPaymentTransactions)
		private readonly getPaymentTransactionsUseCase: IGetPaymentTransactionsUseCase,
	) {}

	getCoinBalance = asyncHandler(
		async (req: AuthenticatedRequest, res: Response) => {
			const data = await this.getCoinBalanceUseCase.execute({
				userId: req.user.id,
			});

			sendSuccess(res, HttpStatus.OK, {
				message: WalletResponseMessages.COIN_BALANCE_FETCHED,
				data,
			});
		},
	);

	getCoinTransactions = asyncHandler(
		async (req: AuthenticatedRequest, res: Response) => {
			const query = req.validated?.query as GetCoinTransactionsInput;

			const data = await this.getCoinTransactionsUseCase.execute({
				userId: req.user.id,
				page: query.page,
				limit: query.limit,
				sort: query.sort,
				type: query.type,
			});

			sendSuccess(res, HttpStatus.OK, {
				message: WalletResponseMessages.COIN_TRANSACTIONS_FETCHED,
				data,
			});
		},
	);

	getPaymentTransactions = asyncHandler(
		async (req: AuthenticatedRequest, res: Response) => {
			const query = req.validated?.query as GetPaymentTransactionsInput;

			const data = await this.getPaymentTransactionsUseCase.execute({
				userId: req.user.id,
				page: query.page,
				limit: query.limit,
				sort: query.sort,
				status: query.status,
			});

			sendSuccess(res, HttpStatus.OK, {
				message: WalletResponseMessages.PAYMENT_TRANSACTIONS_FETCHED,
				data,
			});
		},
	);
}
