import { inject, injectable } from "inversify";
import type {
	CoinTransactionQuery,
	ICoinTransactionRepository,
} from "../../../domain/repositories";
import { TYPES } from "../../../shared/types/types";
import type {
	GetCoinTransactionsInput,
	GetCoinTransactionsOutput,
} from "../dtos/get-coin-transactions.dto";
import { CoinTransactionDtoMapper } from "../mappers/coin-transaction.mapper";
import type { IGetCoinTransactionsUseCase } from "./get-coin-transactions.usecase.interface";

@injectable()
export class GetCoinTransactionsUseCase implements IGetCoinTransactionsUseCase {
	constructor(
		@inject(TYPES.Repositories.CoinTransactionRepository)
		private readonly coinTransactionRepository: ICoinTransactionRepository,
	) {}

	async execute(
		input: GetCoinTransactionsInput,
	): Promise<GetCoinTransactionsOutput> {
		const query: CoinTransactionQuery = {
			userId: input.userId,
			type: input.type,
			transactionOwner: "user",
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
