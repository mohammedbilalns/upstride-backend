import type { Response } from "express";
import { inject, injectable } from "inversify";
import type { GetCoinTransactionsInput } from "../../../application/modules/wallet/dtos/get-coin-transactions.dto";
import type { GetPaymentTransactionsInput } from "../../../application/modules/wallet/dtos/get-payment-transactions.dto";
import type { GetPlatformCoinTransactionsInput } from "../../../application/modules/wallet/dtos/get-platform-coin-transactions.dto";
import type { GetPlatformPaymentTransactionsInput } from "../../../application/modules/wallet/dtos/get-platform-payment-transactions.dto";
import type {
	IGetCoinBalanceUseCase,
	IGetCoinTransactionsUseCase,
	IGetPaymentTransactionsUseCase,
	IGetPlatformCoinTransactionsUseCase,
	IGetPlatformPaymentTransactionsUseCase,
	IGetPlatformWalletUseCase,
} from "../../../application/modules/wallet/use-cases";
import { HttpStatus } from "../../../shared/constants";
import type { AuthenticatedRequest } from "../../../shared/types/authenticated-request.type";
import { TYPES } from "../../../shared/types/types";
import { WalletResponseMessages } from "../constants";
import { asyncHandler, sendSuccess } from "../helpers";

@injectable()
export class WalletController {
	constructor(
		@inject(TYPES.UseCases.GetCoinBalance)
		private readonly _getCoinBalanceUseCase: IGetCoinBalanceUseCase,
		@inject(TYPES.UseCases.GetCoinTransactions)
		private readonly _getCoinTransactionsUseCase: IGetCoinTransactionsUseCase,
		@inject(TYPES.UseCases.GetPaymentTransactions)
		private readonly _getPaymentTransactionsUseCase: IGetPaymentTransactionsUseCase,
		@inject(TYPES.UseCases.GetPlatformWallet)
		private readonly _getPlatformWalletUseCase: IGetPlatformWalletUseCase,
		@inject(TYPES.UseCases.GetPlatformCoinTransactions)
		private readonly _getPlatformCoinTransactionsUseCase: IGetPlatformCoinTransactionsUseCase,
		@inject(TYPES.UseCases.GetPlatformPaymentTransactions)
		private readonly _getPlatformPaymentTransactionsUseCase: IGetPlatformPaymentTransactionsUseCase,
	) {}

	getCoinBalance = asyncHandler(
		async (req: AuthenticatedRequest, res: Response) => {
			const data = await this._getCoinBalanceUseCase.execute({
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

			const data = await this._getCoinTransactionsUseCase.execute({
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

			const data = await this._getPaymentTransactionsUseCase.execute({
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

	getPlatformWallet = asyncHandler(async (_req, res) => {
		const data = await this._getPlatformWalletUseCase.execute();

		sendSuccess(res, HttpStatus.OK, {
			message: "Platform wallet fetched successfully",
			data,
		});
	});

	getPlatformCoinTransactions = asyncHandler(
		async (req: AuthenticatedRequest, res: Response) => {
			const query = req.validated?.query as GetPlatformCoinTransactionsInput;

			const data = await this._getPlatformCoinTransactionsUseCase.execute({
				page: query.page,
				limit: query.limit,
				sort: query.sort,
				type: query.type,
			});

			sendSuccess(res, HttpStatus.OK, {
				message: "Platform coin transactions fetched successfully",
				data,
			});
		},
	);

	getPlatformPaymentTransactions = asyncHandler(
		async (req: AuthenticatedRequest, res: Response) => {
			const query = req.validated?.query as GetPlatformPaymentTransactionsInput;

			const data = await this._getPlatformPaymentTransactionsUseCase.execute({
				page: query.page,
				limit: query.limit,
				sort: query.sort,
				status: query.status,
			});

			sendSuccess(res, HttpStatus.OK, {
				message: "Platform payment transactions fetched successfully",
				data,
			});
		},
	);
}
