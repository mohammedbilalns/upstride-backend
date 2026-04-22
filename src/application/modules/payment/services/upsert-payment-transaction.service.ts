import { inject, injectable } from "inversify";
import {
	PaymentStatus,
	PaymentTransaction,
} from "../../../../domain/entities/payment-transactions.entity";
import type { IPaymentTransactionRepository } from "../../../../domain/repositories/payment-transactions.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import type { IIdGenerator } from "../../../services/id-generator.service.interface";
import type {
	IUpsertPaymentTransactionService,
	UpsertPaymentTransactionParams,
} from "./upsert-payment-transaction.service.interface";

@injectable()
export class UpsertPaymentTransactionService
	implements IUpsertPaymentTransactionService
{
	constructor(
		@inject(TYPES.Repositories.PaymentTransactionRepository)
		private readonly _paymentTransactionRepository: IPaymentTransactionRepository,
		@inject(TYPES.Services.IdGenerator)
		private readonly _idGenerator: IIdGenerator,
	) {}

	async upsert({
		existing,
		userId,
		provider,
		sessionId,
		amountMinor,
		currency,
		coins,
		purpose,
		owner,
	}: UpsertPaymentTransactionParams): Promise<void> {
		if (!existing) {
			await this._paymentTransactionRepository.create(
				new PaymentTransaction(
					this._idGenerator.generate(),
					userId,
					provider,
					sessionId,
					amountMinor,
					currency,
					PaymentStatus.Completed,
					coins,
					purpose,
					"STRIPE",
					undefined,
					owner,
				),
			);
			return;
		}

		if (existing.status !== PaymentStatus.Completed) {
			await this._paymentTransactionRepository.updateStatusByProviderPaymentIdAndOwner(
				sessionId,
				PaymentStatus.Completed,
				owner,
			);
		}
	}
}
