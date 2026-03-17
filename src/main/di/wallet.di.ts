import type { Container } from "inversify";
import {
	GetCoinBalanceUseCase,
	GetCoinTransactionsUseCase,
	GetPaymentTransactionsUseCase,
	type IGetCoinBalanceUseCase,
	type IGetCoinTransactionsUseCase,
	type IGetPaymentTransactionsUseCase,
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
};
