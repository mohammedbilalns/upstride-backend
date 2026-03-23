import type {
	GetCoinBalanceInput,
	GetCoinBalanceOutput,
} from "../dtos/get-coin-balance.dto";

export interface IGetCoinBalanceUseCase {
	execute(input: GetCoinBalanceInput): Promise<GetCoinBalanceOutput>;
}
