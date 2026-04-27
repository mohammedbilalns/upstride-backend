import { inject, injectable } from "inversify";
import type {
	IPaymentTransactionRepository,
	PaymentTransactionQuery,
} from "../../../../domain/repositories/payment-transactions.repository.interface";
import { TYPES } from "../../../../shared/types/types";
import { mapPaginatedResult } from "../../../shared/utilities/pagination.util";
import type {
	GetPlatformPaymentTransactionsInput,
	GetPlatformPaymentTransactionsOutput,
} from "../dtos/get-platform-payment-transactions.dto";
import { PaymentTransactionDtoMapper } from "../mappers/payment-transaction.mapper";
import type { IGetPlatformPaymentTransactionsUseCase } from "./get-platform-payment-transactions.use-case.interface";

@injectable()
export class GetPlatformPaymentTransactionsUseCase
	implements IGetPlatformPaymentTransactionsUseCase
{
	constructor(
		@inject(TYPES.Repositories.PaymentTransactionRepository)
		private readonly _paymentTransactionRepository: IPaymentTransactionRepository,
	) {}

	async execute(
		input: GetPlatformPaymentTransactionsInput,
	): Promise<GetPlatformPaymentTransactionsOutput> {
		const query: PaymentTransactionQuery = {
			status: input.status,
			transactionOwner: "platform",
		};

		const sort: Record<string, 1 | -1> =
			input.sort === "old" ? { createdAt: 1 } : { createdAt: -1 };

		const result = await this._paymentTransactionRepository.paginate({
			page: input.page,
			limit: input.limit,
			query,
			sort,
		});
		const effectiveRevenue =
			await this._paymentTransactionRepository.getEffectivePlatformRevenue();

		return {
			...mapPaginatedResult(result, PaymentTransactionDtoMapper.toDTOs),
			summary: {
				effectiveRevenue,
			},
		};
	}
}
