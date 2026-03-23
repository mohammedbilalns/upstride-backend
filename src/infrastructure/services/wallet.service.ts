import { inject, injectable } from "inversify";
import { UserNotFoundError } from "../../application/modules/authentication/errors";
import type { IIdGenerator, IWalletService } from "../../application/services";
import {
	CoinTransaction,
	type CoinTransactionType,
} from "../../domain/entities/coin-transactions.entity";
import type { ICoinTransactionRepository } from "../../domain/repositories/coin-transactions.repository.interface";
import type { IUserRepository } from "../../domain/repositories/user.repository.interface";
import { TYPES } from "../../shared/types/types";

@injectable()
export class WalletService implements IWalletService {
	constructor(
		@inject(TYPES.Repositories.UserRepository)
		private readonly userRepository: IUserRepository,
		@inject(TYPES.Repositories.CoinTransactionRepository)
		private readonly transactionRepository: ICoinTransactionRepository,
		@inject(TYPES.Services.IdGenerator)
		private readonly idGenerator: IIdGenerator,
	) {}

	async credit(
		userId: string,
		amount: number,
		type: CoinTransactionType,
		referenceType?: string,
		referenceId?: string,
	): Promise<string> {
		await this.userRepository.incrementBalance(userId, amount);

		const transaction = await this.transactionRepository.create(
			new CoinTransaction(
				this.idGenerator.generate(),
				userId,
				amount,
				type,
				referenceType,
				referenceId,
				undefined,
				"user",
			),
		);
		return transaction.id;
	}

	async debit(
		userId: string,
		amount: number,
		type: CoinTransactionType,
		referenceType?: string,
		referenceId?: string,
	): Promise<string> {
		const user = await this.userRepository.findById(userId);

		if (!user) {
			throw new UserNotFoundError();
		}

		if (user.coinBalance < amount) {
			throw new Error("Insufficient balance");
		}

		await this.userRepository.incrementBalance(userId, -amount);

		const transaction = await this.transactionRepository.create(
			new CoinTransaction(
				this.idGenerator.generate(),
				userId,
				-amount,
				type,
				referenceType,
				referenceId,
				undefined,
				"user",
			),
		);
		return transaction.id;
	}
}
