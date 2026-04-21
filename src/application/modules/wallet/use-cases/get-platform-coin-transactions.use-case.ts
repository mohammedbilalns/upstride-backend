import { inject, injectable } from "inversify";
import type {
	CoinTransactionQuery,
	ICoinTransactionRepository,
} from "../../../../domain/repositories";
import { TYPES } from "../../../../shared/types/types";
import { mapPaginatedResult } from "../../../shared/utilities/pagination.util";
import type {
	GetPlatformCoinTransactionsInput,
	GetPlatformCoinTransactionsOutput,
} from "../dtos/get-platform-coin-transactions.dto";
import { CoinTransactionDtoMapper } from "../mappers/coin-transaction.mapper";
import type { IGetPlatformCoinTransactionsUseCase } from "./get-platform-coin-transactions.use-case.interface";

@injectable()
export class GetPlatformCoinTransactionsUseCase
	implements IGetPlatformCoinTransactionsUseCase
{
	constructor(
		@inject(TYPES.Repositories.CoinTransactionRepository)
		private readonly _coinTransactionRepository: ICoinTransactionRepository,
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

		const result = await this._coinTransactionRepository.paginate({
			page: input.page,
			limit: input.limit,
			query,
			sort,
		});

		return mapPaginatedResult(result, CoinTransactionDtoMapper.toDTOs);
	}
}
