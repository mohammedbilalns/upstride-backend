import { inject, injectable } from "inversify";
import { PaymentStatus } from "../../../domain/entities/payment-transactions.entity";
import type {
	IPaymentTransactionRepository,
	PaymentTransactionQuery,
} from "../../../domain/repositories/payment-transactions.repository.interface";
import { TYPES } from "../../../shared/types/types";
import type {
	GetPaymentTransactionsInput,
	GetPaymentTransactionsOutput,
} from "../dtos/get-payment-transactions.dto";
import { PaymentTransactionDtoMapper } from "../mappers/payment-transaction.mapper";
import type { IGetPaymentTransactionsUseCase } from "./get-payment-transactions.usecase.interface";

@injectable()
export class GetPaymentTransactionsUseCase
	implements IGetPaymentTransactionsUseCase
{
	constructor(
		@inject(TYPES.Repositories.PaymentTransactionRepository)
		private readonly paymentTransactionRepository: IPaymentTransactionRepository,
	) {}

	async execute(
		input: GetPaymentTransactionsInput,
	): Promise<GetPaymentTransactionsOutput> {
		const query: PaymentTransactionQuery = {
			userId: input.userId,
			status: PaymentStatus.Completed,
			transactionOwner: "user",
		};

		const sort: Record<string, 1 | -1> =
			input.sort === "old" ? { createdAt: 1 } : { createdAt: -1 };

		const result = await this.paymentTransactionRepository.paginate({
			page: input.page,
			limit: input.limit,
			query,
			sort,
		});

		return {
			items: PaymentTransactionDtoMapper.toDTOs(result.items),
			total: result.total,
			page: result.page,
			limit: result.limit,
			totalPages: result.totalPages,
		};
	}
}
