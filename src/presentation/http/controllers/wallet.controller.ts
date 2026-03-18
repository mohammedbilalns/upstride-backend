import type { Response } from "express";
import { inject, injectable } from "inversify";
import type { GetCoinTransactionsInput } from "../../../application/wallet/dtos/get-coin-transactions.dto";
import type { GetPaymentTransactionsInput } from "../../../application/wallet/dtos/get-payment-transactions.dto";
import type { GetPlatformCoinTransactionsInput } from "../../../application/wallet/dtos/get-platform-coin-transactions.dto";
import type { GetPlatformPaymentTransactionsInput } from "../../../application/wallet/dtos/get-platform-payment-transactions.dto";
import type {
	IGetCoinBalanceUseCase,
	IGetCoinTransactionsUseCase,
	IGetPaymentTransactionsUseCase,
	IGetPlatformCoinTransactionsUseCase,
	IGetPlatformPaymentTransactionsUseCase,
	IGetPlatformWalletUseCase,
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
		@inject(TYPES.UseCases.GetPlatformWallet)
		private readonly getPlatformWalletUseCase: IGetPlatformWalletUseCase,
		@inject(TYPES.UseCases.GetPlatformCoinTransactions)
		private readonly getPlatformCoinTransactionsUseCase: IGetPlatformCoinTransactionsUseCase,
		@inject(TYPES.UseCases.GetPlatformPaymentTransactions)
		private readonly getPlatformPaymentTransactionsUseCase: IGetPlatformPaymentTransactionsUseCase,
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

	getPlatformWallet = asyncHandler(async (_req, res) => {
		const data = await this.getPlatformWalletUseCase.execute();

		sendSuccess(res, HttpStatus.OK, {
			message: "Platform wallet fetched successfully",
			data,
		});
	});

	getPlatformCoinTransactions = asyncHandler(
		async (req: AuthenticatedRequest, res: Response) => {
			const query = req.validated?.query as GetPlatformCoinTransactionsInput;

			const data = await this.getPlatformCoinTransactionsUseCase.execute({
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

			const data = await this.getPlatformPaymentTransactionsUseCase.execute({
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
