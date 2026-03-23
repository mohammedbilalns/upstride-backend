import { inject, injectable } from "inversify";
import type {
	CoinTransactionQuery,
	ICoinTransactionRepository,
} from "../../../../domain/repositories";
import { TYPES } from "../../../../shared/types/types";
import type {
	GetPlatformCoinTransactionsInput,
	GetPlatformCoinTransactionsOutput,
} from "../dtos/get-platform-coin-transactions.dto";
import { CoinTransactionDtoMapper } from "../mappers/coin-transaction.mapper";
import type { IGetPlatformCoinTransactionsUseCase } from "./get-platform-coin-transactions.usecase.interface";

@injectable()
export class GetPlatformCoinTransactionsUseCase
	implements IGetPlatformCoinTransactionsUseCase
{
	constructor(
		@inject(TYPES.Repositories.CoinTransactionRepository)
		private readonly coinTransactionRepository: ICoinTransactionRepository,
	) {}

	async execute(
		input: GetPlatformCoinTransactionsInput,
	): Promise<GetPlatformCoinTransactionsOutput> {
		const query: CoinTransactionQuery = {
			type: input.type,
			transactionOwner: "platform",
		};

		const sort: Record<string, 1 | -1> =
			input.sort === "old" ? { createdAt: 1 } : { createdAt: -1 };

		const result = await this.coinTransactionRepository.paginate({
			page: input.page,
			limit: input.limit,
			query,
			sort,
		});

		return {
			items: CoinTransactionDtoMapper.toDTOs(result.items),
			total: result.total,
			page: result.page,
			limit: result.limit,
			totalPages: result.totalPages,
		};
	}
}
