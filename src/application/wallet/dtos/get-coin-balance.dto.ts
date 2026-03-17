export interface GetCoinBalanceInput {
	userId: string;
}

export interface GetCoinBalanceOutput {
	coinBalance: number;
	coinValue: number;
}
