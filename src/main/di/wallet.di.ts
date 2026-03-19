import type { Container } from "inversify";
import {
	GetCoinBalanceUseCase,
	GetCoinTransactionsUseCase,
	GetPaymentTransactionsUseCase,
	GetPlatformCoinTransactionsUseCase,
	GetPlatformPaymentTransactionsUseCase,
	GetPlatformWalletUseCase,
	type IGetCoinBalanceUseCase,
	type IGetCoinTransactionsUseCase,
	type IGetPaymentTransactionsUseCase,
	type IGetPlatformCoinTransactionsUseCase,
	type IGetPlatformPaymentTransactionsUseCase,
	type IGetPlatformWalletUseCase,
} from "../../application/wallet/use-cases";
import { TYPES } from "../../shared/types/types";

export const registerWalletBindings = (container: Container): void => {
	container
		.bind<IGetCoinBalanceUseCase>(TYPES.UseCases.GetCoinBalance)
		.to(GetCoinBalanceUseCase)
		.inSingletonScope();
	container
		.bind<IGetCoinTransactionsUseCase>(TYPES.UseCases.GetCoinTransactions)
		.to(GetCoinTransactionsUseCase)
		.inSingletonScope();
	container
		.bind<IGetPaymentTransactionsUseCase>(TYPES.UseCases.GetPaymentTransactions)
		.to(GetPaymentTransactionsUseCase)
		.inSingletonScope();
	container
		.bind<IGetPlatformWalletUseCase>(TYPES.UseCases.GetPlatformWallet)
		.to(GetPlatformWalletUseCase)
		.inSingletonScope();
	container
		.bind<IGetPlatformCoinTransactionsUseCase>(
			TYPES.UseCases.GetPlatformCoinTransactions,
		)
		.to(GetPlatformCoinTransactionsUseCase)
		.inSingletonScope();
	container
		.bind<IGetPlatformPaymentTransactionsUseCase>(
			TYPES.UseCases.GetPlatformPaymentTransactions,
		)
		.to(GetPlatformPaymentTransactionsUseCase)
		.inSingletonScope();
};
